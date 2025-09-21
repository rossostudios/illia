'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSession } from './useSession'

export function useCredits() {
  const { user } = useSession()
  const supabase = createClient()
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCredits = async () => {
    if (!user?.email) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('illia_leads_logs')
        .select('count')
        .eq('user_email', user.email)

      if (fetchError) throw fetchError

      const totalCredits = data?.reduce((sum, log) => sum + (log.count || 0), 0) || 0
      setCredits(totalCredits)
    } catch (err: any) {
      console.error('Error fetching credits:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCredits()
  }, [user])

  return { credits, loading, error, refetch: fetchCredits }
}