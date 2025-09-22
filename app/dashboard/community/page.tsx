// Changelog: Created Community forums page—search/categories, threaded list/modals, new post form; Supabase integration stub.

'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  MessageSquare,
  TrendingUp,
  Clock,
  Eye,
  MapPin,
  Info,
  Plus,
  X,
  ChevronRight,
  Flag,
  Heart,
  Reply,
  Users
} from 'lucide-react'

// Mock thread data
const MOCK_THREADS = [
  {
    id: 1,
    title: 'Reliable weekly cook in Laureles?',
    excerpt: 'Looking for someone who can meal prep 3x/week. Any recommendations for Colombian cuisine experts?',
    author: 'Sarah M.',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    category: 'cooking',
    city: 'medellin',
    replies: 12,
    views: 150,
    lastReply: '2 hours ago',
    isHot: true,
    isPremium: false,
    posts: [
      {
        id: 1,
        author: 'Sarah M.',
        avatar: 'https://i.pravatar.cc/150?img=1',
        content: 'Looking for someone who can meal prep 3x/week. Any recommendations for Colombian cuisine experts? Budget around $200/month.',
        timestamp: '2 hours ago',
        isPremium: false
      },
      {
        id: 2,
        author: 'Mike D.',
        avatar: 'https://i.pravatar.cc/150?img=8',
        content: 'I highly recommend Carlos Martinez! He\'s been cooking for us for 6 months. Amazing arepas and bandeja paisa. DM me for his WhatsApp.',
        timestamp: '1 hour ago',
        isPremium: true
      },
      {
        id: 3,
        author: 'Emma L.',
        avatar: 'https://i.pravatar.cc/150?img=5',
        content: 'Check the Directory page - there are several cooks in Laureles with great ratings. I use Diego and he\'s fantastic for meal prep.',
        timestamp: '30 minutes ago',
        isPremium: false
      }
    ]
  },
  {
    id: 2,
    title: 'Best cleaners in El Poblado - vetted list',
    excerpt: 'After 2 years here, sharing my trusted cleaners list. All speak some English and are very reliable...',
    author: 'John K.',
    authorAvatar: 'https://i.pravatar.cc/150?img=11',
    category: 'cleaning',
    city: 'medellin',
    replies: 28,
    views: 342,
    lastReply: '5 hours ago',
    isHot: true,
    isPremium: true,
    posts: []
  },
  {
    id: 3,
    title: 'Visa renewal tips for Florianópolis?',
    excerpt: 'My digital nomad visa expires next month. What documents do I need for renewal? Any gotchas?',
    author: 'Lisa R.',
    authorAvatar: 'https://i.pravatar.cc/150?img=9',
    category: 'general',
    city: 'florianopolis',
    replies: 8,
    views: 89,
    lastReply: '1 day ago',
    isHot: false,
    isPremium: false,
    posts: []
  },
  {
    id: 4,
    title: 'Warning: Avoid this cleaning service',
    excerpt: 'Had a bad experience with XYZ Cleaning. They damaged my apartment and refused to compensate...',
    author: 'Carlos P.',
    authorAvatar: 'https://i.pravatar.cc/150?img=33',
    category: 'reviews',
    city: 'medellin',
    replies: 15,
    views: 201,
    lastReply: '3 hours ago',
    isHot: true,
    isPremium: false,
    posts: []
  },
  {
    id: 5,
    title: 'Eco-friendly cleaners in Campeche?',
    excerpt: 'Looking for green cleaning services near the beach. Any providers use natural products?',
    author: 'Ana B.',
    authorAvatar: 'https://i.pravatar.cc/150?img=20',
    category: 'cleaning',
    city: 'florianopolis',
    replies: 4,
    views: 67,
    lastReply: '2 days ago',
    isHot: false,
    isPremium: false,
    posts: []
  },
  {
    id: 6,
    title: 'Monthly potluck meetup - join us!',
    excerpt: 'Every first Saturday we do a potluck in Parque Lleras. Great way to meet other expats and share tips!',
    author: 'Tom W.',
    authorAvatar: 'https://i.pravatar.cc/150?img=15',
    category: 'general',
    city: 'medellin',
    replies: 31,
    views: 412,
    lastReply: '6 hours ago',
    isHot: true,
    isPremium: false,
    posts: []
  },
  {
    id: 7,
    title: 'Meal prep services comparison',
    excerpt: 'I tried 5 different meal prep services this month. Here\'s my detailed review with prices and quality...',
    author: 'Rachel G.',
    authorAvatar: 'https://i.pravatar.cc/150?img=25',
    category: 'cooking',
    city: 'florianopolis',
    replies: 19,
    views: 256,
    lastReply: '12 hours ago',
    isHot: true,
    isPremium: true,
    posts: []
  },
  {
    id: 8,
    title: 'Contract template for home help?',
    excerpt: 'Does anyone have a Spanish/Portuguese contract template for hiring cleaners? Want to do things properly.',
    author: 'David L.',
    authorAvatar: 'https://i.pravatar.cc/150?img=12',
    category: 'general',
    city: 'medellin',
    replies: 6,
    views: 95,
    lastReply: '3 days ago',
    isHot: false,
    isPremium: false,
    posts: []
  }
]

