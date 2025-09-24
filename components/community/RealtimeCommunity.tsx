'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronRight,
  Clock,
  Edit2,
  Eye,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Send,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import MessageCenter from '@/components/messaging/MessageCenter'
import { QuickMessageButton } from '@/components/messaging/StartConversationButton'
import { useSessionContext } from '@/components/SessionProvider'
import { usePresence } from '@/hooks/community/usePresence'
import { useRealtimePosts } from '@/hooks/community/useRealtimePosts'
import { useRealtimeThreads } from '@/hooks/community/useRealtimeThreads'
import { useTypingIndicator } from '@/hooks/community/useTypingIndicator'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'general', label: 'General' },
  { id: 'services', label: 'Services' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'expat-life', label: 'Expat Life' },
  { id: 'housing', label: 'Housing' },
  { id: 'visa', label: 'Visa' },
]

const CITIES = [
  { id: 'all', label: 'All Cities' },
  { id: 'medellin', label: 'Medellín' },
  { id: 'florianopolis', label: 'Florianópolis' },
]

export default function RealtimeCommunity() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('all')
  const [showNewThreadModal, setShowNewThreadModal] = useState(false)
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [newThread, setNewThread] = useState({
    title: '',
    body: '',
    category: 'general',
    city_tag: 'medellin',
  })
  const [replyText, setReplyText] = useState('')
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [messageCenterOpen, setMessageCenterOpen] = useState(false)
  const [messageCenterUserId, setMessageCenterUserId] = useState<string | null>(null)

  const { user } = useSessionContext()

  // Real-time hooks
  const {
    threads,
    loading: threadsLoading,
    createThread,
    incrementViewCount,
  } = useRealtimeThreads({
    category: selectedCategory,
    city: selectedCity,
    onThreadAdded: (_thread) => {},
    onThreadUpdated: (thread) => {
      if (selectedThread?.id === thread.id) {
        setSelectedThread((prev: any) => ({ ...prev, ...thread }))
      }
    },
  })

  const {
    posts,
    loading: postsLoading,
    createPost,
    updatePost,
    deletePost,
    toggleReaction,
  } = useRealtimePosts({
    threadId: selectedThread?.id || '',
    onPostAdded: (_post) => {},
  })

  const { onlineUsers, isConnected: presenceConnected } = usePresence({
    channel: selectedThread ? `thread:${selectedThread.id}` : 'community:main',
    onUserJoin: (_user) => {},
    onUserLeave: (_userId) => {},
  })

  const { typingUsers, handleInputChange, stopTyping, getTypingText } = useTypingIndicator({
    channel: selectedThread ? `thread:${selectedThread.id}` : 'community:main',
  })

  // Filter threads based on search
  const filteredThreads = threads.filter((thread) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return thread.title.toLowerCase().includes(query) || thread.body.toLowerCase().includes(query)
    }
    return true
  })

  // Handle thread creation
  const handleCreateThread = async () => {
    try {
      await createThread(newThread)
      setShowNewThreadModal(false)
      setNewThread({
        title: '',
        body: '',
        category: 'general',
        city_tag: 'medellin',
      })
    } catch (_error) {
      // Error handled silently
    }
  }

  // Handle post creation
  const handleCreatePost = async () => {
    if (!replyText.trim()) {
      return
    }

    try {
      await createPost(replyText)
      setReplyText('')
      stopTyping()
    } catch (_error) {
      // Error handled silently
    }
  }

  // Handle post editing
  const handleEditPost = async (postId: string) => {
    if (!editText.trim()) {
      return
    }

    try {
      await updatePost(postId, editText)
      setEditingPost(null)
      setEditText('')
    } catch (_error) {
      // Error handled silently
    }
  }

  // Handle thread selection
  const handleThreadClick = async (thread: any) => {
    setSelectedThread(thread)
    await incrementViewCount(thread.id)
  }

  return (
    <div className="min-h-screen bg-warmth-50/30 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-bold text-3xl text-teal-600 dark:text-teal-400">Community</h1>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {onlineUsers.length} online
                  </span>
                </div>
                {presenceConnected && (
                  <span className="text-green-600 text-xs dark:text-green-400">● Connected</span>
                )}
              </div>
            </div>
            {user && (
              <button
                className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                onClick={() => setShowNewThreadModal(true)}
              >
                <Plus className="h-5 w-5" />
                New Thread
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-md dark:bg-gray-900 dark:shadow-gray-900/30">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-teal-500 dark:text-teal-400" />
              <input
                className="w-full rounded-full border border-teal-300 bg-white py-3 pr-4 pl-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-teal-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threads..."
                type="text"
                value={searchQuery}
              />
            </div>

            <div className="flex gap-2">
              <select
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                onChange={(e) => setSelectedCategory(e.target.value)}
                value={selectedCategory}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                onChange={(e) => setSelectedCity(e.target.value)}
                value={selectedCity}
              >
                {CITIES.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Online Users */}
        {onlineUsers.length > 0 && (
          <div className="mb-6 rounded-xl bg-white p-4 shadow-md dark:bg-gray-900 dark:shadow-gray-900/30">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-500 dark:text-teal-400" />
              <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
                Active Now
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {onlineUsers.map((u) => (
                <div
                  className="flex items-center gap-1 rounded-full bg-teal-50 px-2 py-1 dark:bg-teal-900/30"
                  key={u.user_id}
                >
                  {u.avatar_url ? (
                    <img alt={u.name || ''} className="h-5 w-5 rounded-full" src={u.avatar_url} />
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-200 text-gray-900 text-xs dark:bg-teal-700 dark:text-white">
                      {(u.name || 'U')[0]}
                    </div>
                  )}
                  <span className="text-gray-700 text-xs dark:text-gray-300">{u.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Threads List */}
        {threadsLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-teal-600 border-b-2" />
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="cursor-pointer rounded-xl bg-white p-5 shadow-md transition-all hover:shadow-lg dark:bg-gray-900 dark:shadow-gray-900/30 dark:hover:shadow-gray-900/40"
                  exit={{ opacity: 0, y: -20 }}
                  initial={{ opacity: 0, y: 20 }}
                  key={thread.id}
                  onClick={() => handleThreadClick(thread)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        {thread.is_pinned && (
                          <span className="rounded-full bg-teal-100 px-2 py-0.5 text-teal-700 text-xs dark:bg-teal-900/30 dark:text-teal-300">
                            Pinned
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-900 hover:text-teal-600 dark:text-white dark:hover:text-teal-400">
                          {thread.title}
                        </h3>
                      </div>

                      <p className="mb-3 line-clamp-2 text-gray-600 text-sm dark:text-gray-400">
                        {thread.body}
                      </p>

                      <div className="flex items-center gap-4 text-gray-500 text-sm dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {thread.posts_count} posts
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {thread.views_count} views
                        </span>
                        {thread.city_tag && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {thread.city_tag}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(thread.last_post_at || thread.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="mt-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Thread Detail Modal */}
        {selectedThread && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900">
              {/* Modal Header */}
              <div className="border-gray-200 border-b p-6 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="mb-2 font-bold text-2xl text-gray-900 dark:text-white">
                      {selectedThread.title}
                    </h2>
                    <div className="flex items-center gap-3 text-gray-500 text-sm dark:text-gray-400">
                      <span>{selectedThread.category}</span>
                      {selectedThread.city_tag && (
                        <>
                          <span>•</span>
                          <span>{selectedThread.city_tag}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{selectedThread.views_count} views</span>
                    </div>
                  </div>
                  <button
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    onClick={() => setSelectedThread(null)}
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Posts */}
              <div className="flex-1 overflow-y-auto p-6">
                {postsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-teal-600 border-b-2" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Original Post */}
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {selectedThread.author?.name || 'Unknown'}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(selectedThread.created_at).toLocaleString()}
                          </span>
                          {user && user.id !== selectedThread.user_id && (
                            <button
                              className="ml-2 flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1 text-white text-xs transition-colors hover:bg-teal-700"
                              onClick={() => {
                                setMessageCenterUserId(selectedThread.user_id)
                                setMessageCenterOpen(true)
                              }}
                            >
                              <Mail className="h-3 w-3" />
                              Send DM
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap text-gray-700 text-sm">
                        {selectedThread.body}
                      </p>
                    </div>

                    {/* Replies */}
                    <AnimatePresence>
                      {posts.map((post) => (
                        <motion.div
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-lg border bg-white p-4"
                          exit={{ opacity: 0, y: -10 }}
                          initial={{ opacity: 0, y: 10 }}
                          key={post.id}
                        >
                          <div className="mb-2 flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{post.author?.name || 'Unknown'}</span>
                              {post.author?.tier && post.author.tier !== 'free' && (
                                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-teal-700 text-xs">
                                  {post.author.tier}
                                </span>
                              )}
                              <span className="text-gray-500 text-xs">
                                {new Date(post.created_at).toLocaleString()}
                              </span>
                              {post.edited_at && (
                                <span className="text-gray-400 text-xs">(edited)</span>
                              )}
                              {user && user.id !== post.user_id && (
                                <QuickMessageButton className="ml-2" userId={post.user_id} />
                              )}
                            </div>
                            {user && user.id === post.user_id && (
                              <div className="flex items-center gap-1">
                                <button
                                  className="rounded p-1 hover:bg-gray-100"
                                  onClick={() => {
                                    setEditingPost(post.id)
                                    setEditText(post.body)
                                  }}
                                >
                                  <Edit2 className="h-4 w-4 text-gray-500" />
                                </button>
                                <button
                                  className="rounded p-1 hover:bg-gray-100"
                                  onClick={() => deletePost(post.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-gray-500" />
                                </button>
                              </div>
                            )}
                          </div>

                          {editingPost === post.id ? (
                            <div className="space-y-2">
                              <textarea
                                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                onChange={(e) => setEditText(e.target.value)}
                                rows={3}
                                value={editText}
                              />
                              <div className="flex gap-2">
                                <button
                                  className="rounded bg-teal-600 px-3 py-1 text-sm text-white"
                                  onClick={() => handleEditPost(post.id)}
                                >
                                  Save
                                </button>
                                <button
                                  className="rounded bg-gray-200 px-3 py-1 text-gray-700 text-sm"
                                  onClick={() => {
                                    setEditingPost(null)
                                    setEditText('')
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="mb-2 whitespace-pre-wrap text-gray-700 text-sm">
                                {post.body}
                              </p>
                              {/* Reactions */}
                              {post.reactions && post.reactions.length > 0 && (
                                <div className="mt-2 flex gap-2">
                                  {post.reactions.map((reaction) => (
                                    <button
                                      className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                                        reaction.user_reacted
                                          ? 'bg-teal-100 text-teal-700'
                                          : 'bg-gray-100 text-gray-600'
                                      }`}
                                      key={reaction.reaction}
                                      onClick={() => toggleReaction(post.id, reaction.reaction)}
                                    >
                                      <span>{reaction.reaction}</span>
                                      <span>{reaction.count}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                              {/* Quick reactions */}
                              {user && (
                                <div className="mt-2 flex gap-1">
                                  {['👍', '❤️', '😂', '🤔', '👏'].map((emoji) => (
                                    <button
                                      className="rounded p-1 hover:bg-gray-100"
                                      key={emoji}
                                      onClick={() => toggleReaction(post.id, emoji)}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Reply Section */}
              {user && (
                <div className="border-t p-6">
                  {/* Typing Indicator */}
                  {typingUsers.length > 0 && (
                    <div className="mb-2 text-gray-500 text-sm italic">{getTypingText()}</div>
                  )}

                  <div className="flex gap-2">
                    <textarea
                      className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      onBlur={stopTyping}
                      onChange={(e) => {
                        setReplyText(e.target.value)
                        handleInputChange()
                      }}
                      placeholder="Write a reply..."
                      rows={2}
                      value={replyText}
                    />
                    <button
                      className="rounded-lg bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!replyText.trim()}
                      onClick={handleCreatePost}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* New Thread Modal */}
        {showNewThreadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-bold text-2xl text-gray-900">New Thread</h2>
                <button
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  onClick={() => setShowNewThreadModal(false)}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-medium text-gray-700 text-sm">Title</label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    placeholder="What's your question or topic?"
                    type="text"
                    value={newThread.title}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-700 text-sm">Content</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onChange={(e) => setNewThread({ ...newThread, body: e.target.value })}
                    placeholder="Provide more details..."
                    rows={6}
                    value={newThread.body}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block font-medium text-gray-700 text-sm">Category</label>
                    <select
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                      value={newThread.category}
                    >
                      {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-medium text-gray-700 text-sm">City</label>
                    <select
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      onChange={(e) => setNewThread({ ...newThread, city_tag: e.target.value })}
                      value={newThread.city_tag}
                    >
                      {CITIES.filter((c) => c.id !== 'all').map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="rounded-lg px-6 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                  onClick={() => setShowNewThreadModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!(newThread.title.trim() && newThread.body.trim())}
                  onClick={handleCreateThread}
                >
                  Create Thread
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message Center Modal */}
        {messageCenterOpen && messageCenterUserId && (
          <MessageCenter
            initialOtherUserId={messageCenterUserId}
            isOpen={messageCenterOpen}
            onClose={() => {
              setMessageCenterOpen(false)
              setMessageCenterUserId(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
