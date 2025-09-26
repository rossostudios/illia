import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

type UseRealtimeOptions = {
  table: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  schema?: string
  filter?: string
  enabled?: boolean
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
  onChange?: (payload: RealtimePostgresChangesPayload<any>) => void
}

/**
 * Optimized real-time subscription hook with automatic cleanup and reconnection
 */
export function useRealtimeOptimized({
  table,
  event = '*',
  schema = 'public',
  filter,
  enabled = true,
  onInsert,
  onUpdate,
  onDelete,
  onChange,
}: UseRealtimeOptions) {
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const subscriptionCountRef = useRef(0)

  const handleChange = useCallback(
    (payload: RealtimePostgresChangesPayload<any>) => {
      // Call the general onChange handler if provided
      onChange?.(payload)

      // Call specific handlers based on event type
      switch (payload.eventType) {
        case 'INSERT':
          onInsert?.(payload.new)
          break
        case 'UPDATE':
          onUpdate?.(payload.new)
          break
        case 'DELETE':
          onDelete?.(payload.old)
          break
      }
    },
    [onChange, onInsert, onUpdate, onDelete]
  )

  const subscribe = useCallback(() => {
    if (!enabled) {
      return
    }

    // Clean up existing subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    // Create unique channel name to avoid conflicts
    const channelName = `${table}_${schema}_${event}_${++subscriptionCountRef.current}`

    // Configure channel options
    const channelOptions: any = {
      event,
      schema,
      table,
    }

    if (filter) {
      channelOptions.filter = filter
    }

    // Create and subscribe to channel
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', channelOptions, handleChange)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
        } else if (status === 'CHANNEL_ERROR') {
          // Attempt reconnection after delay
          reconnectTimeoutRef.current = setTimeout(() => {
            subscribe()
          }, 5000)
        } else if (status === 'TIMED_OUT') {
          subscribe()
        }
      })

    channelRef.current = channel
  }, [enabled, table, schema, event, filter, supabase, handleChange])

  const unsubscribe = useCallback(() => {
    // Clear reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = undefined
    }

    // Remove channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }, [supabase])

  // Set up subscription
  useEffect(() => {
    subscribe()

    return () => {
      unsubscribe()
    }
  }, [subscribe, unsubscribe])

  // Handle page visibility changes for better resource management
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause subscription when page is hidden
        unsubscribe()
      } else {
        // Resume subscription when page is visible
        subscribe()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [subscribe, unsubscribe])

  return {
    isSubscribed: !!channelRef.current,
    resubscribe: subscribe,
    unsubscribe,
  }
}

/**
 * Hook for subscribing to multiple tables with a single subscription
 */
export function useMultiTableRealtime(subscriptions: Array<UseRealtimeOptions & { key: string }>) {
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (subscriptions.length === 0) {
      return
    }

    // Clean up existing subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    // Create a single channel for all subscriptions
    const channel = supabase.channel('multi_table_channel')

    // Add all subscriptions to the channel
    subscriptions.forEach(({ key, table, event = '*', schema = 'public', filter, ...handlers }) => {
      const options: any = {
        event,
        schema,
        table,
      }

      if (filter) {
        options.filter = filter
      }

      channel.on('postgres_changes', options, (payload) => {
        // Call the general onChange handler if provided
        handlers.onChange?.(payload)

        // Call specific handlers based on event type
        switch (payload.eventType) {
          case 'INSERT':
            handlers.onInsert?.(payload.new)
            break
          case 'UPDATE':
            handlers.onUpdate?.(payload.new)
            break
          case 'DELETE':
            handlers.onDelete?.(payload.old)
            break
        }
      })
    })

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
      } else if (status === 'CHANNEL_ERROR') {
      }
    })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [subscriptions, supabase])
}

/**
 * Hook for presence tracking (who's online)
 */
export function usePresence(channelName: string, userId: string, userData?: any) {
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const channel = supabase.channel(channelName)

    // Track presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const _state = channel.presenceState()
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {})
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {})
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
            ...userData,
          })
        }
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        channelRef.current.untrack()
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [channelName, userId, userData, supabase])

  return channelRef.current
}

/**
 * Hook for broadcast messages (real-time messaging)
 */
export function useBroadcast(channelName: string, onMessage: (message: any) => void) {
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  const sendMessage = useCallback((eventName: string, payload: any) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: eventName,
        payload,
      })
    }
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: '*' }, ({ event, payload }) => {
        onMessage({ event, payload })
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
        }
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [channelName, onMessage, supabase])

  return { sendMessage }
}
