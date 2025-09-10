import { supabase } from './supabaseClient.js'

const app = document.getElementById('app')

let session = null
let selectedVisitorId = null
let visitors = []
let messages = []
let channel = null

function upsertVisitorNameInList(visitorId, name) {
  const idx = visitors.findIndex(v => (typeof v === 'string' ? v : v.id) === visitorId)
  if (idx >= 0) {
    const existing = visitors[idx]
    visitors[idx] = { id: (typeof existing === 'string' ? existing : existing.id), name: name || null }
  } else {
    visitors.unshift({ id: visitorId, name: name || null })
  }
}

function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag)
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v
    else if (k === 'text') e.textContent = v
    else e.setAttribute(k, v)
  })
  children.forEach(c => e.appendChild(c))
  return e
}

function renderAuth() {
  app.innerHTML = ''
  const box = el('div', { class: 'auth' })
  const email = el('input', { type: 'email', placeholder: 'Admin email' })
  const pass = el('input', { type: 'password', placeholder: 'Password' })
  // Prefill dev credentials (do not use in production)
  email.value = 'admin@email.com'
  pass.value = 'pass123'
  const login = el('button', { text: 'Sign in' })
  const signup = el('button', { text: 'Create dev admin (if missing)' })
  const note = el('small', { text: 'Dev defaults prefilled: admin@email.com / pass123' })
  login.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.value, password: pass.value })
    if (error) { alert(error.message + "\nIf this is a fresh project, click 'Create dev admin (if missing)'."); return }
    session = data.session
    await renderApp()
  })
  signup.addEventListener('click', async () => {
    const { data, error } = await supabase.auth.signUp({ email: email.value, password: pass.value })
    if (error) { alert(error.message); return }
    if (data.session) {
      session = data.session
      await renderApp()
    } else {
      alert('Dev admin created. Please disable email confirmations or confirm the email, then sign in.')
    }
  })
  ;[email, pass, login, signup, note].forEach(n => box.appendChild(n))
  app.appendChild(box)
}

async function fetchVisitors() {
  // Step 1: pull recent visitor_ids from messages
  const { data: msgs, error } = await supabase
    .from('messages')
    .select('visitor_id, created_at')
    .order('created_at', { ascending: false })
  if (error || !Array.isArray(msgs)) return []
  const seen = new Set()
  const ids = []
  for (const row of msgs) {
    if (row?.visitor_id && !seen.has(row.visitor_id)) {
      seen.add(row.visitor_id)
      ids.push(row.visitor_id)
    }
  }
  if (ids.length === 0) return []

  // Step 2: fetch names for those ids
  const { data: profiles } = await supabase
    .from('visitor_profiles')
    .select('visitor_id, name')
    .in('visitor_id', ids)
  const idToName = new Map()
  if (Array.isArray(profiles)) {
    for (const p of profiles) idToName.set(p.visitor_id, p.name)
  }
  return ids.map(id => ({ id, name: idToName.get(id) || null }))
}

async function fetchMessages(visitorId) {
  const { data, error } = await supabase.from('messages').select('*').eq('visitor_id', visitorId).order('created_at')
  if (error) return []
  return data
}

async function sendAdminMessage(visitorId, content) {
  await supabase.from('messages').insert({ visitor_id: visitorId, sender: 'admin', content })
}

function renderMessagesInto(container, msgs) {
  if (!container) return
  container.innerHTML = ''
  msgs.forEach(m => {
    const row = document.createElement('div')
    row.className = 'row ' + (m.sender === 'admin' ? 'admin' : '')
    const b = document.createElement('div')
    b.className = 'bubble'
    b.textContent = m.content
    row.appendChild(b)
    container.appendChild(row)
  })
}

