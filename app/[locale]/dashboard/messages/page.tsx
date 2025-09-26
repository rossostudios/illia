'use client'

import clsx from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCheck,
  ChevronLeft,
  Clock,
  Edit2,
  Loader2,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Star,
  Trash2,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useSessionContext } from '@/components/SessionProvider'
import { type Conversation, type Message, useDirectMessages } from '@/hooks/use-direct-messages'
import { createClient } from '@/lib/supabase/client'

const SEARCH_DEBOUNCE_MS = 250

export type Recipient = {
  id: string
  name: string
  email: string | null
  city: string | null
  tier: string | null
  avatarUrl: string | null
  languages: string[]
  services: string[]
  specialties: string[]
  bio: string | null
  ratingAverage: number | null
  reviewsCount: number | null
  status: string | null
}

const DEFAULT_RECIPIENT: Recipient = {
  id: '',
  name: 'Illia provider',
  email: null,
  city: null,
  tier: null,
  avatarUrl: null,
  languages: [],
  services: [],
  specialties: [],
  bio: null,
  ratingAverage: null,
  reviewsCount: null,
  status: null,
}

type RecipientSource = Record<string, unknown>

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

function getString(source: RecipientSource, key: string): string | null {
  const value = source[key]
  return typeof value === 'string' ? value : null
}

function getNumber(source: RecipientSource, key: string): number | null {
  const value = source[key]
  return typeof value === 'number' ? value : null
}

function normalizeRecipient(entry: RecipientSource = {}): Recipient {
  const email = getString(entry, 'email')
  const rawName = getString(entry, 'name')
  const fallbackName = email?.split?.('@')[0] || 'Illia provider'
  const avatarUrl = getString(entry, 'avatarUrl') ?? getString(entry, 'avatar_url')
  const ratingAverage = getNumber(entry, 'ratingAverage') ?? getNumber(entry, 'rating_avg')
  const reviewsCount = getNumber(entry, 'reviewsCount') ?? getNumber(entry, 'reviews_count')

  return {
    id: getString(entry, 'id') ?? '',
    name: rawName && rawName.trim().length > 0 ? rawName : fallbackName,
    email,
    city: getString(entry, 'city'),
    tier: getString(entry, 'tier'),
    avatarUrl,
    languages: toStringArray(entry.languages),
    services: toStringArray(entry.services),
    specialties: toStringArray(entry.specialties),
    bio: getString(entry, 'bio'),
    ratingAverage,
    reviewsCount,
    status: getString(entry, 'status'),
  }
}

