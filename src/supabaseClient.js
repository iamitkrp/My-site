import { createClient } from '@supabase/supabase-js'

// Read from Vite env (defined in .env.local). These are safe for client-side.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf) >> 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

// Ensure we always send the visitor id header for RLS
const VISITOR_KEY = 'chat_visitor_id'
let visitorId = null
try {
    visitorId = localStorage.getItem(VISITOR_KEY)
    if (!visitorId) {
        visitorId = generateUuid()
        localStorage.setItem(VISITOR_KEY, visitorId)
    }
} catch (_) {
    // localStorage might be unavailable in some contexts; header will be omitted
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    },
    global: {
        headers: Object.assign({}, visitorId ? { 'x-visitor-id': visitorId } : {})
    }
})

// Ensure every network request carries the visitor header (helps in incognito/new sessions)
try {
    const _origFetch = window.fetch
    window.fetch = async function(resource, options) {
        try {
            const vId = localStorage.getItem(VISITOR_KEY)
            if (vId) {
                const opts = options ? { ...options } : {}
                const prev = (opts && opts.headers) ? opts.headers : {}
                opts.headers = { ...(prev || {}), 'x-visitor-id': vId }
                return _origFetch(resource, opts)
            }
        } catch (_) {}
        return _origFetch(resource, options)
    }
} catch (_) {}


