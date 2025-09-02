import React, { createContext, useContext, useEffect, useState } from 'react'
import { profile as localProfile } from './profile.js'

const ProfileCtx = createContext(localProfile)

export function ProfileProvider({ children }) {
  const [data, setData] = useState(localProfile)

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
        const url = `${base}/api/profile`
        const res = await fetch(url)
        if (res.ok) {
          const remote = await res.json()
          if (!ignore && remote) setData(remote)
        }
      } catch (e) {
        // ignore – fallback to local profile
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