export default function MessagesPage() {
  const params = useParams()
  const supabase = useMemo(() => createClient(), [])
  const { user } = useSessionContext()
  const locale = (params?.locale as string) || 'en'

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [selectedOtherUserId, setSelectedOtherUserId] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'providers'>('all')
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showMobileConversation, setShowMobileConversation] = useState(false)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [recipientSearch, setRecipientSearch] = useState('')
  const [recipientResults, setRecipientResults] = useState<Recipient[]>([])
  const [recipientLoading, setRecipientLoading] = useState(false)
  const [recipientError, setRecipientError] = useState<string | null>(null)
  const [startingConversation, setStartingConversation] = useState(false)
  const [recipientMap, setRecipientMap] = useState<Record<string, Recipient>>({})

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null)

  const {
    messages,
    conversations,
    loading,
    sending,
    typingUsers,
    sendMessage,
    deleteMessage,
    editMessage,
    markAsRead,
    sendTypingIndicator,
    refetchConversations,
    conversationId,
  } = useDirectMessages({
    conversationId: selectedConversation || undefined,
    otherUserId: selectedOtherUserId || undefined,
    onMessageReceived: () => {
      refetchConversations()
      scrollToBottom()
    },
  })

  const totalUnread = useMemo(
    () => conversations.reduce((sum, conv) => sum + conv.unread_count, 0),
    [conversations]
  )

  const providerConversations = useMemo(
    () => conversations.filter((conv) => conv.is_provider).length,
    [conversations]
  )

  const searchValue = searchQuery.trim().toLowerCase()

  const filteredConversations = useMemo(() => {
    const base = conversations.filter((conv) => {
      const matchesSearch =
        !searchValue ||
        conv.other_user_name.toLowerCase().includes(searchValue) ||
        conv.last_message_preview?.toLowerCase().includes(searchValue)

      if (!matchesSearch) {
        return false
      }

      if (filterType === 'unread') {
        return conv.unread_count > 0
      }

      if (filterType === 'providers') {
        return conv.is_provider
      }

      return true
    })

    return base.sort((a, b) => {
      const aTime = a.last_message_at ? new Date(a.last_message_at).getTime() : 0
      const bTime = b.last_message_at ? new Date(b.last_message_at).getTime() : 0
      return bTime - aTime
    })
  }, [conversations, filterType, searchValue])

  const unreadConversations = filteredConversations.filter((conv) => conv.unread_count > 0)
  const readConversations = filteredConversations.filter((conv) => conv.unread_count === 0)

  const currentConversation = conversations.find((c) => c.conversation_id === selectedConversation)
  const currentRecipient = selectedOtherUserId
    ? (recipientMap[selectedOtherUserId] ?? DEFAULT_RECIPIENT)
    : null

  let conversationListContent: React.ReactElement

  if (loading) {
    conversationListContent = (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        <p className="text-gray-500 text-sm dark:text-gray-400">Loading your conversations…</p>
      </div>
    )
  } else if (filteredConversations.length === 0) {
    conversationListContent = (
      <div className="px-6 py-16 text-center">
        <Users className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
        <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-white">
          {searchQuery ? 'No conversations found' : 'Start your first conversation'}
        </h3>
        <p className="text-gray-500 text-sm dark:text-gray-400">
          {searchQuery
            ? 'Try searching by a different name or keyword.'
            : 'Browse providers and open a new chat from their profile.'}
        </p>
      </div>
    )
  } else {
    const unreadList = filterType === 'all' ? unreadConversations : filteredConversations

    conversationListContent = (
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {filterType === 'all' && unreadConversations.length > 0 && (
          <ConversationSectionLabel title="Unread" />
        )}
        {unreadList.map((conv) => (
          <ConversationListItem
            active={selectedConversation === conv.conversation_id}
            conversation={conv}
            key={conv.conversation_id}
            onSelect={() => selectConversation(conv)}
          />
        ))}
        {filterType === 'all' && unreadConversations.length > 0 && readConversations.length > 0 && (
          <ConversationSectionLabel title="Earlier" />
        )}
        {filterType === 'all' &&
          readConversations.map((conv) => (
            <ConversationListItem
              active={selectedConversation === conv.conversation_id}
              conversation={conv}
              key={conv.conversation_id}
              onSelect={() => selectConversation(conv)}
            />
          ))}
      </div>
    )
  }

  const typingActive = selectedOtherUserId && typingUsers.some((id) => id === selectedOtherUserId)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (messages.length >= 0) {
      scrollToBottom()
    }
  }, [messages, scrollToBottom])

  // Prefill recipient details from conversation list
  useEffect(() => {
    if (!selectedOtherUserId || recipientMap[selectedOtherUserId]) {
      return
    }

    const controller = new AbortController()
    const fetchRecipient = async () => {
      try {
        const response = await fetch(`/api/messages/recipients?id=${selectedOtherUserId}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          return
        }
        const payload = await response.json()
        if (payload?.recipient) {
          setRecipientError(null)
          setRecipientMap((prev) => ({
            ...prev,
            [selectedOtherUserId]: normalizeRecipient(payload.recipient),
          }))
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setRecipientError('Unable to load provider details right now.')
        }
      }
    }

    fetchRecipient()
    return () => controller.abort()
  }, [selectedOtherUserId, recipientMap])

  // Fetch recipient options when the modal is open
  useEffect(() => {
    if (!isNewChatOpen) {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current)
      }
      setRecipientSearch('')
      setRecipientResults([])
      setRecipientError(null)
      return
    }

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current)
    }

    setRecipientLoading(true)
    searchTimerRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams()
        if (recipientSearch) {
          params.set('q', recipientSearch)
        }
        params.set('limit', '25')

        const response = await fetch(`/api/messages/recipients?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Unable to load providers')
        }

        const payload = await response.json()
        const results = Array.isArray(payload?.recipients)
          ? payload.recipients.map(normalizeRecipient)
          : []

        setRecipientResults(results)
        setRecipientError(null)
        setRecipientMap((prev) => {
          const next = { ...prev }
          for (const item of results) {
            next[item.id] = item
          }
          return next
        })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setRecipientError('Unable to load providers right now. Please try again.')
        }
      } finally {
        setRecipientLoading(false)
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current)
      }
    }
  }, [isNewChatOpen, recipientSearch])

  const selectConversation = useCallback(
    (conv: (typeof conversations)[number]) => {
      setSelectedConversation(conv.conversation_id)
      setSelectedOtherUserId(conv.other_user_id)
      setShowMobileConversation(true)
      markAsRead(conv.conversation_id)
      setRecipientMap((prev) => {
        if (prev[conv.other_user_id]) {
          return prev
        }
        return {
          ...prev,
          [conv.other_user_id]: {
            ...DEFAULT_RECIPIENT,
            id: conv.other_user_id,
            name: conv.other_user_name,
            email: conv.other_user_email,
            tier: conv.other_user_tier ?? null,
          },
        }
      })
    },
    [markAsRead]
  )

  const handleSendMessage = useCallback(async () => {
    if (!(messageText.trim() && selectedOtherUserId)) {
      return
    }

    try {
      await sendMessage(messageText)
      setMessageText('')
      messageInputRef.current?.focus()
    } catch (_error) {
      toast.error('Message not sent', {
        description: 'Please check your connection and try again.',
      })
    }
  }, [messageText, selectedOtherUserId, sendMessage])

  const handleEditMessage = useCallback(async () => {
    if (!(editText.trim() && editingMessageId)) {
      return
    }

    try {
      await editMessage(editingMessageId, editText)
      setEditingMessageId(null)
      setEditText('')
    } catch (_error) {
      toast.error('Unable to update message')
    }
  }, [editText, editingMessageId, editMessage])

  const handleStartConversation = useCallback(
    async (recipient: Recipient) => {
      if (!user) {
        toast.error('You need an account to start a conversation.')
        return
      }

      try {
        setStartingConversation(true)
        const { data, error } = await (supabase as any)
          .rpc('get_or_create_conversation', {
            user1_id: user.id,
            user2_id: recipient.id,
          })

        if (error) {
          throw error
        }

        const conversationId = data as string
        setSelectedConversation(conversationId)
        setSelectedOtherUserId(recipient.id)
        setShowMobileConversation(true)
        setIsNewChatOpen(false)
        setRecipientMap((prev) => ({ ...prev, [recipient.id]: recipient }))
        await refetchConversations()
        markAsRead(conversationId)
        setTimeout(() => {
          messageInputRef.current?.focus()
        }, 150)
      } catch (error) {
        toast.error('Unable to start chat', {
          description: (error as Error)?.message ?? 'Please try again in a moment.',
        })
      } finally {
        setStartingConversation(false)
      }
    },
    [user, supabase, refetchConversations, markAsRead]
  )

  const stats = useMemo(
    () => [
      {
        label: 'Active conversations',
        value: conversations.length,
        description: 'Chats you have open across Illia',
      },
      {
        label: 'Unread messages',
        value: totalUnread,
        description:
          totalUnread === 1 ? 'Message waiting for a reply' : 'Messages waiting for a reply',
      },
      {
        label: 'Provider chats',
        value: providerConversations,
        description: 'Direct threads with vetted providers',
      },
    ],
    [conversations.length, totalUnread, providerConversations]
  )

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-gray-50 dark:bg-gray-900">
      <header className="border-gray-200 border-b bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950/70">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-teal-100 px-3 py-1 font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
                Messaging hub
              </span>
              {conversationId && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-500 text-xs dark:bg-gray-800 dark:text-gray-400">
                  Conversation #{conversationId.slice(0, 8)}
                </span>
              )}
            </div>
            <h1 className="mt-3 font-semibold text-3xl text-gray-900 tracking-tight dark:text-white">
              Messages
            </h1>
            <p className="mt-2 max-w-3xl text-gray-500 dark:text-gray-400">
              Stay in touch with Illia providers, track ongoing conversations, and pick up where you
              left off faster.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="hover:-translate-y-0.5 inline-flex items-center gap-2 rounded-full border border-transparent bg-gray-900 px-5 py-2 font-medium text-white shadow-lg transition-transform hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 focus-visible:outline-offset-2 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
              onClick={() => setIsNewChatOpen(true)}
              type="button"
            >
              <Plus className="h-4 w-4" />
              New chat
            </button>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-teal-400 dark:hover:text-teal-300"
              href={`/${locale}/dashboard/directory`}
            >
              Browse providers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              key={stat.label}
            >
              <p className="text-gray-500 text-sm dark:text-gray-400">{stat.label}</p>
              <p className="mt-2 font-semibold text-3xl text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">{stat.description}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={clsx(
            'flex w-full flex-col border-gray-200 bg-white md:w-80 lg:w-96 dark:border-gray-800 dark:bg-gray-950/40',
            showMobileConversation ? 'hidden md:flex' : 'flex'
          )}
        >
          <div className="border-gray-200 border-b p-4 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
                <input
                  className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-gray-900 text-sm shadow-inner transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name or keyword"
                  type="text"
                  value={searchQuery}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All conversations' },
                { key: 'unread', label: 'Unread' },
                { key: 'providers', label: 'Providers' },
              ].map((option) => (
                <button
                  className={clsx(
                    'rounded-full border px-3 py-1 font-medium text-xs transition-all hover:border-teal-500 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-300',
                    filterType === option.key
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-900/40 dark:text-teal-200'
                      : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400'
                  )}
                  key={option.key}
                  onClick={() => setFilterType(option.key as typeof filterType)}
                  type="button"
                >
                  {option.label}
                  {option.key === 'unread' && totalUnread > 0 && (
                    <span className="ml-2 inline-flex min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                      {totalUnread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">{conversationListContent}</div>
        </aside>

        {(selectedConversation || selectedOtherUserId) && currentConversation ? (
          <section
            className={clsx(
              'flex flex-1 flex-col bg-white dark:bg-gray-950/60',
              showMobileConversation ? 'flex' : 'hidden md:flex'
            )}
          >
            <div className="border-gray-200 border-b bg-white/90 px-6 py-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-1 items-start gap-4">
                  <button
                    className="rounded-full p-2 transition-colors hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
                    onClick={() => setShowMobileConversation(false)}
                    type="button"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <RecipientAvatar
                    avatarUrl={currentRecipient?.avatarUrl}
                    name={currentRecipient?.name ?? currentConversation.other_user_name}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-gray-900 text-xl dark:text-white">
                        {currentRecipient?.name || currentConversation.other_user_name}
                      </h2>
                      {currentConversation.is_provider && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-teal-700 text-xs dark:bg-teal-900/30 dark:text-teal-300">
                          <ShieldCheck className="h-3 w-3" /> Verified provider
                        </span>
                      )}
                      {currentRecipient?.ratingAverage && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-200">
                          <Star className="h-3 w-3" />
                          {currentRecipient.ratingAverage.toFixed(1)} (
                          {currentRecipient.reviewsCount ?? 0} reviews)
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-500 text-sm dark:text-gray-400">
                      {currentRecipient?.services.length ? (
                        <span>
                          Services: {currentRecipient.services.slice(0, 3).join(', ')}
                          {currentRecipient.services.length > 3 && '…'}
                        </span>
                      ) : null}
                      {currentRecipient?.city && <span>Based in {currentRecipient.city}</span>}
                      {currentRecipient?.languages.length ? (
                        <span>
                          Speaks {currentRecipient.languages.slice(0, 2).join(', ')}
                          {currentRecipient.languages.length > 2 && '…'}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-6 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900/90">
                {messages.length === 0 ? (
                  <div className="mt-16 rounded-3xl border border-teal-200 border-dashed bg-white/60 p-10 text-center shadow-sm dark:border-teal-900/30 dark:bg-gray-900/40">
                    <MessageSquare className="mx-auto mb-4 h-10 w-10 text-teal-500" />
                    <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                      Start the conversation
                    </h3>
                    <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                      Introduce yourself, share project details, or ask a quick question—your
                      provider will be notified instantly.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((message, index) => {
                      const previousMessage = messages[index - 1]
                      const isOwn = message.sender_id === user?.id
                      const showTimestamp = shouldShowTimestamp(previousMessage, message)

                      return (
                        <div className="space-y-2" key={message.id}>
                          {showTimestamp && (
                            <div className="flex items-center justify-center">
                              <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-400 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">
                                {new Date(message.created_at ?? Date.now()).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className={clsx('flex', isOwn ? 'justify-end' : 'justify-start')}
                            initial={{ opacity: 0, y: 12 }}
                          >
                            <div
                              className={clsx(
                                'group relative max-w-[75%] rounded-2xl px-4 py-3 shadow-sm lg:max-w-[60%]',
                                isOwn
                                  ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white'
                                  : 'border border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                              )}
                            >
                              {editingMessageId === message.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                                    onChange={(event) => setEditText(event.target.value)}
                                    rows={2}
                                    value={editText}
                                  />
                                  <div className="flex gap-2 text-xs">
                                    <button
                                      className="rounded-lg bg-white px-3 py-1 font-medium text-teal-600 hover:bg-gray-50 dark:bg-gray-700 dark:text-teal-400"
                                      onClick={handleEditMessage}
                                      type="button"
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="rounded-lg bg-gray-100 px-3 py-1 font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                      onClick={() => {
                                        setEditingMessageId(null)
                                        setEditText('')
                                      }}
                                      type="button"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="whitespace-pre-wrap break-words text-sm">
                                    {message.deleted_at ? (
                                      <span className="italic opacity-70">Message deleted</span>
                                    ) : (
                                      message.message
                                    )}
                                  </p>
                                  <div className="mt-1 flex items-center justify-between gap-3 text-xs">
                                    <span
                                      className={
                                        isOwn
                                          ? 'text-teal-100/80'
                                          : 'text-gray-500 dark:text-gray-400'
                                      }
                                    >
                                      {new Date(
                                        message.created_at ?? Date.now()
                                      ).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                      {message.edited_at && ' · edited'}
                                    </span>
                                    {isOwn && (
                                      <span className="text-teal-100">
                                        {renderDeliveryStatusIcon(message)}
                                      </span>
                                    )}
                                  </div>
                                  {isOwn && !message.deleted_at && (
                                    <div className="-right-24 -translate-y-1/2 absolute top-1/2 hidden items-center gap-1 group-hover:flex">
                                      <button
                                        className="rounded-lg bg-white p-2 shadow transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-700"
                                        onClick={() => {
                                          setEditingMessageId(message.id)
                                          setEditText(message.message)
                                        }}
                                        type="button"
                                      >
                                        <Edit2 className="h-4 w-4 text-gray-500" />
                                      </button>
                                      <button
                                        className="rounded-lg bg-white p-2 shadow transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-700"
                                        onClick={() => deleteMessage(message.id)}
                                        type="button"
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {typingActive && (
                <div className="px-6 pb-2 text-gray-500 text-sm dark:text-gray-400">
                  {currentRecipient?.name || 'They'} is typing…
                </div>
              )}

              <div className="border-gray-200 border-t bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950/60">
                <div className="flex items-end gap-3">
                  <button
                    className="rounded-lg p-2.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
                    disabled
                    title="File uploads coming soon"
                    type="button"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <div className="flex-1">
                    <textarea
                      className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 text-sm shadow focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400"
                      onBlur={() => sendTypingIndicator(false)}
                      onChange={(event) => {
                        setMessageText(event.target.value)
                        sendTypingIndicator(true)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Write a message…"
                      ref={messageInputRef}
                      rows={1}
                      value={messageText}
                    />
                  </div>
                  <button
                    className="rounded-lg p-2.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
                    disabled
                    title="Reactions coming soon"
                    type="button"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 p-2.5 text-white shadow-lg transition-all hover:from-teal-600 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!messageText.trim() || sending}
                    onClick={handleSendMessage}
                    type="button"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900/90">
            <div className="w-full max-w-4xl px-10 text-center sm:px-12">
              <MessageSquare className="mx-auto mb-4 h-20 w-20 text-gray-300 dark:text-gray-600" />
              <h2 className="mb-2 font-semibold text-2xl text-gray-900 dark:text-white">
                Your messages
              </h2>
              <p className="mx-auto max-w-3xl whitespace-normal text-gray-500 dark:text-gray-400">
                Select a conversation to start messaging or find a provider to connect with.
              </p>
              <Link
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                href={`/${locale}/dashboard/directory`}
              >
                Browse providers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}
      </div>

      <NewChatModal
        error={recipientError}
        isCreating={startingConversation}
        loading={recipientLoading}
        onClose={() => setIsNewChatOpen(false)}
        onSearchChange={setRecipientSearch}
        onSelect={handleStartConversation}
        open={isNewChatOpen}
        recipients={recipientResults}
        search={recipientSearch}
      />
    </div>
  )
}

function ConversationSectionLabel({ title }: { title: string }) {
  return (
    <div className="bg-gray-50 px-4 py-2 font-semibold text-gray-400 text-xs uppercase tracking-wide dark:bg-gray-900 dark:text-gray-500">
      {title}
    </div>
  )
}

function ConversationListItem({
  conversation,
  onSelect,
  active,
}: {
  conversation: Conversation
  onSelect: () => void
  active: boolean
}) {
  const timeAgo = conversation.last_message_at
    ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })
    : '—'

  return (
    <button
      className={clsx(
        'flex w-full items-start gap-3 px-5 py-4 text-left transition-all hover:bg-gray-50 dark:hover:bg-gray-900/60',
        active &&
          'border-l-4 border-l-teal-500 bg-teal-50 dark:border-l-teal-400 dark:bg-teal-900/30'
      )}
      onClick={onSelect}
      type="button"
    >
      <RecipientAvatar compact name={conversation.other_user_name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-semibold text-gray-900 dark:text-white">
              {conversation.other_user_name}
            </span>
            {conversation.is_provider && (
              <ShieldCheck className="h-4 w-4 flex-shrink-0 text-teal-600 dark:text-teal-300" />
            )}
            {conversation.other_user_tier && conversation.other_user_tier !== 'free' && (
              <Star className="h-4 w-4 flex-shrink-0 text-yellow-500" />
            )}
          </div>
          <span className="flex-shrink-0 text-gray-400 text-xs dark:text-gray-500">{timeAgo}</span>
        </div>
        <p className="mt-1 truncate text-gray-500 text-sm dark:text-gray-400">
          {conversation.last_message_preview || 'No messages yet'}
        </p>
        {conversation.unread_count > 0 && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-teal-600 px-2 py-0.5 font-semibold text-white text-xs">
            {conversation.unread_count} new
          </span>
        )}
      </div>
    </button>
  )
}

function renderDeliveryStatusIcon(message: Message) {
  if (message.is_read) {
    return <CheckCheck className="h-4 w-4" />
  }

  if (message.is_delivered) {
    return <CheckCheck className="h-4 w-4 opacity-70" />
  }

  return <Clock className="h-4 w-4 opacity-70" />
}

function RecipientAvatar({
  name,
  avatarUrl,
  compact = false,
}: {
  name: string
  avatarUrl?: string | null
  compact?: boolean
}) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (avatarUrl) {
    const size = compact ? 44 : 48

    return (
      <Image
        alt={name}
        className={clsx(
          'rounded-full border border-gray-200 object-cover shadow dark:border-gray-700',
          compact ? 'h-11 w-11' : 'h-12 w-12'
        )}
        height={size}
        src={avatarUrl}
        width={size}
      />
    )
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow',
        compact ? 'h-11 w-11 text-sm' : 'h-12 w-12 text-base'
      )}
    >
      {initials}
    </div>
  )
}

function shouldShowTimestamp(previousMessage: Message | undefined, currentMessage: Message) {
  if (!previousMessage) {
    return true
  }

  if (!(previousMessage.created_at && currentMessage.created_at)) {
    return false
  }

  const previousDate = new Date(previousMessage.created_at).toDateString()
  const currentDate = new Date(currentMessage.created_at).toDateString()

  return previousDate !== currentDate
}

type NewChatModalProps = {
  open: boolean
  onClose: () => void
  search: string
  onSearchChange: (value: string) => void
  loading: boolean
  recipients: Recipient[]
  error: string | null
  onSelect: (recipient: Recipient) => void
  isCreating: boolean
}

function NewChatModal({
  open,
  onClose,
  search,
  onSearchChange,
  loading,
  recipients,
  error,
  onSelect,
  isCreating,
}: NewChatModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) {
    return null
  }

  let resultsContent: React.ReactElement

  if (loading) {
    resultsContent = (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        <p className="text-gray-500 text-sm dark:text-gray-400">Finding providers…</p>
      </div>
    )
  } else if (error) {
    resultsContent = (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-900 dark:bg-red-900/30 dark:text-red-200">
        {error}
      </div>
    )
  } else if (recipients.length === 0) {
    resultsContent = (
      <div className="rounded-2xl border border-gray-200 border-dashed p-10 text-center dark:border-gray-700">
        <Users className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
        <h3 className="font-medium text-gray-900 dark:text-white">No providers found</h3>
        <p className="mt-2 text-gray-500 text-sm dark:text-gray-400">
          Try adjusting your search. You can look for provider names, services, or locations.
        </p>
      </div>
    )
  } else {
    resultsContent = (
      <div className="space-y-3">
        {recipients.map((recipient) => (
          <button
            className="hover:-translate-y-0.5 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition-transform hover:border-teal-500 dark:border-gray-700 dark:bg-gray-900"
            disabled={isCreating}
            key={recipient.id}
            onClick={() => onSelect(recipient)}
            type="button"
          >
            <div className="flex items-start gap-4">
              <RecipientAvatar avatarUrl={recipient.avatarUrl} compact name={recipient.name} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{recipient.name}</h3>
                  {recipient.status === 'verified' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-teal-700 text-xs dark:bg-teal-900/30 dark:text-teal-200">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm dark:text-gray-400">{recipient.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-gray-500 text-xs dark:text-gray-400">
                  {recipient.city && <span>{recipient.city}</span>}
                  {recipient.services.slice(0, 3).map((service) => (
                    <span
                      className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800"
                      key={service}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300" />
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 py-6 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between border-gray-200 border-b px-6 py-4 dark:border-gray-800">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg dark:text-white">
              Start a new conversation
            </h2>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Search Illia providers, assistants, or contacts to begin chatting instantly.
            </p>
          </div>
          <button
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            onClick={onClose}
            type="button"
          >
            <span className="sr-only">Close</span>×
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
            <input
              autoFocus
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-10 text-gray-900 text-sm shadow focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name, service, or email"
              type="text"
              value={search}
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 pb-6">{resultsContent}</div>

        <div className="border-gray-200 border-t bg-gray-50 px-6 py-4 text-right dark:border-gray-800 dark:bg-gray-900">
          <button
            className="inline-flex items-center gap-2 rounded-full border border-transparent bg-gray-900 px-5 py-2 font-medium text-sm text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
