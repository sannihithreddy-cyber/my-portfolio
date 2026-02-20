import { createContext, useContext, useEffect, useState } from 'react'
import { profile as localProfile } from '@/data/profile.js'

const ProfileCtx = createContext(null)

const RETRY_DELAYS = [2000, 5000, 10000, 15000, 20000]

export function ProfileProvider({ children }) {
  // Start with local fallback so every section renders immediately.
  // API data replaces it once MongoDB responds.
  // Both sources must contain identical data — keep profile.js and banala.json in sync.
  const [data, setData] = useState(localProfile)

  useEffect(() => {
    let ignore = false

    async function tryFetch(candidates) {
      for (const url of candidates) {
        try {
          const res = await fetch(url, { credentials: 'omit' })
          if (res.ok && res.status !== 204) {
            const remote = await res.json()
            if (!ignore && remote && Object.keys(remote).length > 0) {
              // Merge: API data takes priority, but local fallback fills any
              // fields the DB doc doesn't have yet (e.g. experience, education
              // if seeded before the schema was updated on Render).
              setData((prev) => ({ ...prev, ...remote }))
              return true
            }
          }
        } catch (_) {}
      }
      return false
    }

    async function load() {
      const candidates = []
      const envBase = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
      if (envBase) candidates.push(`${envBase}/api/profile?t=${Date.now()}`)
      candidates.push(`/api/profile?t=${Date.now()}`)
      candidates.push(`http://localhost:5050/api/profile?t=${Date.now()}`)

      const ok = await tryFetch(candidates)
      if (ok || ignore) return

      for (const delay of RETRY_DELAYS) {
        await new Promise((r) => setTimeout(r, delay))
        if (ignore) return
        const retried = await tryFetch(candidates)
        if (retried || ignore) return
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