const CATEGORIES = [
  { id: 'all', label: 'All', count: 156 },
  { id: 'medellin', label: 'Medellín', count: 89 },
  { id: 'florianopolis', label: 'Florianópolis', count: 67 },
  { id: 'cleaning', label: 'Cleaning', count: 45 },
  { id: 'cooking', label: 'Cooking', count: 32 },
  { id: 'reviews', label: 'Reviews', count: 28 },
  { id: 'general', label: 'General', count: 51 }
]

const RELATED_PROVIDERS = [
  {
    id: 1,
    name: 'Carlos Martinez',
    service: 'Cooking & Meal Prep',
    rating: 4.7,
    location: 'Laureles'
  },
  {
    id: 2,
    name: 'Diego Ramirez',
    service: 'Meal Prep',
    rating: 4.9,
    location: 'Envigado'
  },
  {
    id: 3,
    name: 'Ana Silva',
    service: 'House Cleaning',
    rating: 4.9,
    location: 'Lagoa'
  }
]

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [newPost, setNewPost] = useState({
    title: '',
    body: '',
    city: 'medellin',
    category: 'general'
  })

  // Filter threads
  const filteredThreads = MOCK_THREADS.filter(thread => {
    if (searchQuery && !thread.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !thread.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'medellin' || selectedCategory === 'florianopolis') {
        return thread.city === selectedCategory
      }
      return thread.category === selectedCategory
    }
    return true
  })

  const handleNewPost = () => {
    // Mock post creation
    console.log('Creating post:', newPost)
    setShowNewPostModal(false)
    setNewPost({ title: '', body: '', city: 'medellin', category: 'general' })
  }

  const handleReply = () => {
    // Mock reply
    console.log('Replying:', replyText)
    setReplyText('')
  }

  return (
    <div className="min-h-screen bg-warmth-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-6">
          <div className="flex items-start gap-2">
            <h1 className="text-3xl font-bold text-teal-600">Community</h1>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="p-1 hover:bg-teal-50 rounded-full transition-colors"
              >
                <MessageSquare className="h-5 w-5 text-teal-500" />
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-8 w-64 p-3 bg-white rounded-lg shadow-lg border border-teal-100 z-10">
                  <p className="text-sm text-gray-600">
                    Our forums are for real talk on settling in—ask about maids in Medellín or cooking pros in Floripa. Premium: Unlimited replies & priority visibility.
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600 mt-2">Connect with expats & share home help tips</p>
        </div>

        {/* Search & Controls */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 sticky top-0 z-20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search forums: El Poblado cleaners..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* New Post Button */}
            <button
              onClick={() => setShowNewPostModal(true)}
              className="px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              New Post
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
                <span className="ml-2 text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Threads List */}
        {filteredThreads.length > 0 ? (
          <div className="space-y-4 mb-8">
            {filteredThreads.map((thread, index) => (
              <div
                key={thread.id}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all cursor-pointer opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedThread(thread)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Thread Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={thread.authorAvatar}
                        alt={thread.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                            {thread.title}
                          </h3>
                          {thread.isHot && (
                            <span className="px-2 py-0.5 bg-sunset-100 text-sunset-700 text-xs rounded-full font-medium flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Hot
                            </span>
                          )}
                          {thread.isPremium && (
                            <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full font-medium">
                              Premium
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{thread.author}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {thread.city === 'medellin' ? 'Medellín' : 'Florianópolis'}
                          </span>
                          <span>•</span>
                          <span>{thread.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Thread Excerpt */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 pl-13">
                      {thread.excerpt}
                    </p>

                    {/* Thread Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 pl-13">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {thread.replies} replies
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {thread.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {thread.lastReply}
                      </span>
                    </div>
                  </div>

                  {/* Reply Arrow */}
                  <ChevronRight className="h-5 w-5 text-gray-400 mt-2" />
                </div>
              </div>
            ))}

            {/* Load More */}
            <div className="text-center pt-4">
              <button className="px-6 py-2 text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors">
                Load More Threads
              </button>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-xl">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No threads found</h3>
            <p className="text-gray-600 mb-6">
              Start the conversation—post your first question!
            </p>
            <button
              onClick={() => setShowNewPostModal(true)}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Create First Post
            </button>
          </div>
        )}

        {/* New Post Modal */}
        {showNewPostModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">New Post</h2>
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="e.g., Looking for a reliable cleaner in El Poblado"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Post Content
                    </label>
                    <textarea
                      value={newPost.body}
                      onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                      placeholder="Share details about what you're looking for..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <select
                        value={newPost.city}
                        onChange={(e) => setNewPost({ ...newPost, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="medellin">Medellín</option>
                        <option value="florianopolis">Florianópolis</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newPost.category}
                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="general">General</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="cooking">Cooking</option>
                        <option value="reviews">Reviews</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNewPost}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                  >
                    Post to Community
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Thread Detail Modal */}
        {selectedThread && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
              {/* Main Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* Thread Header */}
                  <div className="flex items-start justify-between mb-6 pb-4 border-b">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedThread.title}</h2>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedThread.city === 'medellin' ? 'Medellín' : 'Florianópolis'}
                        </span>
                        <span>•</span>
                        <span>{selectedThread.category}</span>
                        <span>•</span>
                        <span>{selectedThread.views} views</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedThread(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Posts */}
                  <div className="space-y-4 mb-6">
                    {(selectedThread.posts.length > 0 ? selectedThread.posts : [
                      {
                        id: 1,
                        author: selectedThread.author,
                        avatar: selectedThread.authorAvatar,
                        content: selectedThread.excerpt,
                        timestamp: selectedThread.lastReply,
                        isPremium: selectedThread.isPremium
                      }
                    ]).map((post: any) => (
                      <div key={post.id} className="flex gap-3">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{post.author}</span>
                                {post.isPremium && (
                                  <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">
                                    Premium
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{post.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-700">{post.content}</p>
                          </div>
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            <button className="flex items-center gap-1 hover:text-teal-600">
                              <Reply className="h-3 w-3" />
                              Reply
                            </button>
                            <button className="flex items-center gap-1 hover:text-red-600">
                              <Flag className="h-3 w-3" />
                              Report
                            </button>
                            <button className="flex items-center gap-1 hover:text-sunset-600">
                              <Heart className="h-3 w-3" />
                              Like
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Add Reply</h3>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-gray-500">
                        Premium members get priority visibility
                      </p>
                      <button
                        onClick={handleReply}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-80 border-l bg-gray-50 p-6 overflow-y-auto">
                <h3 className="font-semibold text-gray-900 mb-4">Related Providers</h3>
                <div className="space-y-3 mb-6">
                  {RELATED_PROVIDERS.map(provider => (
                    <div key={provider.id} className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{provider.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-sunset-600">★</span>
                          <span className="text-xs">{provider.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{provider.service}</p>
                      <p className="text-xs text-gray-500">{provider.location}</p>
                      <button className="text-xs text-teal-600 hover:text-teal-700 mt-2">
                        View Profile →
                      </button>
                    </div>
                  ))}
                </div>

                <h3 className="font-semibold text-gray-900 mb-4">Similar Threads</h3>
                <div className="space-y-3">
                  {MOCK_THREADS.slice(0, 3).map(thread => (
                    <div key={thread.id} className="text-sm">
                      <p className="font-medium text-gray-800 hover:text-teal-600 cursor-pointer line-clamp-2">
                        {thread.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {thread.replies} replies • {thread.lastReply}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}