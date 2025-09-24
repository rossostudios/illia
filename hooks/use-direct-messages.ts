'use client'

import type { RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import { createClient } from '@/lib/supabase/client'

export type Message = {
  id: string
  conversation_id: string | null
  sender_id: string | null
  receiver_id: string | null
  message: string
  message_type: string | null
  attachments?: any
  is_read: boolean | null
  is_delivered: boolean | null
  created_at: string | null
  edited_at?: string | null
  deleted_at?: string | null
  sender?: {
    id: string
    name: string
    email: string
    avatar_url?: string
  } | null
}

export type Conversation = {
  conversation_id: string
  last_message_at: string
  last_message_preview: string
  unread_count: number
  other_user_id: string
  other_user_name: string
  other_user_email: string
  other_user_tier?: string
  is_provider: boolean
}

type UseDirectMessagesOptions = {
  conversationId?: string
  otherUserId?: string
  onMessageReceived?: (message: Message) => void
  onMessageRead?: (messageId: string) => void
  onTyping?: (userId: string, isTyping: boolean) => void
}

export function useDirectMessages(options: UseDirectMessagesOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const channelRef = useRef<RealtimeChannel | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { user } = useSessionContext()
  const supabase = createClient()

  // Fetch conversations list
  const fetchConversations = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      const { data, error } = await supabase.rpc('get_user_conversations', {
        p_user_id: user.id,
      })

      if (error) {
        // If the function doesn't exist, it means migrations haven't been applied
        if (error.message?.includes('function') || error.code === '42883') {
          setConversations([])
          return
        }
      }
      setConversations(data || [])
    } catch (_error) {
      setConversations([])
    }
  }, [user, supabase])

  // Mark messages as read - moved before fetchMessages to avoid initialization error
  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!user) {
        return
      }

      try {
        await supabase.rpc('mark_messages_read', {
          p_conversation_id: conversationId,
          p_user_id: user.id,
        })

        // Update local state
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            is_read: msg.receiver_id === user.id ? true : msg.is_read,
          }))
        )

        // Update conversation unread count
        setConversations((prev) =>
          prev.map((conv) => (conv.id === conversationId ? { ...conv, unread_count: 0 } : conv))
        )
      } catch (_error) {
        // Error handled silently
      }
    },
    [user, supabase]
  )

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async () => {
    if (!(options.conversationId || options.otherUserId)) {
      return
    }
    if (!user) {
      return
    }

    try {
      setLoading(true)

      let conversationId = options.conversationId

      // Get or create conversation if we have otherUserId
      if (!conversationId && options.otherUserId) {
        const { data, error } = await supabase.rpc('get_or_create_conversation', {
          user1_id: user.id,
          user2_id: options.otherUserId,
        })

        if (error) {
          throw error
        }
        conversationId = data
      }

      if (!conversationId) {
        return
      }

      // Fetch messages
      const { data: messages, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:users!sender_id (
            id,
            name,
            email
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      setMessages((messages || []) as Message[])

      // Mark messages as read
      if (messages && messages.length > 0) {
        await markAsRead(conversationId)
      }
    } catch (_error) {
      // Error handled silently
    } finally {
      setLoading(false)
    }
  }, [options.conversationId, options.otherUserId, user, supabase, markAsRead])

  // Send a message
  const sendMessage = useCallback(
    async (text: string, type: 'text' | 'image' | 'file' = 'text', attachments?: any[]) => {
      if (!(user && options.otherUserId)) {
        return
      }
      if (!text.trim() && type === 'text') {
        return
      }

      try {
        setSending(true)

        const { data, error } = await supabase.rpc('send_message', {
          p_sender_id: user.id,
          p_receiver_id: options.otherUserId,
          p_message: text,
          p_message_type: type,
          p_attachments: attachments || [],
        })

        if (error) {
          throw error
        }

        // Optimistically add message to list
        const newMessage: Message = {
          id: data,
          conversation_id: options.conversationId || '',
          sender_id: user.id,
          receiver_id: options.otherUserId,
          message: text,
          message_type: type,
          attachments: attachments || [],
          is_read: false,
          is_delivered: true,
          created_at: new Date().toISOString(),
          sender: {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || '',
            email: user.email || '',
          },
        }

        setMessages((prev) => [...prev, newMessage])

        return data
      } finally {
        setSending(false)
      }
    },
    [user, options.otherUserId, options.conversationId, supabase]
  )

  // Delete a message
  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!user) {
        return
      }

      try {
        const { error } = await supabase
          .from('direct_messages')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', messageId)
          .eq('sender_id', user.id)

        if (error) {
          throw error
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, deleted_at: new Date().toISOString() } : msg
          )
        )
      } catch (_error) {
        // Error handled silently
      }
    },
    [user, supabase]
  )

  // Edit a message
  const editMessage = useCallback(
    async (messageId: string, newText: string) => {
      if (!user) {
        return
      }

      try {
        const { error } = await supabase
          .from('direct_messages')
          .update({
            message: newText,
            edited_at: new Date().toISOString(),
          })
          .eq('id', messageId)
          .eq('sender_id', user.id)

        if (error) {
          throw error
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, message: newText, edited_at: new Date().toISOString() }
              : msg
          )
        )
      } catch (_error) {
        // Error handled silently
      }
    },
    [user, supabase]
  )

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    async (isTyping: boolean) => {
      if (!(channelRef.current && user && options.otherUserId)) {
        return
      }

      await channelRef.current.send({
        type: 'broadcast',
        event: isTyping ? 'typing_start' : 'typing_stop',
        payload: { user_id: user.id },
      })

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Auto-stop typing after 3 seconds
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          sendTypingIndicator(false)
        }, 3000)
      }
    },
    [user, options.otherUserId]
  )

  // Block/unblock user
  const blockUser = useCallback(
    async (userIdToBlock: string, reason?: string) => {
      if (!user) {
        return
      }
      const { error } = await supabase.from('blocked_users').insert({
        user_id: user.id,
        blocked_user_id: userIdToBlock,
        reason,
      })

      if (error) {
        throw error
      }
    },
    [user, supabase]
  )

  const unblockUser = useCallback(
    async (userIdToUnblock: string) => {
      if (!user) {
        return
      }
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('user_id', user.id)
        .eq('blocked_user_id', userIdToUnblock)

      if (error) {
        throw error
      }
    },
    [user, supabase]
  )

  // Set up real-time subscription
  useEffect(() => {
    if (!user) {
      return
    }

    const setupRealtimeSubscription = async () => {
      // Clean up existing subscription
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current)
      }

      // Create DM channel for the user pair
      const channelName = options.otherUserId
        ? `dm:${[user.id, options.otherUserId].sort().join(':')}`
        : `dm:user:${user.id}`

      await supabase.realtime.setAuth()

      const channel = supabase
        .channel(channelName, {
          config: {
            broadcast: { self: false, ack: true },
            private: true,
          },
        })
        .on('broadcast', { event: 'message_sent' }, ({ payload }) => {
          const message = payload as Message
          setMessages((prev) => {
            // Check if message already exists (optimistic update)
            if (prev.some((m) => m.id === message.id)) {
              return prev
            }
            return [...prev, message]
          })
          options.onMessageReceived?.(message)
        })
        .on('broadcast', { event: 'message_read' }, ({ payload }) => {
          const { message_id } = payload
          setMessages((prev) =>
            prev.map((msg) => (msg.id === message_id ? { ...msg, is_read: true } : msg))
          )
          options.onMessageRead?.(message_id)
        })
        .on('broadcast', { event: 'typing_start' }, ({ payload }) => {
          const { user_id } = payload
          if (user_id !== user.id) {
            setTypingUsers((prev) => new Set(prev).add(user_id))
            options.onTyping?.(user_id, true)
          }
        })
        .on('broadcast', { event: 'typing_stop' }, ({ payload }) => {
          const { user_id } = payload
          setTypingUsers((prev) => {
            const next = new Set(prev)
            next.delete(user_id)
            return next
          })
          options.onTyping?.(user_id, false)
        })
        .subscribe()

      channelRef.current = channel
    }

    setupRealtimeSubscription()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [
    user,
    options.otherUserId,
    supabase,
    options.onMessageRead,
    options.onMessageReceived,
    options.onTyping,
  ])

  // Fetch data on mount or when options change
  useEffect(() => {
    if (options.conversationId || options.otherUserId) {
      fetchMessages()
    } else {
      fetchConversations()
    }
  }, [options.conversationId, options.otherUserId, fetchMessages, fetchConversations])

  return {
    messages,
    conversations,
    loading,
    sending,
    typingUsers: Array.from(typingUsers),
    sendMessage,
    deleteMessage,
    editMessage,
    markAsRead,
    sendTypingIndicator,
    blockUser,
    unblockUser,
    refetchMessages: fetchMessages,
    refetchConversations: fetchConversations,
  }
}
