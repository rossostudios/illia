'use client'

import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import {
  CheckCheck,
  ChevronLeft,
  Clock,
  Edit2,
  MessageSquare,
  MoreVertical,
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
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import { useDirectMessages } from '@/hooks/use-direct-messages'

export default function MessagesPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [selectedOtherUserId, setSelectedOtherUserId] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'providers'>('all')
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showMobileConversation, setShowMobileConversation] = useState(false)
  const { user } = useSessionContext()

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
  } = useDirectMessages({
    conversationId: selectedConversation || undefined,
    otherUserId: selectedOtherUserId || undefined,
    onMessageReceived: () => {
      refetchConversations()
    },
  })

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.last_message_preview?.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterType === 'unread') {
      return matchesSearch && conv.unread_count > 0
    }
    if (filterType === 'providers') {
      return matchesSearch && conv.is_provider
    }
    return matchesSearch
  })

  // Calculate stats
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0)
  const providerConversations = conversations.filter((c) => c.is_provider).length

  // Handle sending message
  const handleSendMessage = async () => {
    if (!(messageText.trim() && selectedOtherUserId)) {
      return
    }

    try {
      await sendMessage(messageText)
      setMessageText('')
    } catch (_error) {
      // Error handled silently
    }
  }

  // Handle editing message
  const handleEditMessage = async () => {
    if (!(editText.trim() && editingMessageId)) {
      return
    }

    try {
      await editMessage(editingMessageId, editText)
      setEditingMessageId(null)
      setEditText('')
    } catch (_error) {
      // Error handled silently
    }
  }

  // Handle conversation selection
  const selectConversation = (conv: any) => {
    setSelectedConversation(conv.conversation_id)
    setSelectedOtherUserId(conv.other_user_id)
    setShowMobileConversation(true)
    markAsRead(conv.conversation_id)
  }

  // Get current conversation info
  const currentConversation = conversations.find((c) => c.conversation_id === selectedConversation)

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Conversation List */}
      <div
        className={`${showMobileConversation ? 'hidden md:flex' : 'flex'} w-full flex-col border-gray-200 border-r bg-white md:w-80 lg:w-96 dark:border-gray-700 dark:bg-gray-900`}
      >
        {/* Header */}
        <div className="border-gray-200 border-b p-4 dark:border-gray-700">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="flex items-center gap-2 font-bold text-2xl text-gray-900 dark:text-white">
              <MessageSquare className="h-7 w-7 text-teal-600 dark:text-teal-400" />
              Messages
            </h1>
            <button
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              type="button"
            >
              <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              type="text"
              value={searchQuery}
            />
          </div>

          {/* Filters */}
          <div className="mt-3 flex gap-2">
            <button
              className={`rounded-lg px-3 py-1 text-sm transition-colors ${
                filterType === 'all'
                  ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              onClick={() => setFilterType('all')}
              type="button"
            >
              All
            </button>
            <button
              className={`flex items-center gap-1 rounded-lg px-3 py-1 text-sm transition-colors ${
                filterType === 'unread'
                  ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              onClick={() => setFilterType('unread')}
              type="button"
            >
              Unread
              {totalUnread > 0 && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-white text-xs">
                  {totalUnread}
                </span>
              )}
            </button>
            <button
              className={`flex items-center gap-1 rounded-lg px-3 py-1 text-sm transition-colors ${
                filterType === 'providers'
                  ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              onClick={() => setFilterType('providers')}
              type="button"
            >
              <ShieldCheck className="h-3 w-3" />
              Providers
              {providerConversations > 0 && (
                <span className="text-xs">({providerConversations})</span>
              )}
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-teal-600 border-b-2" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <Users className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
              <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
                {searchQuery ? 'No results found' : 'No conversations yet'}
              </h3>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start a conversation from any provider profile or community post'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredConversations.map((conv) => (
                <button
                  className={`flex w-full items-start gap-3 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    selectedConversation === conv.conversation_id
                      ? 'border-l-4 border-l-teal-600 bg-teal-50 dark:border-l-teal-400 dark:bg-teal-900/20'
                      : ''
                  }`}
                  key={conv.conversation_id}
                  onClick={() => selectConversation(conv)}
                  type="button"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600">
                    <span className="font-semibold text-white">
                      {conv.other_user_name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate font-semibold text-gray-900 dark:text-white">
                          {conv.other_user_name}
                        </span>
                        {conv.is_provider && (
                          <ShieldCheck className="h-4 w-4 flex-shrink-0 text-teal-600 dark:text-teal-400" />
                        )}
                        {conv.other_user_tier && conv.other_user_tier !== 'free' && (
                          <Star className="h-4 w-4 flex-shrink-0 text-yellow-500" />
                        )}
                      </div>
                      {conv.last_message_at && (
                        <span className="flex-shrink-0 text-gray-500 text-xs dark:text-gray-400">
                          {formatDistanceToNow(new Date(conv.last_message_at), {
                            addSuffix: false,
                          })}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-gray-600 text-sm dark:text-gray-400">
                      {conv.last_message_preview || 'No messages yet'}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="mt-2 inline-block rounded-full bg-teal-600 px-2 py-1 font-semibold text-white text-xs">
                        {conv.unread_count} new
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation || selectedOtherUserId ? (
        <div
          className={`${showMobileConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white dark:bg-gray-900`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between border-gray-200 border-b bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
                onClick={() => setShowMobileConversation(false)}
                type="button"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600">
                <span className="font-semibold text-white">
                  {currentConversation?.other_user_name?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {currentConversation?.other_user_name || 'User'}
                  </span>
                  {currentConversation?.is_provider && (
                    <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  )}
                </div>
                {typingUsers.length > 0 && (
                  <p className="flex items-center gap-1 text-gray-500 text-sm italic dark:text-gray-400">
                    <span className="flex gap-0.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </span>
                    typing
                  </p>
                )}
              </div>
            </div>
            <button
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              type="button"
            >
              <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4 dark:from-gray-900 dark:to-gray-800">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-teal-600 border-b-2" />
              </div>
            ) : messages.length === 0 ? (
              <div className="py-16 text-center">
                <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
                  Start the conversation
                </h3>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  Send a message to begin chatting
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwn = message.sender_id === user?.id
                const showDate =
                  index === 0 ||
                  new Date(message.created_at).toDateString() !==
                    new Date(messages[index - 1].created_at).toDateString()

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="my-4 text-center">
                        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-400 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 10 }}
                    >
                      <div
                        className={`max-w-[70%] lg:max-w-[60%] ${
                          isOwn
                            ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white'
                            : 'border border-gray-200 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        } group relative rounded-2xl px-4 py-3 shadow-sm`}
                      >
                        {editingMessageId === message.id ? (
                          <div className="space-y-2">
                            <textarea
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                              onChange={(e) => setEditText(e.target.value)}
                              rows={2}
                              value={editText}
                            />
                            <div className="flex gap-2">
                              <button
                                className="rounded-lg bg-white px-3 py-1 font-medium text-teal-600 text-xs hover:bg-gray-50 dark:bg-gray-700 dark:text-teal-400 dark:hover:bg-gray-700"
                                onClick={handleEditMessage}
                                type="button"
                              >
                                Save
                              </button>
                              <button
                                className="rounded-lg bg-gray-200 px-3 py-1 font-medium text-gray-700 text-xs hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
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
                                <span className="italic opacity-75">Message deleted</span>
                              ) : (
                                message.message
                              )}
                            </p>
                            <div className="mt-1 flex items-center justify-between gap-2">
                              <span
                                className={`text-xs ${isOwn ? 'text-teal-100' : 'text-gray-500 dark:text-gray-400'}`}
                              >
                                {new Date(message.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                                {message.edited_at && ' (edited)'}
                              </span>
                              {isOwn && (
                                <span className="text-teal-100">
                                  {message.is_read ? (
                                    <CheckCheck className="h-4 w-4" />
                                  ) : message.is_delivered ? (
                                    <CheckCheck className="h-4 w-4 opacity-60" />
                                  ) : (
                                    <Clock className="h-4 w-4 opacity-60" />
                                  )}
                                </span>
                              )}
                            </div>
                            {isOwn && !message.deleted_at && (
                              <div className="-left-24 -translate-y-1/2 absolute top-1/2 hidden gap-1 group-hover:flex">
                                <button
                                  className="rounded-lg bg-white p-2 shadow transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-700"
                                  onClick={() => {
                                    setEditingMessageId(message.id)
                                    setEditText(message.message)
                                  }}
                                  type="button"
                                >
                                  <Edit2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </button>
                                <button
                                  className="rounded-lg bg-white p-2 shadow transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-700"
                                  onClick={() => deleteMessage(message.id)}
                                  type="button"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )
              })
            )}
          </div>

          {/* Message Input */}
          <div className="border-gray-200 border-t bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-end gap-3">
              <button
                className="rounded-lg p-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                type="button"
              >
                <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              <div className="flex-1">
                <textarea
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                  onBlur={() => sendTypingIndicator(false)}
                  onChange={(e) => {
                    setMessageText(e.target.value)
                    sendTypingIndicator(true)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Type a message..."
                  rows={1}
                  value={messageText}
                />
              </div>
              <button
                className="rounded-lg p-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                type="button"
              >
                <Smile className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button
                className="rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 p-2.5 text-white shadow-lg transition-all hover:from-teal-600 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50 dark:from-teal-400 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-teal-600"
                disabled={!messageText.trim() || sending}
                onClick={handleSendMessage}
                type="button"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="px-4 text-center">
            <MessageSquare className="mx-auto mb-4 h-20 w-20 text-gray-300 dark:text-gray-600" />
            <h2 className="mb-2 font-semibold text-2xl text-gray-900 dark:text-white">
              Your messages
            </h2>
            <p className="mx-auto max-w-sm text-gray-500 dark:text-gray-400">
              Select a conversation to start messaging or find a provider to connect with
            </p>
            <Link
              className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
              href={`/${locale}/dashboard/directory`}
            >
              Browse Providers
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
