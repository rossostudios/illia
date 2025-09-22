'use client'

import type { User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type SessionContextType = {
  user: User | null
  loading: boolean
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
})

export function useSessionContext() {
  return useContext(SessionContext)
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return <SessionContext.Provider value={{ user, loading }}>{children}</SessionContext.Provider>
}
