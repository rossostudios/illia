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
import { useDirectMessages } from '@/hooks/useDirectMessages'

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

    if (filterType === 'unread') return matchesSearch && conv.unread_count > 0
    if (filterType === 'providers') return matchesSearch && conv.is_provider
    return matchesSearch
  })

  // Calculate stats
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0)
  const providerConversations = conversations.filter((c) => c.is_provider).length

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedOtherUserId) return

    try {
      await sendMessage(messageText)
      setMessageText('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  // Handle editing message
  const handleEditMessage = async () => {
    if (!editText.trim() || !editingMessageId) return

    try {
      await editMessage(editingMessageId, editText)
      setEditingMessageId(null)
      setEditText('')
    } catch (error) {
      console.error('Failed to edit message:', error)
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
    <div className="h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - Conversation List */}
      <div
        className={`${showMobileConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-7 w-7 text-teal-600 dark:text-teal-400" />
              Messages
            </h1>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                filterType === 'unread'
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Unread
              {totalUnread > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {totalUnread}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilterType('providers')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                filterType === 'providers'
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'No results found' : 'No conversations yet'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start a conversation from any provider profile or community post'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.conversation_id}
                  onClick={() => selectConversation(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    selectedConversation === conv.conversation_id
                      ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-l-teal-600 dark:border-l-teal-400'
                      : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">
                      {conv.other_user_name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-gray-900 dark:text-white truncate">
                          {conv.other_user_name}
                        </span>
                        {conv.is_provider && (
                          <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                        )}
                        {conv.other_user_tier && conv.other_user_tier !== 'free' && (
                          <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      {conv.last_message_at && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatDistanceToNow(new Date(conv.last_message_at), {
                            addSuffix: false,
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conv.last_message_preview || 'No messages yet'}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="inline-block mt-2 px-2 py-1 bg-teal-600 text-white text-xs font-semibold rounded-full">
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
          className={`${showMobileConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white dark:bg-gray-800`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileConversation(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors md:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <span className="text-white font-semibold">
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
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic flex items-center gap-1">
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </span>
                    typing
                  </p>
                )}
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-800">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Start the conversation
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
                      <div className="text-center my-4">
                        <span className="text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] lg:max-w-[60%] ${
                          isOwn
                            ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white'
                            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white'
                        } rounded-2xl px-4 py-3 shadow-sm relative group`}
                      >
                        {editingMessageId === message.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleEditMessage}
                                className="px-3 py-1 bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingMessageId(null)
                                  setEditText('')
                                }}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.deleted_at ? (
                                <span className="italic opacity-75">Message deleted</span>
                              ) : (
                                message.message
                              )}
                            </p>
                            <div className="flex items-center justify-between gap-2 mt-1">
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
                              <div className="absolute -left-24 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1">
                                <button
                                  onClick={() => {
                                    setEditingMessageId(message.id)
                                    setEditText(message.message)
                                  }}
                                  className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                >
                                  <Edit2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </button>
                                <button
                                  onClick={() => deleteMessage(message.id)}
                                  className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-end gap-3">
              <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              <div className="flex-1">
                <textarea
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value)
                    sendTypingIndicator(true)
                  }}
                  onBlur={() => sendTypingIndicator(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 resize-none"
                  rows={1}
                />
              </div>
              <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Smile className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || sending}
                className="p-2.5 bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 dark:hover:from-teal-500 dark:hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 dark:from-gray-900 to-white dark:to-gray-800">
          <div className="text-center px-4">
            <MessageSquare className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your messages
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Select a conversation to start messaging or find a provider to connect with
            </p>
            <Link
              href={`/${locale}/dashboard/directory`}
              className="inline-block mt-6 px-6 py-3 bg-teal-600 dark:bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
            >
              Browse Providers
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