function renderLayout() {
  app.innerHTML = ''
  const top = el('div', { class: 'topbar' }, [
    el('h2', { text: 'Inbox' }),
    (() => { const b = el('button', { text: 'Sign out' }); b.addEventListener('click', async () => { await supabase.auth.signOut(); session = null; renderAuth() }); return b })()
  ])

  const visitorsPanel = el('div', { class: 'panel' }, [ el('h3', { text: 'Conversations' }) ])
  const searchBar = el('div', { class: 'search' })
  const searchInput = el('input', { placeholder: 'Search name or uuid…' })
  searchBar.appendChild(searchInput)
  visitorsPanel.appendChild(searchBar)
  const visitorList = el('div', { class: 'list' })
  const renderList = (items) => {
    visitorList.innerHTML = ''
    items.forEach(v => {
      const id = typeof v === 'string' ? v : v?.id
      const name = typeof v === 'object' && v ? v.name : null
      if (!id) return
      const idShort = id.slice(0,8) + '…' + id.slice(-4)
      const item = el('div', { class: 'visitor' + (id === selectedVisitorId ? ' active' : '') })
      const left = el('div', {}, [
        el('div', { class: 'vname', text: name || idShort }),
        el('div', { class: 'preview', text: '' })
      ])
      const right = el('div', {}, [ el('span', { class: 'meta', text: '' }) ])
      item.appendChild(left); item.appendChild(right)
      item.addEventListener('click', async () => { selectedVisitorId = id; messages = await fetchMessages(id); renderLayout() })
      visitorList.appendChild(item)
    })
  }
  renderList(visitors)
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase()
    const filtered = visitors.filter(v => {
      const id = typeof v === 'string' ? v : v.id
      const name = typeof v === 'object' && v ? v.name : null
      return (name && name.toLowerCase().includes(q)) || id.toLowerCase().includes(q)
    })
    renderList(filtered)
  })
  visitorsPanel.appendChild(visitorList)

  const threadPanel = el('div', { class: 'panel' })
  const sel = visitors.find(v => (typeof v === 'object' && v && v.id === selectedVisitorId))
  const selDisplay = sel?.name ? sel.name : (selectedVisitorId ? (selectedVisitorId.slice ? selectedVisitorId.slice(0,8) + '…' : '') : '')
  const head = el('div', { class: 'thread-head' }, [ el('h3', { text: selectedVisitorId ? ('Chat · ' + selDisplay) : 'Select a chat' }) ])
  if (selectedVisitorId) {
    const actions = el('div', { class: 'actions' })
    const renameInput = el('input', { value: sel?.name || '', placeholder: 'Set name' })
    const renameBtn = el('button', { text: 'Rename' })
    const clearBtn = el('button', { class: 'danger', text: 'Clear chat' })
    const delBtn = el('button', { class: 'danger', text: 'Delete user' })

    renameBtn.addEventListener('click', async () => {
      const newName = (renameInput.value || '').trim()
      if (!newName) return
      await supabase.from('visitor_profiles').upsert({ visitor_id: selectedVisitorId, name: newName }, { onConflict: 'visitor_id' })
      upsertVisitorNameInList(selectedVisitorId, newName)
      renderLayout()
    })

    clearBtn.addEventListener('click', async () => {
      if (!confirm('Clear all messages for this user?')) return
      await supabase.from('messages').delete().eq('visitor_id', selectedVisitorId)
      messages = []
      renderMessagesInto(document.querySelector('.messages'), messages)
    })

    delBtn.addEventListener('click', async () => {
      if (!confirm('Delete this user profile and all messages?')) return
      await supabase.from('messages').delete().eq('visitor_id', selectedVisitorId)
      await supabase.from('visitor_profiles').delete().eq('visitor_id', selectedVisitorId)
      visitors = visitors.filter(v => (typeof v === 'string' ? v : v.id) !== selectedVisitorId)
      selectedVisitorId = null
      messages = []
      renderLayout()
    })

    actions.appendChild(renameInput)
    actions.appendChild(renameBtn)
    actions.appendChild(clearBtn)
    actions.appendChild(delBtn)
    head.appendChild(actions)
  }
  threadPanel.appendChild(head)
  const thread = el('div', { class: 'messages' })
  renderMessagesInto(thread, messages)
  threadPanel.appendChild(thread)

  const composer = el('div', { class: 'composer' })
  const input = el('textarea', { rows: '1', placeholder: 'Reply…' })
  const send = el('button', { text: 'Send' })
  input.addEventListener('keydown', async (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send.click() } })
  send.addEventListener('click', async () => {
    const text = (input.value || '').trim()
    if (!text || !selectedVisitorId) return
    input.value = ''
    await sendAdminMessage(selectedVisitorId, text)
    messages = await fetchMessages(selectedVisitorId)
    renderMessagesInto(thread, messages)
    setTimeout(() => { try { thread.scrollTop = thread.scrollHeight } catch(_){} }, 0)
  })
  composer.appendChild(input)
  composer.appendChild(send)
  threadPanel.appendChild(composer)

  const layout = el('div', { class: 'layout' }, [ visitorsPanel, threadPanel ])
  app.appendChild(top)
  app.appendChild(layout)
  // ensure thread stays at bottom on render
  setTimeout(() => { try { const t = document.querySelector('.messages'); if (t) t.scrollTop = t.scrollHeight } catch(_){} }, 0)
}

async function renderApp() {
  if (!session) { renderAuth(); return }
  visitors = await fetchVisitors()
  if (selectedVisitorId) messages = await fetchMessages(selectedVisitorId)
  renderLayout()
  // realtime updates
  try {
    if (channel) { supabase.removeChannel(channel); channel = null }
    channel = supabase
      .channel('realtime-admin')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        const row = payload.new
        if (!row) return
        // update visitor list to show newest first
        const idx = visitors.findIndex(v => (typeof v === 'string' ? v : v.id) === row.visitor_id)
        if (idx !== -1) visitors.splice(idx, 1)
        const existing = visitors.find(v => (typeof v === 'object' && v && v.id === row.visitor_id))
        visitors.unshift({ id: row.visitor_id, name: existing?.name ?? null })
        if (selectedVisitorId === row.visitor_id) {
          messages.push(row)
          const t = document.querySelector('.messages')
          renderMessagesInto(t, messages)
          setTimeout(() => { try { if (t) t.scrollTop = t.scrollHeight } catch(_){} }, 0)
        } else {
          renderLayout()
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visitor_profiles' }, (payload) => {
        const vId = payload?.new?.visitor_id || payload?.old?.visitor_id
        const name = payload?.new?.name || null
        if (!vId) return
        upsertVisitorNameInList(vId, name)
        // update any plain-string entries to object with name
        const i = visitors.findIndex(v => (typeof v === 'string' ? v : v.id) === vId)
        if (i !== -1) {
          const id = typeof visitors[i] === 'string' ? visitors[i] : visitors[i].id
          visitors[i] = { id, name }
        }
        renderLayout()
      })
      .subscribe()
  } catch (_) {}
}

supabase.auth.getSession().then(({ data }) => { session = data.session; renderApp() })
supabase.auth.onAuthStateChange((_e, s) => { session = s?.session ?? null; renderApp() })


