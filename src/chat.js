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

async function sendMessage(text) {
    const trimmed = (text || '').trim()
    if (!trimmed) return

    const msg = { id: 'local-' + Date.now(), visitor_id: visitorId, sender: 'visitor', content: trimmed, created_at: new Date().toISOString() }
    messages.push(msg)
    saveLocalMessages(messages)
    renderMessages()

    try {
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


