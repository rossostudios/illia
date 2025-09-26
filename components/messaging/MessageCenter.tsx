'use client'

import { formatDistanceToNow } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  CheckCheck,
  ChevronLeft,
  Clock,
  Edit2,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Star,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import { useDirectMessages } from '@/hooks/use-direct-messages'

type MessageCenterProps = {
  isOpen: boolean
  onClose: () => void
  initialConversationId?: string
  initialOtherUserId?: string
  fullScreen?: boolean
}

export default function MessageCenter({
  isOpen,
  onClose,
  initialConversationId,
  initialOtherUserId,
  fullScreen = false,
}: MessageCenterProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    initialConversationId || null
  )
  const [selectedOtherUserId, setSelectedOtherUserId] = useState<string | null>(
    initialOtherUserId || null
  )
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showConversationList, setShowConversationList] = useState(!initialConversationId)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
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
      scrollToBottom()
      refetchConversations()
    },
  })

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  // Handle sending message
  const handleSendMessage = async () => {
    if (!(messageText.trim() && selectedOtherUserId)) {
      return
    }

    try {
      await sendMessage(messageText)
      setMessageText('')
      inputRef.current?.focus()
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
    setShowConversationList(false)
    markAsRead(conv.conversation_id)
  }

  // Get current conversation info
  const currentConversation = conversations.find((c) => c.conversation_id === selectedConversation)

  // Filter conversations by search
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.last_message_preview?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate total unread messages
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0)

  if (!isOpen) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className={`fixed ${
          fullScreen ? 'inset-0' : 'right-4 bottom-4 h-[600px] w-96 rounded-xl shadow-2xl'
        } z-50 flex flex-col overflow-hidden border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900`}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-teal-600 p-4 text-white">
          <div className="flex items-center gap-3">
            {selectedConversation && !fullScreen && (
              <button
                className="rounded-lg p-1 transition-colors hover:bg-teal-700 md:hidden"
                onClick={() => setShowConversationList(true)}
                type="button"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <MessageSquare className="h-6 w-6" />
            <div>
              <h2 className="font-semibold">Messages</h2>
              {totalUnread > 0 && <p className="text-teal-100 text-xs">{totalUnread} unread</p>}
            </div>
          </div>
          <button
            className="rounded-lg p-2 transition-colors hover:bg-teal-700"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Conversation List */}
          <div
            className={`${fullScreen ? 'w-80' : 'w-full'} ${
              showConversationList || fullScreen ? '' : 'hidden'
            } flex flex-col border-r bg-gray-50`}
          >
            {/* Search */}
            <div className="border-b bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
              <div className="relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
                <input
                  className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  type="text"
                  value={searchQuery}
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-teal-600 border-b-2" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Users className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                  <p className="mt-1 text-gray-400 text-xs">
                    Start a conversation from any provider profile
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    className={`flex w-full items-start gap-3 border-b p-3 transition-colors hover:bg-white dark:border-gray-700 dark:hover:bg-gray-800 ${
                      selectedConversation === conv.conversation_id
                        ? 'border-l-2 border-l-teal-600 bg-white dark:bg-gray-800'
                        : ''
                    }`}
                    key={conv.conversation_id}
                    onClick={() => selectConversation(conv)}
                    type="button"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100">
                      <span className="font-medium text-sm text-teal-700">
                        {conv.other_user_name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="truncate font-medium text-gray-900 text-sm">
                            {conv.other_user_name}
                          </span>
                          {conv.is_provider && (
                            <ShieldCheck className="h-3 w-3 flex-shrink-0 text-teal-600" />
                          )}
                          {conv.other_user_tier !== 'free' && (
                            <Star className="h-3 w-3 flex-shrink-0 text-yellow-500" />
                          )}
                        </div>
                        {conv.last_message_at && (
                          <span className="flex-shrink-0 text-gray-400 text-xs">
                            {formatDistanceToNow(new Date(conv.last_message_at), {
                              addSuffix: false,
                            })}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 truncate text-gray-600 text-xs">
                        {conv.last_message_preview || 'No messages yet'}
                      </p>
                      {conv.unread_count > 0 && (
                        <span className="mt-1 inline-block rounded-full bg-teal-600 px-2 py-0.5 text-white text-xs">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message Thread */}
          {selectedConversation || selectedOtherUserId ? (
            <div className="flex flex-1 flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
                    <span className="font-medium text-sm text-teal-700">
                      {currentConversation?.other_user_name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {currentConversation?.other_user_name || 'User'}
                      </span>
                      {currentConversation?.is_provider && (
                        <ShieldCheck className="h-4 w-4 text-teal-600" />
                      )}
                    </div>
                    {typingUsers.length > 0 && (
                      <p className="text-gray-500 text-xs italic">typing...</p>
                    )}
                  </div>
                </div>
                <button
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  type="button"
                >
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-teal-600 border-b-2" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-8 text-center">
                    <MessageSquare className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                    <p className="text-gray-500 text-sm">No messages yet</p>
                    <p className="mt-1 text-gray-400 text-xs">
                      Send a message to start the conversation
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const isOwn = message.sender_id === user?.id
                      const showDate =
                        index === 0 ||
                        (message.created_at && messages[index - 1]?.created_at &&
                          new Date(message.created_at).toDateString() !==
                            new Date(messages[index - 1].created_at!).toDateString())

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="my-4 text-center">
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-400 text-xs">
                                {message.created_at ? new Date(message.created_at).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-[70%] ${
                                isOwn ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-900'
                              } group relative rounded-lg px-4 py-2`}
                            >
                              {editingMessageId === message.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    className="w-full rounded border bg-white px-2 py-1 text-gray-900 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    onChange={(e) => setEditText(e.target.value)}
                                    rows={2}
                                    value={editText}
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      className="rounded bg-white px-2 py-1 text-teal-600 text-xs dark:bg-gray-800 dark:text-teal-400"
                                      onClick={handleEditMessage}
                                      type="button"
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="rounded bg-gray-200 px-2 py-1 text-gray-700 text-xs"
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
                                      className={`text-xs ${
                                        isOwn ? 'text-teal-100' : 'text-gray-400'
                                      }`}
                                    >
                                      {message.created_at ? new Date(message.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      }) : 'N/A'}
                                      {message.edited_at && ' (edited)'}
                                    </span>
                                    {isOwn && (
                                      <span className="text-teal-100">
                                        {message.is_read ? (
                                          <CheckCheck className="h-3 w-3" />
                                        ) : message.is_delivered ? (
                                          <Check className="h-3 w-3" />
                                        ) : (
                                          <Clock className="h-3 w-3" />
                                        )}
                                      </span>
                                    )}
                                  </div>
                                  {isOwn && !message.deleted_at && (
                                    <div className="-left-20 absolute top-0 hidden gap-1 group-hover:flex">
                                      <button
                                        className="rounded bg-white p-1 shadow hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                                        onClick={() => {
                                          setEditingMessageId(message.id)
                                          setEditText(message.message)
                                        }}
                                        type="button"
                                      >
                                        <Edit2 className="h-3 w-3 text-gray-500" />
                                      </button>
                                      <button
                                        className="rounded bg-white p-1 shadow hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                                        onClick={() => deleteMessage(message.id)}
                                        type="button"
                                      >
                                        <Trash2 className="h-3 w-3 text-red-500" />
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {typingUsers.length > 0 && (
                      <div className="flex justify-start">
                        <div className="rounded-lg bg-gray-100 px-4 py-2">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-100" />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-200" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="border-t bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-end gap-2">
                  <button
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    type="button"
                  >
                    <Paperclip className="h-5 w-5 text-gray-500" />
                  </button>
                  <div className="relative flex-1">
                    <textarea
                      className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      ref={inputRef}
                      rows={1}
                      style={{ maxHeight: '120px' }}
                      value={messageText}
                    />
                    <button
                      className="absolute right-2 bottom-2 rounded p-1 hover:bg-gray-100"
                      type="button"
                    >
                      <Smile className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <button
                    className="rounded-lg bg-teal-600 p-2 text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
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
            !(loading || showConversationList) && (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                  <h3 className="mb-2 font-medium text-gray-900 text-lg">Select a conversation</h3>
                  <p className="text-gray-500 text-sm">Choose a conversation to start messaging</p>
                </div>
              </div>
            )
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
