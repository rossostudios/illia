import { useCallback, useEffect, useRef, useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Match = Database['public']['Tables']['matches']['Row']

export type MatchFilters = {
  dismissed?: boolean
  viewed?: boolean
  service?: string
  search?: string
}

export interface MatchWithProvider extends Match {
  provider?: {
    id: string
    name: string
    email: string
    service: string
    location: string
    city: string
    rating: number
    verified: boolean
    avatar_url?: string
  }
}

export function useMatches(filters: MatchFilters = {}) {
  const [matches, setMatches] = useState<MatchWithProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useSessionContext()
  const supabase = createClient()

  // Use refs to track if we should fetch
  const hasFetchedRef = useRef(false)
  const channelRef = useRef<any>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchMatches = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    // Cancel any ongoing fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this fetch
    abortControllerRef.current = new AbortController()

    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('matches')
        .select(`
          *,
          service_providers!provider_id (
            id,
            name,
            email,
            services,
            city,
            rating_avg,
            status,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .abortSignal(abortControllerRef.current.signal)

      // Apply filters
      if (filters.dismissed !== undefined) {
        if (filters.dismissed) {
          query = query.not('dismissed_at', 'is', null)
        } else {
          query = query.is('dismissed_at', null)
        }
      }

      if (filters.viewed !== undefined) {
        if (filters.viewed) {
          query = query.not('viewed_at', 'is', null)
        } else {
          query = query.is('viewed_at', null)
        }
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        // Ignore abort errors
        if (fetchError.name === 'AbortError') {
          return
        }
        throw fetchError
      }

      // Transform the data to match our interface
      const transformedData: MatchWithProvider[] = (data || []).map((match) => ({
        ...match,
        provider: match.service_providers
          ? {
              id: match.service_providers.id,
              name: match.service_providers.name,
              email: match.service_providers.email,
              service: match.service_providers.services?.[0] || '',
              location: match.service_providers.city || '',
              city: match.service_providers.city || '',
              rating: match.service_providers.rating_avg || 0,
              verified: match.service_providers.status === 'verified',
              avatar_url: match.service_providers.avatar_url || undefined,
            }
          : undefined,
      }))

      // Apply client-side filters
      let filteredData = transformedData
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredData = transformedData.filter(
          (match) =>
            match.provider?.name.toLowerCase().includes(searchLower) ||
            match.provider?.service.toLowerCase().includes(searchLower) ||
            match.provider?.location.toLowerCase().includes(searchLower)
        )
      }

      if (filters.service && filters.service !== 'All Services') {
        filteredData = filteredData.filter((match) =>
          match.provider?.service.includes(filters.service!)
        )
      }

      setMatches(filteredData)
      setError(null)
    } catch (err: any) {
      // Only set error if not aborted
      if (err?.name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Failed to fetch matches')
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [user?.id, filters.dismissed, filters.viewed, filters.search, filters.service, supabase])

  // Mark match as viewed
  const markAsViewed = useCallback(
    async (matchId: string) => {
      if (!user?.id) {
        return { success: false, error: 'User not authenticated' }
      }

      try {
        const { error: updateError } = await supabase
          .from('matches')
          .update({ viewed_at: new Date().toISOString() })
          .eq('id', matchId)
          .eq('user_id', user.id)

        if (updateError) {
          throw updateError
        }

        // Update local state optimistically
        setMatches((prev) =>
          prev.map((match) =>
            match.id === matchId ? { ...match, viewed_at: new Date().toISOString() } : match
          )
        )

        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to mark match as viewed',
        }
      }
    },
    [user?.id, supabase]
  )

  // Dismiss a match
  const dismissMatch = useCallback(
    async (matchId: string) => {
      if (!user?.id) {
        return { success: false, error: 'User not authenticated' }
      }

      try {
        const { error: updateError } = await supabase
          .from('matches')
          .update({ dismissed_at: new Date().toISOString() })
          .eq('id', matchId)
          .eq('user_id', user.id)

        if (updateError) {
          throw updateError
        }

        // Update local state optimistically
        setMatches((prev) =>
          prev.map((match) =>
            match.id === matchId ? { ...match, dismissed_at: new Date().toISOString() } : match
          )
        )

        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to dismiss match',
        }
      }
    },
    [user?.id, supabase]
  )

  // Create a new match
  const createMatch = useCallback(
    async (providerId: string, score = 85, explanation = 'Manual match created by user') => {
      if (!user?.id) {
        return { success: false, error: 'User not authenticated' }
      }

      try {
        // Check if a match already exists
        const { data: existingMatch } = await supabase
          .from('matches')
          .select('id, dismissed_at')
          .eq('user_id', user.id)
          .eq('provider_id', providerId)
          .single()

        if (existingMatch && !existingMatch.dismissed_at) {
          return { success: false, error: 'Match already exists with this provider' }
        }

        // If a dismissed match exists, reactivate it
        if (existingMatch?.dismissed_at) {
          const { data, error: updateError } = await supabase
            .from('matches')
            .update({
              dismissed_at: null,
              viewed_at: null,
              score,
              explanation,
            })
            .eq('id', existingMatch.id)
            .select()
            .single()

          if (updateError) {
            throw updateError
          }

          await fetchMatches()
          return { success: true, data }
        }

        // Create new match
        const { data, error: createError } = await supabase
          .from('matches')
          .insert({
            user_id: user.id,
            provider_id: providerId,
            score,
            explanation,
            ai_model: 'manual',
          })
          .select()
          .single()

        if (createError) {
          throw createError
        }

        await fetchMatches() // Refresh the list
        return { success: true, data }
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to create match'
        return {
          success: false,
          error: errorMessage,
        }
      }
    },
    [user?.id, supabase, fetchMatches]
  )

  // Delete a match
  const deleteMatch = useCallback(
    async (matchId: string) => {
      if (!user?.id) {
        return { success: false, error: 'User not authenticated' }
      }

      try {
        const { error: deleteError } = await supabase
          .from('matches')
          .delete()
          .eq('id', matchId)
          .eq('user_id', user.id)

        if (deleteError) {
          throw deleteError
        }

        setMatches((prev) => prev.filter((match) => match.id !== matchId))
        return { success: true }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to delete match',
        }
      }
    },
    [user?.id, supabase]
  )

  // Initial fetch when component mounts or filters change
  useEffect(() => {
    if (user?.id) {
      fetchMatches()
    }
  }, [fetchMatches, user?.id])

  // Set up realtime subscription (separate from fetch)
  useEffect(() => {
    if (!user?.id) {
      return
    }

    // Clean up any existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    // Create new channel for realtime updates
    const channel = supabase
      .channel(`matches-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch data when changes occur
          if (hasFetchedRef.current) {
            fetchMatches()
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    // Mark that we've set up the subscription
    hasFetchedRef.current = true

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [user?.id, supabase, fetchMatches]) // Include fetchMatches in dependencies

  return {
    matches,
    loading,
    error,
    markAsViewed,
    dismissMatch,
    createMatch,
    deleteMatch,
    refetch: fetchMatches,
  }
}
