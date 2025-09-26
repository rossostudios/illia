import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type ServiceProvider = Database['public']['Tables']['service_providers']['Row']

export type ProviderFilters = {
  search?: string
  service?: string
  location?: string
  city?: string
  rating?: number
  verified?: boolean
  limit?: number
  offset?: number
}

export function useProviders(filters: ProviderFilters = {}) {
  const [providers, setProviders] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const supabase = createClient()

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('service_providers')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('rating_avg', { ascending: false })

      // Apply filters
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%,services.cs.{${filters.search}}`
        )
      }

      if (filters.city) {
        query = query.eq('city', filters.city)
      }

      if (filters.service && filters.service !== 'All Services') {
        query = query.contains('services', [filters.service])
      }

      if (filters.location && filters.location !== 'All Areas') {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters.rating) {
        query = query.gte('rating_avg', filters.rating)
      }

      if (filters.verified) {
        // The status column uses the provider_status enum
        query = query.eq('status', 'verified')
      }

      // Pagination
      const limit = filters.limit || 20
      const offset = filters.offset || 0
      query = query.range(offset, offset + limit - 1)

      const { data, error: fetchError, count } = await query

      if (fetchError) {
        throw fetchError
      }

      setProviders(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch providers')
    } finally {
      setLoading(false)
    }
  }, [filters, supabase])

  // Initial fetch
  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  // Set up real-time subscription for provider updates (separate from fetch)
  useEffect(() => {
    // Subscribe to changes
    const channel = supabase
      .channel('providers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_providers',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProviders((prev) => [payload.new as ServiceProvider, ...prev])
            setTotalCount((prev) => prev + 1)
          } else if (payload.eventType === 'UPDATE') {
            setProviders((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as ServiceProvider) : p))
            )
          } else if (payload.eventType === 'DELETE') {
            setProviders((prev) => prev.filter((p) => p.id !== payload.old.id))
            setTotalCount((prev) => prev - 1)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const refetch = useCallback(() => fetchProviders(), [fetchProviders])

  return {
    providers,
    loading,
    error,
    totalCount,
    refetch,
  }
}
