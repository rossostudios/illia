'use client'

import type { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js'
import { useEffect, useRef, useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import { createClient } from '@/lib/supabase/client'

type UserPresence = {
  user_id: string
  name?: string
  avatar_url?: string
  online_at: string
  status: 'online' | 'away' | 'busy'
  current_thread?: string
}

type UsePresenceOptions = {
  channel: string // e.g., 'thread:uuid', 'community:main'
  onUserJoin?: (user: UserPresence) => void
  onUserLeave?: (userId: string) => void
}

export function usePresence(options: UsePresenceOptions) {
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const { user } = useSessionContext()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      return
    }

    const setupPresence = async () => {
      // Clean up existing channel
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current)
      }

      // Set auth for private channels
      await supabase.realtime.setAuth()

      // Create presence channel
      const channel = supabase.channel(options.channel, {
        config: {
          presence: {
            key: user.id,
          },
          private: true,
        },
      })

      // Handle presence sync
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState() as RealtimePresenceState<UserPresence>
          const users = Object.values(state)
            .flat()
            .map((presence) => presence as UserPresence)

          setOnlineUsers(users)
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          if (newPresences && newPresences.length > 0) {
            const newUser = newPresences[0] as UserPresence
            options.onUserJoin?.(newUser)
          }
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          if (key) {
            options.onUserLeave?.(key)
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true)

            // Track our own presence
            const userPresence: UserPresence = {
              user_id: user.id,
              name: user.user_metadata?.name || user.email?.split('@')[0],
              avatar_url: user.user_metadata?.avatar_url,
              online_at: new Date().toISOString(),
              status: 'online',
              current_thread: options.channel.startsWith('thread:')
                ? options.channel.replace('thread:', '')
                : undefined,
            }

            await channel.track(userPresence)

            // Update presence every 30 seconds to show we're still active
            const presenceInterval = setInterval(async () => {
              await channel.track({
                ...userPresence,
                online_at: new Date().toISOString(),
              })
            }, 30_000)

            // Store interval ID for cleanup
            channelRef.current = channel
            ;(channelRef.current as string).presenceInterval = presenceInterval
          } else if (status === 'CHANNEL_ERROR') {
            setIsConnected(false)
          }
        })

      channelRef.current = channel
    }

    setupPresence()

    // Cleanup on unmount or channel change
    return () => {
      if (channelRef.current) {
        const interval = (channelRef.current as string).presenceInterval
        if (interval) {
          clearInterval(interval)
        }
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [
    user,
    options.channel,
    options.onUserJoin,
    options.onUserLeave,
    supabase.channel,
    supabase.realtime.setAuth,
    supabase.removeChannel,
  ])

  // Update user status
  const updateStatus = async (status: 'online' | 'away' | 'busy') => {
    if (!(channelRef.current && user)) {
      return
    }

    const userPresence: UserPresence = {
      user_id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url,
      online_at: new Date().toISOString(),
      status,
      current_thread: options.channel.startsWith('thread:')
        ? options.channel.replace('thread:', '')
        : undefined,
    }

    await channelRef.current.track(userPresence)
  }

  // Get count of online users
  const getOnlineCount = () => onlineUsers.length

  // Check if specific user is online
  const isUserOnline = (userId: string) => onlineUsers.some((u) => u.user_id === userId)

  // Get users by status
  const getUsersByStatus = (status: 'online' | 'away' | 'busy') =>
    onlineUsers.filter((u) => u.status === status)

  return {
    onlineUsers,
    isConnected,
    updateStatus,
    getOnlineCount,
    isUserOnline,
    getUsersByStatus,
  }
}
