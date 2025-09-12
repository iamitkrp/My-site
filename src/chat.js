import { supabase } from './supabaseClient.js'

function generateUuid() {
    // RFC4122 v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf) >> 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

const VISITOR_KEY = 'chat_visitor_id'
const VISITOR_NAME_KEY = 'chat_visitor_name'
const MESSAGES_KEY_PREFIX = 'chat_messages_'

let visitorId = localStorage.getItem(VISITOR_KEY)
if (!visitorId) {
    visitorId = generateUuid()
    localStorage.setItem(VISITOR_KEY, visitorId)
}

function loadLocalMessages() {
    try {
        const raw = localStorage.getItem(MESSAGES_KEY_PREFIX + visitorId)
        return raw ? JSON.parse(raw) : []
    } catch (_) {
        return []
    }
}

function saveLocalMessages(messages) {
    localStorage.setItem(MESSAGES_KEY_PREFIX + visitorId, JSON.stringify(messages))
}

let messages = loadLocalMessages()

async function loadHistory() {
    try {
        const { data, error } = await supabase.from('messages').select('*').eq('visitor_id', visitorId).order('created_at', { ascending: true })
        if (!error && Array.isArray(data)) {
            messages = data
            saveLocalMessages(messages)
            renderMessages()
        }
    } catch (_) {}
}

const els = {
    launcher: document.getElementById('chat-launcher'),
    window: document.getElementById('chat-window'),
    list: document.getElementById('chat-messages'),
    nameRow: document.getElementById('chat-name-row'),
    nameInput: document.getElementById('chat-name-input'),
    nameSave: document.getElementById('chat-name-save'),
    clearBtn: document.getElementById('chat-clear'),
    nameStatus: document.getElementById('chat-name-status'),
    input: document.getElementById('chat-input'),
    send: document.getElementById('chat-send'),
    close: document.getElementById('chat-close')
}

function renderMessages() {
    if (!els.list) return
    els.list.innerHTML = ''
    messages.forEach(msg => {
        const wrap = document.createElement('div')
        wrap.className = 'chat-row ' + (msg.sender === 'visitor' ? 'me' : 'them')
        const bubble = document.createElement('div')
        bubble.className = 'chat-bubble'
        bubble.textContent = msg.content
        wrap.appendChild(bubble)
        els.list.appendChild(wrap)
    })
    els.list.scrollTop = els.list.scrollHeight
}

async function saveNameIfPresent(showFeedback = true) {
    const name = (els.nameInput?.value || '').trim()
    console.log('[ChatName] saveNameIfPresent invoked', { name })
    if (!name) return
    try {
        const existing = localStorage.getItem(VISITOR_NAME_KEY) || ''
        if (existing !== name) {
            console.log('[ChatName] writing to localStorage', { previous: existing })
            localStorage.setItem(VISITOR_NAME_KEY, name)
        }
        console.log('[ChatName] upserting to visitor_profiles', { visitorId, name })
        const { data, error } = await supabase
            .from('visitor_profiles')
            .upsert({ visitor_id: visitorId, name }, { onConflict: 'visitor_id' })
            .select()
        if (error) {
            console.error('[ChatName] upsert error', error)
        } else {
            console.log('[ChatName] upsert success', data)
        }
        if (showFeedback) {
            if (els.nameSave) { els.nameSave.classList.add('saved'); setTimeout(() => els.nameSave.classList.remove('saved'), 1200) }
            if (els.nameStatus) { els.nameStatus.textContent = 'Saved'; setTimeout(() => els.nameStatus.textContent = '', 1500) }
        }
    } catch (_) {}
}

async function sendMessage(text) {
    const trimmed = (text || '').trim()
    if (!trimmed) return

    const msg = { id: 'local-' + Date.now(), visitor_id: visitorId, sender: 'visitor', content: trimmed, created_at: new Date().toISOString() }
    messages.push(msg)
    saveLocalMessages(messages)
    renderMessages()

    try {
        await saveNameIfPresent(false)
        await supabase.from('messages').insert({ visitor_id: visitorId, sender: 'visitor', content: trimmed })
    } catch (_) {
        // ignore; local message still shown
    }
}

function wireUi() {
    if (!els.launcher || !els.window) return
    els.launcher.addEventListener('click', () => {
        els.window.style.display = 'flex'
        els.launcher.style.display = 'none'
        renderMessages()
        els.input?.focus()
    })
    // name capture
    try {
        const savedName = localStorage.getItem(VISITOR_NAME_KEY)
        if (els.nameRow) {
            els.nameRow.style.display = 'flex'
        }
        if (savedName && els.nameInput) {
            els.nameInput.value = savedName
        }
    } catch (_) {}
    els.nameSave?.addEventListener('click', async (e) => { 
        e.preventDefault(); 
        console.log('[ChatName] save icon clicked')
        await saveNameIfPresent(true) 
    })
    els.clearBtn?.addEventListener('click', async () => {
        try {
            await supabase.from('messages').delete().eq('visitor_id', visitorId)
            messages = []
            saveLocalMessages(messages)
            renderMessages()
        } catch (err) { console.error('clear chat error', err) }
    })
    els.nameInput?.addEventListener('blur', async () => { await saveNameIfPresent(true) })
    els.nameInput?.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            await saveNameIfPresent(true)
            // After saving name, move focus to the message box so Enter sends next time
            els.input?.focus()
        }
    })
    // silent autosave while typing (debounced)
    let nameDebounce
    els.nameInput?.addEventListener('input', () => {
        clearTimeout(nameDebounce)
        nameDebounce = setTimeout(() => { saveNameIfPresent(false) }, 600)
    })
    els.close?.addEventListener('click', () => {
        els.window.style.display = 'none'
        els.launcher.style.display = 'grid'
    })
    els.send?.addEventListener('click', () => {
        const val = els.input?.value || ''
        if (val.trim()) {
            sendMessage(val)
            if (els.input) els.input.value = ''
        }
    })
    els.input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            const val = els.input?.value || ''
            if (val.trim()) {
                sendMessage(val)
                if (els.input) els.input.value = ''
            }
        }
    })
}

wireUi()
renderMessages()
loadHistory()

// Realtime subscription
try {
    supabase
      .channel('realtime-messages-' + visitorId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'visitor_id=eq.' + visitorId }, (payload) => {
          const row = payload.new
          if (row && row.visitor_id === visitorId) {
              messages.push(row)
              saveLocalMessages(messages)
              renderMessages()
          }
      })
      .subscribe()
} catch (_) {}


