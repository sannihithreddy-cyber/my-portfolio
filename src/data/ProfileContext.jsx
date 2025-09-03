import React, { createContext, useContext, useEffect, useState } from 'react'

const ProfileCtx = createContext({})

export function ProfileProvider({ children }) {
  const [data, setData] = useState({})

  useEffect(() => {
    let ignore = false
    async function load() {
      const candidates = []
      const envBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
      if (envBase) candidates.push(`${envBase}/api/profile?t=${Date.now()}`)
      // same-origin (works in Vite dev via proxy)
      candidates.push(`/api/profile?t=${Date.now()}`)
      // local fallback for when opening index.html directly or running static build
      candidates.push(`http://localhost:5050/api/profile?t=${Date.now()}`)

      for (const url of candidates) {
        try {
          const res = await fetch(url, { credentials: 'omit' })
          if (res.ok) {
            const remote = await res.json()
            if (!ignore && remote) setData(remote)
            try { window.__PROFILE_DEBUG__ = { ok: true, url, keys: Object.keys(remote || {}) } } catch {}
            try { console.info('[profile] loaded from', url) } catch {}
            break
          }
        } catch (_) {
          // try next candidate
          try { window.__PROFILE_DEBUG__ = { ok: false, url, error: 'fetch failed' } } catch {}
        }
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  return <ProfileCtx.Provider value={data}>{children}</ProfileCtx.Provider>
}

export function useProfile() {
  return useContext(ProfileCtx)
}
