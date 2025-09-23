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
import { useDirectMessages } from '@/hooks/useDirectMessages'

interface MessageCenterProps {
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
    if (!messageText.trim() || !selectedOtherUserId) return

    try {
      await sendMessage(messageText)
      setMessageText('')
      inputRef.current?.focus()
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

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed ${
          fullScreen ? 'inset-0' : 'bottom-4 right-4 w-96 h-[600px] rounded-xl shadow-2xl'
        } bg-white z-50 flex flex-col overflow-hidden border border-gray-200`}
      >
        {/* Header */}
        <div className="bg-teal-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedConversation && !fullScreen && (
              <button
                onClick={() => setShowConversationList(true)}
                className="p-1 hover:bg-teal-700 rounded-lg transition-colors md:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <MessageSquare className="h-6 w-6" />
            <div>
              <h2 className="font-semibold">Messages</h2>
              {totalUnread > 0 && <p className="text-xs text-teal-100">{totalUnread} unread</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-teal-700 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Conversation List */}
          <div
            className={`${fullScreen ? 'w-80' : 'w-full'} ${
              !showConversationList && !fullScreen ? 'hidden' : ''
            } border-r bg-gray-50 flex flex-col`}
          >
            {/* Search */}
            <div className="p-3 border-b bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Start a conversation from any provider profile
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.conversation_id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full p-3 flex items-start gap-3 hover:bg-white transition-colors border-b ${
                      selectedConversation === conv.conversation_id
                        ? 'bg-white border-l-2 border-l-teal-600'
                        : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-teal-700">
                        {conv.other_user_name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium text-sm text-gray-900 truncate">
                            {conv.other_user_name}
                          </span>
                          {conv.is_provider && (
                            <ShieldCheck className="h-3 w-3 text-teal-600 flex-shrink-0" />
                          )}
                          {conv.other_user_tier !== 'free' && (
                            <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        {conv.last_message_at && (
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {formatDistanceToNow(new Date(conv.last_message_at), {
                              addSuffix: false,
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {conv.last_message_preview || 'No messages yet'}
                      </p>
                      {conv.unread_count > 0 && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full">
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
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-teal-700">
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
                      <p className="text-xs text-gray-500 italic">typing...</p>
                    )}
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No messages yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Send a message to start the conversation
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const isOwn = message.sender_id === user?.id
                      const showDate =
                        index === 0 ||
                        new Date(message.created_at).toDateString() !==
                          new Date(messages[index - 1].created_at).toDateString()

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="text-center my-4">
                              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                {new Date(message.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-[70%] ${
                                isOwn ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-900'
                              } rounded-lg px-4 py-2 relative group`}
                            >
                              {editingMessageId === message.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full px-2 py-1 text-sm bg-white text-gray-900 rounded border"
                                    rows={2}
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={handleEditMessage}
                                      className="px-2 py-1 bg-white text-teal-600 rounded text-xs"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingMessageId(null)
                                        setEditText('')
                                      }}
                                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
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
                                      className={`text-xs ${
                                        isOwn ? 'text-teal-100' : 'text-gray-400'
                                      }`}
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
                                    <div className="absolute -left-20 top-0 hidden group-hover:flex gap-1">
                                      <button
                                        onClick={() => {
                                          setEditingMessageId(message.id)
                                          setEditText(message.message)
                                        }}
                                        className="p-1 bg-white rounded shadow hover:bg-gray-100"
                                      >
                                        <Edit2 className="h-3 w-3 text-gray-500" />
                                      </button>
                                      <button
                                        onClick={() => deleteMessage(message.id)}
                                        className="p-1 bg-white rounded shadow hover:bg-gray-100"
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
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-end gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="h-5 w-5 text-gray-500" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
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
                      className="w-full px-4 py-2 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      rows={1}
                      style={{ maxHeight: '120px' }}
                    />
                    <button className="absolute right-2 bottom-2 p-1 hover:bg-gray-100 rounded">
                      <Smile className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sending}
                    className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            !loading &&
            !showConversationList && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-sm text-gray-500">Choose a conversation to start messaging</p>
                </div>
              </div>
            )
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
