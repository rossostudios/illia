'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSession } from './useSession'

export function useTier() {
  const { user } = useSession()
  const supabase = createClient()
  const [tier, setTier] = useState<'basic' | 'pro' | 'enterprise'>('basic')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTier = async () => {
      if (!user?.email) {
        setLoading(false)
        return
      }

      try {
        const { data } = await supabase
          .from('purchases')
          .select('tier')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (data) {
          setTier(data.tier)
        }
      } catch (error) {
        console.error('Error fetching tier:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTier()
  }, [user, supabase])

  const getLeadLimit = () => {
    switch (tier) {
      case 'basic':
        return 10
      case 'pro':
        return 50
      case 'enterprise':
        return Infinity
      default:
        return 10
    }
  }

  return { tier, loading, getLeadLimit }
}