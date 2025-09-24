'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSession } from './useSession'

// Map database tier values to expected hook tier types
function mapDatabaseTierToHookTier(dbTier: string): 'basic' | 'pro' | 'enterprise' {
  switch (dbTier.toLowerCase()) {
    case 'basic':
    case 'free':
      return 'basic'
    case 'pro':
    case 'premium':
      return 'pro'
    case 'enterprise':
    case 'admin':
      return 'enterprise'
    default:
      return 'basic'
  }
}

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
          // Map database tier to expected tier type
          const mappedTier = mapDatabaseTierToHookTier(data.tier)
          setTier(mappedTier)
        }
      } catch (_error) {
        // Error handled silently
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
        return Number.POSITIVE_INFINITY
      default:
        return 10
    }
  }

  return { tier, loading, getLeadLimit }
}
