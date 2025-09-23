'use client'

import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Thread {
  id: string
  user_id: string
  title: string
  body: string
  category: 'general' | 'housing' | 'services' | 'social' | 'visa' | 'safety' | 'recommendations'
  city_tag?: 'medellin' | 'florianopolis' | null
  tags?: string[] | null
  views_count: number | null
  replies_count: number | null
  last_activity_at?: string | null
  is_pinned: boolean | null
  is_locked: boolean | null
  created_at: string | null
  updated_at: string | null
  author?: {
    name: string | null
    email: string
  }[]
}

interface UseRealtimeThreadsOptions {
  category?: string
  city?: string
  onThreadAdded?: (thread: Thread) => void
  onThreadUpdated?: (thread: Thread) => void
  onThreadDeleted?: (threadId: string) => void
}

export function useRealtimeThreads(options: UseRealtimeThreadsOptions = {}) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabase = createClient()

  // Fetch initial threads
  const fetchThreads = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('community_threads')
        .select(`
          *,
          author:users!user_id (
            name,
            email
          )
        `)
        .order('is_pinned', { ascending: false })
        .order('last_activity_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })

      if (options.category && options.category !== 'all') {
        query = query.eq('category', options.category as 'general' | 'housing' | 'services' | 'social' | 'visa' | 'safety' | 'recommendations')
      }

      if (options.city && options.city !== 'all') {
        query = query.eq('city_tag', options.city as 'medellin' | 'florianopolis')
      }

      const { data, error } = await query

      if (error) {
        // If table doesn't exist, migrations haven't been applied
        if (error.message?.includes('relation') || error.code === '42P01') {
          console.warn(
            'Community tables not yet created. Please run migration 005_realtime_community_safe.sql'
          )
          setThreads([])
          setLoading(false)
          return
        }
        console.warn('Error fetching threads:', error.message)
      }

      setThreads(data || [])
    } catch (err) {
      console.warn('Error fetching threads:', err)
      setError(err as Error)
      setThreads([])
    } finally {
      setLoading(false)
    }
  }

  // Handle real-time updates
  const handleRealtimeUpdate = (payload: RealtimePostgresChangesPayload<Thread>) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        if (newRecord) {
          // Check if thread matches filters
          if (
            (!options.category ||
              options.category === 'all' ||
              newRecord.category === options.category) &&
            (!options.city || options.city === 'all' || newRecord.city_tag === options.city)
          ) {
            setThreads((prev) => {
              // Add new thread at the beginning
              const updated = [newRecord, ...prev]
              // Sort by pinned, then by last_post_at/created_at
              return updated.sort((a, b) => {
                if (a.is_pinned !== b.is_pinned) {
                  return a.is_pinned ? -1 : 1
                }
                const aDate = a.last_activity_at || a.created_at
                const bDate = b.last_activity_at || b.created_at
                return new Date(bDate || 0).getTime() - new Date(aDate || 0).getTime()
              })
            })
            options.onThreadAdded?.(newRecord)
          }
        }
        break

      case 'UPDATE':
        if (newRecord) {
          setThreads((prev) =>
            prev
              .map((thread) => {
                if (thread.id === newRecord.id) {
                  options.onThreadUpdated?.(newRecord)
                  return { ...thread, ...newRecord }
                }
                return thread
              })
              .sort((a, b) => {
                if (a.is_pinned !== b.is_pinned) {
                  return a.is_pinned ? -1 : 1
                }
                const aDate = a.last_activity_at || a.created_at
                const bDate = b.last_activity_at || b.created_at
                return new Date(bDate || 0).getTime() - new Date(aDate || 0).getTime()
              })
          )
        }
        break

      case 'DELETE':
        if (oldRecord) {
          setThreads((prev) => prev.filter((thread) => thread.id !== oldRecord.id))
          options.onThreadDeleted?.(oldRecord.id!)
        }
        break
    }
  }

  useEffect(() => {
    // Fetch initial data
    fetchThreads()

    // Set up real-time subscription
    const setupRealtimeSubscription = async () => {
      // Only set up subscription if we have threads (table exists)
      if (threads.length === 0 && loading) return

      // Clean up existing subscription
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current)
      }

      try {
        // Set auth for private channels
        await supabase.realtime.setAuth()

        // Create channel for community threads
        const channel = supabase
          .channel('community:threads', {
            config: {
              broadcast: { self: true, ack: true },
              presence: { key: 'user_id' },
              private: true,
            },
          })
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'community_threads',
            },
            handleRealtimeUpdate
          )
          .subscribe((status, error) => {
            if (status === 'SUBSCRIBED') {
              console.log('Connected to community realtime')
            } else if (status === 'CHANNEL_ERROR') {
              // Only log if it's not a table doesn't exist error
              if (!error?.message?.includes('relation')) {
                console.warn('Community realtime connection issue:', error?.message)
              }
            }
          })

        channelRef.current = channel
      } catch (err) {
        console.warn('Could not set up realtime subscription:', err)
      }
    }

    if (!loading && threads.length >= 0) {
      setupRealtimeSubscription()
    }

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [options.category, options.city])

  // Increment view count
  const incrementViewCount = async (threadId: string) => {
    try {
      await supabase.rpc('increment_thread_views', { thread_id: threadId })
    } catch (err) {
      console.error('Error incrementing view count:', err)
    }
  }

  // Create new thread
  const createThread = async (thread: Partial<Thread>) => {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('community_threads')
        .insert({
          body: thread.body!,
          category: thread.category!,
          title: thread.title!,
          city_tag: thread.city_tag,
          tags: thread.tags,
          user_id: user.user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error creating thread:', err)
      throw err
    }
  }

  // Update thread
  const updateThread = async (threadId: string, updates: Partial<Thread>) => {
    try {
      const { data, error } = await supabase
        .from('community_threads')
        .update(updates as any)
        .eq('id', threadId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error updating thread:', err)
      throw err
    }
  }

  // Delete thread
  const deleteThread = async (threadId: string) => {
    try {
      const { error } = await supabase.from('community_threads').delete().eq('id', threadId)

      if (error) throw error
    } catch (err) {
      console.error('Error deleting thread:', err)
      throw err
    }
  }

  return {
    threads,
    loading,
    error,
    incrementViewCount,
    createThread,
    updateThread,
    deleteThread,
    refetch: fetchThreads,
  }
}
