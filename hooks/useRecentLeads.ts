'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSession } from './useSession'
import type { Database } from '@/types/database'

type Lead = Database['public']['Tables']['illia_leads']['Row']

export function useRecentLeads() {
  const { user } = useSession()
  const supabase = createClient()
  const [recentLeads, setRecentLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecentLeads = async () => {
    if (!user?.email) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('illia_leads')
        .select('name, score, created_at')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false })
        .limit(3)

      if (fetchError) throw fetchError

      setRecentLeads(data || [])
    } catch (err: any) {
      console.error('Error fetching recent leads:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecentLeads()
  }, [user])

  return { recentLeads, loading, error, refetch: fetchRecentLeads }
}