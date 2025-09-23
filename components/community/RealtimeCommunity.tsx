'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronRight,
  Clock,
  Edit2,
  Eye,
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Send,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
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
    onThreadAdded: (thread) => {
      console.log('New thread added:', thread)
    },
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
    onPostAdded: (post) => {
      console.log('New post added:', post)
    },
  })

  const { onlineUsers, isConnected: presenceConnected } = usePresence({
    channel: selectedThread ? `thread:${selectedThread.id}` : 'community:main',
    onUserJoin: (user) => {
      console.log('User joined:', user)
    },
    onUserLeave: (userId) => {
      console.log('User left:', userId)
    },
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
    } catch (error) {
      console.error('Error creating thread:', error)
    }
  }

  // Handle post creation
  const handleCreatePost = async () => {
    if (!replyText.trim()) return

    try {
      await createPost(replyText)
      setReplyText('')
      stopTyping()
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  // Handle post editing
  const handleEditPost = async (postId: string) => {
    if (!editText.trim()) return

    try {
      await updatePost(postId, editText)
      setEditingPost(null)
      setEditText('')
    } catch (error) {
      console.error('Error updating post:', error)
    }
  }

  // Handle thread selection
  const handleThreadClick = async (thread: any) => {
    setSelectedThread(thread)
    await incrementViewCount(thread.id)
  }

  return (
    <div className="min-h-screen bg-warmth-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-teal-600">Community</h1>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-gray-600">{onlineUsers.length} online</span>
                </div>
                {presenceConnected && <span className="text-xs text-green-600">● Connected</span>}
              </div>
            </div>
            {user && (
              <button
                onClick={() => setShowNewThreadModal(true)}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                New Thread
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threads..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-teal-500" />
              <span className="text-sm font-medium text-gray-700">Active Now</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {onlineUsers.map((u) => (
                <div
                  key={u.user_id}
                  className="flex items-center gap-1 px-2 py-1 bg-teal-50 rounded-full"
                >
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt={u.name || ''} className="w-5 h-5 rounded-full" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-teal-200 flex items-center justify-center text-xs">
                      {(u.name || 'U')[0]}
                    </div>
                  )}
                  <span className="text-xs text-gray-700">{u.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Threads List */}
        {threadsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleThreadClick(thread)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {thread.is_pinned && (
                          <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                            Pinned
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-900 hover:text-teal-600">
                          {thread.title}
                        </h3>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{thread.body}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
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
                    <ChevronRight className="h-5 w-5 text-gray-400 mt-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Thread Detail Modal */}
        {selectedThread && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedThread.title}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
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
                    onClick={() => setSelectedThread(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Posts */}
              <div className="flex-1 overflow-y-auto p-6">
                {postsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Original Post */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {selectedThread.author?.name || 'Unknown'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(selectedThread.created_at).toLocaleString()}
                          </span>
                          {user && user.id !== selectedThread.user_id && (
                            <button
                              onClick={() => {
                                setMessageCenterUserId(selectedThread.user_id)
                                setMessageCenterOpen(true)
                              }}
                              className="ml-2 px-3 py-1 bg-teal-600 text-white text-xs rounded-lg flex items-center gap-1 hover:bg-teal-700 transition-colors"
                            >
                              <Mail className="h-3 w-3" />
                              Send DM
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedThread.body}
                      </p>
                    </div>

                    {/* Replies */}
                    <AnimatePresence>
                      {posts.map((post) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-white border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{post.author?.name || 'Unknown'}</span>
                              {post.author?.tier && post.author.tier !== 'free' && (
                                <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                                  {post.author.tier}
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(post.created_at).toLocaleString()}
                              </span>
                              {post.edited_at && (
                                <span className="text-xs text-gray-400">(edited)</span>
                              )}
                              {user && user.id !== post.user_id && (
                                <QuickMessageButton userId={post.user_id} className="ml-2" />
                              )}
                            </div>
                            {user && user.id === post.user_id && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditingPost(post.id)
                                    setEditText(post.body)
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <Edit2 className="h-4 w-4 text-gray-500" />
                                </button>
                                <button
                                  onClick={() => deletePost(post.id)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <Trash2 className="h-4 w-4 text-gray-500" />
                                </button>
                              </div>
                            )}
                          </div>

                          {editingPost === post.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditPost(post.id)}
                                  className="px-3 py-1 bg-teal-600 text-white rounded text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingPost(null)
                                    setEditText('')
                                  }}
                                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">
                                {post.body}
                              </p>
                              {/* Reactions */}
                              {post.reactions && post.reactions.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                  {post.reactions.map((reaction) => (
                                    <button
                                      key={reaction.reaction}
                                      onClick={() => toggleReaction(post.id, reaction.reaction)}
                                      className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                                        reaction.user_reacted
                                          ? 'bg-teal-100 text-teal-700'
                                          : 'bg-gray-100 text-gray-600'
                                      }`}
                                    >
                                      <span>{reaction.reaction}</span>
                                      <span>{reaction.count}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                              {/* Quick reactions */}
                              {user && (
                                <div className="flex gap-1 mt-2">
                                  {['👍', '❤️', '😂', '🤔', '👏'].map((emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() => toggleReaction(post.id, emoji)}
                                      className="p-1 hover:bg-gray-100 rounded"
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
                <div className="p-6 border-t">
                  {/* Typing Indicator */}
                  {typingUsers.length > 0 && (
                    <div className="text-sm text-gray-500 mb-2 italic">{getTypingText()}</div>
                  )}

                  <div className="flex gap-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => {
                        setReplyText(e.target.value)
                        handleInputChange()
                      }}
                      onBlur={stopTyping}
                      placeholder="Write a reply..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      rows={2}
                    />
                    <button
                      onClick={handleCreatePost}
                      disabled={!replyText.trim()}
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">New Thread</h2>
                <button
                  onClick={() => setShowNewThreadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newThread.title}
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    placeholder="What's your question or topic?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newThread.body}
                    onChange={(e) => setNewThread({ ...newThread, body: e.target.value })}
                    placeholder="Provide more details..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newThread.category}
                      onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select
                      value={newThread.city_tag}
                      onChange={(e) => setNewThread({ ...newThread, city_tag: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateThread}
                  disabled={!newThread.title.trim() || !newThread.body.trim()}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            isOpen={messageCenterOpen}
            onClose={() => {
              setMessageCenterOpen(false)
              setMessageCenterUserId(null)
            }}
            initialOtherUserId={messageCenterUserId}
          />
        )}
      </div>
    </div>
  )
}
