import { supabase } from './supabaseClient.js'

const app = document.getElementById('app')

let session = null
let selectedVisitorId = null
let visitors = []
let messages = []
let channel = null

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
  const { data, error } = await supabase.from('messages').select('visitor_id').order('created_at', { ascending: false })
  if (error) return []
  const seen = new Set()
  const list = []
  for (const row of data) {
    if (!seen.has(row.visitor_id)) { seen.add(row.visitor_id); list.push(row.visitor_id) }
  }
  return list
}

async function fetchMessages(visitorId) {
  const { data, error } = await supabase.from('messages').select('*').eq('visitor_id', visitorId).order('created_at')
  if (error) return []
  return data
}

async function sendAdminMessage(visitorId, content) {
  await supabase.from('messages').insert({ visitor_id: visitorId, sender: 'admin', content })
}

function renderLayout() {
  app.innerHTML = ''
  const top = el('div', { class: 'topbar' }, [
    el('h2', { text: 'Inbox' }),
    (() => { const b = el('button', { text: 'Sign out' }); b.addEventListener('click', async () => { await supabase.auth.signOut(); session = null; renderAuth() }); return b })()
  ])

  const visitorsPanel = el('div', { class: 'panel' }, [ el('h3', { text: 'Conversations' }) ])
  const visitorList = el('div', { class: 'list' })
  visitors.forEach(v => {
    const item = el('div', { class: 'visitor' + (v === selectedVisitorId ? ' active' : ''), text: v.slice(0, 8) + '…' + v.slice(-4) })
    item.addEventListener('click', async () => { selectedVisitorId = v; messages = await fetchMessages(v); renderLayout() })
    visitorList.appendChild(item)
  })
  visitorsPanel.appendChild(visitorList)

  const threadPanel = el('div', { class: 'panel' })
  threadPanel.appendChild(el('h3', { text: selectedVisitorId ? ('Chat · ' + selectedVisitorId.slice(0, 8) + '…') : 'Select a chat' }))
  const thread = el('div', { class: 'messages' })
  messages.forEach(m => {
    const row = el('div', { class: 'row ' + (m.sender === 'admin' ? 'admin' : '') })
    row.appendChild(el('div', { class: 'bubble', text: m.content }))
    thread.appendChild(row)
  })
  threadPanel.appendChild(thread)

  const composer = el('div', { class: 'composer' })
  const input = el('textarea', { rows: '1', placeholder: 'Reply…' })
  const send = el('button', { text: 'Send' })
  send.addEventListener('click', async () => {
    const text = (input.value || '').trim()
    if (!text || !selectedVisitorId) return
    input.value = ''
    await sendAdminMessage(selectedVisitorId, text)
    messages = await fetchMessages(selectedVisitorId)
    renderLayout()
  })
  composer.appendChild(input)
  composer.appendChild(send)
  threadPanel.appendChild(composer)

  const layout = el('div', { class: 'layout' }, [ visitorsPanel, threadPanel ])
  app.appendChild(top)
  app.appendChild(layout)
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
        const idx = visitors.indexOf(row.visitor_id)
        if (idx !== -1) visitors.splice(idx, 1)
        visitors.unshift(row.visitor_id)
        if (selectedVisitorId === row.visitor_id) {
          messages.push(row)
          renderLayout()
        } else {
          renderLayout()
        }
      })
      .subscribe()
  } catch (_) {}
}

supabase.auth.getSession().then(({ data }) => { session = data.session; renderApp() })
supabase.auth.onAuthStateChange((_e, s) => { session = s?.session ?? null; renderApp() })


