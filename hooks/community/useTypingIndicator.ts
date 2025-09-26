'use client'

import type { RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import { createClient } from '@/lib/supabase/client'

type TypingUser = {
  user_id: string
  name: string
  started_at: string
}

type UseTypingIndicatorOptions = {
  channel: string // e.g., 'thread:uuid', 'dm:user1-user2'
  onTypingStart?: (user: TypingUser) => void
  onTypingStop?: (userId: string) => void
}

export function useTypingIndicator(options: UseTypingIndicatorOptions) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTypingRef = useRef<number>(0)
  const { user } = useSessionContext()
  const supabase = createClient()

  // Clean up typing users that have expired
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      setTypingUsers((prev) =>
        prev.filter((u) => {
          const typingTime = new Date(u.started_at).getTime()
          return now - typingTime < 10_000 // Remove after 10 seconds
        })
      )
    }, 1000)

    return () => clearInterval(cleanupInterval)
  }, [])

  useEffect(() => {
    if (!user) {
      return
    }

    const setupTypingChannel = async () => {
      // Clean up existing channel
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current)
      }

      // Set auth for private channels
      await supabase.realtime.setAuth()

      // Create broadcast channel for typing indicators
      const channel = supabase.channel(`typing:${options.channel}`, {
        config: {
          broadcast: { self: false, ack: true },
          private: true,
        },
      })

      // Listen for typing events
      channel
        .on('broadcast', { event: 'typing_start' }, ({ payload }) => {
          const typingUser = payload as TypingUser
          if (typingUser.user_id !== user.id) {
            setTypingUsers((prev) => {
              // Remove existing entry for this user
              const filtered = prev.filter((u) => u.user_id !== typingUser.user_id)
              // Add new entry
              return [...filtered, typingUser]
            })
            options.onTypingStart?.(typingUser)
          }
        })
        .on('broadcast', { event: 'typing_stop' }, ({ payload }) => {
          const { user_id } = payload as { user_id: string }
          if (user_id !== user.id) {
            setTypingUsers((prev) => prev.filter((u) => u.user_id !== user_id))
            options.onTypingStop?.(user_id)
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
          }
        })

      channelRef.current = channel
    }

    setupTypingChannel()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [
    user,
    options.channel,
    options.onTypingStart,
    options.onTypingStop,
    supabase.channel,
    supabase.realtime.setAuth,
    supabase.removeChannel,
  ])

  // Broadcast typing stop
  const stopTyping = useCallback(async () => {
    if (!(channelRef.current && user && isTyping)) {
      return
    }

    setIsTyping(false)

    await channelRef.current.send({
      type: 'broadcast',
      event: 'typing_stop',
      payload: { user_id: user.id },
    })

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }, [user, isTyping])

  // Broadcast typing start
  const startTyping = useCallback(async () => {
    if (!(channelRef.current && user)) {
      return
    }

    const now = Date.now()
    // Throttle typing events (max once per 2 seconds)
    if (now - lastTypingRef.current < 2000) {
      return
    }

    lastTypingRef.current = now
    setIsTyping(true)

    const typingUser: TypingUser = {
      user_id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      started_at: new Date().toISOString(),
    }

    await channelRef.current.send({
      type: 'broadcast',
      event: 'typing_start',
      payload: typingUser,
    })

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Auto-stop typing after 5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 5000)
  }, [user, stopTyping])

  // Handle input changes
  const handleInputChange = useCallback(() => {
    startTyping()
  }, [startTyping])

  // Format typing users for display
  const getTypingText = useCallback(() => {
    if (typingUsers.length === 0) {
      return null
    }

    if (typingUsers.length === 1) {
      return `${typingUsers[0].name} is typing...`
    }

    if (typingUsers.length === 2) {
      return `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`
    }

    return `${typingUsers[0].name} and ${typingUsers.length - 1} others are typing...`
  }, [typingUsers])

  return {
    typingUsers,
    isTyping,
    startTyping,
    stopTyping,
    handleInputChange,
    getTypingText,
    hasTypingUsers: typingUsers.length > 0,
  }
}
