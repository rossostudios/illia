// Changelog: Fixed truncated search bar to full-width with integrated icon/clear; expanded hero text; added auto-complete stub.
// - Search bar now full-width with proper placeholder text
// - Hero text no longer truncates on any screen size
// - Added search suggestions dropdown (hardcoded for MVP, ready for Supabase)
// - Integrated search icon and clear button for better UX
// - Routes to Service Finder with query params on search

'use client'

import { Award, CheckCircle, Loader2, MapPin, Search, Star, Users, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { createClient } from '@/lib/supabase/client'

// Mock data for service providers
const SAMPLE_PROVIDERS = [
  {
    id: 1,
    name: 'Maria Rodriguez',
    service: 'Weekly Cleaning & Cooking',
    location: 'El Poblado, Medellín',
    rate: '$200/month',
    rating: 4.8,
    reviews: 47,
    languages: ['Spanish', 'English'],
    photo: 'https://i.pravatar.cc/150?img=1',
    verified: true,
    specialties: ['Vegan cooking', 'Pet-friendly'],
    availability: 'Mon-Fri mornings',
  },
  {
    id: 2,
    name: 'Ana Silva',
    service: 'House Cleaning',
    location: 'Florianópolis',
    rate: 'R$800/month',
    rating: 4.9,
    reviews: 62,
    languages: ['Portuguese', 'English'],
    photo: 'https://i.pravatar.cc/150?img=5',
    verified: true,
    specialties: ['Deep cleaning', 'Organization'],
    availability: 'Flexible schedule',
  },
  {
    id: 3,
    name: 'Carlos Martinez',
    service: 'Cooking & Meal Prep',
    location: 'Laureles, Medellín',
    rate: '$150/month',
    rating: 4.7,
    reviews: 31,
    languages: ['Spanish'],
    photo: 'https://i.pravatar.cc/150?img=8',
    verified: false,
    specialties: ['Colombian cuisine', 'Meal planning'],
    availability: 'Weekday evenings',
  },
]

const COMMUNITY_POSTS = [
  {
    id: 1,
    title: 'Best cleaning services in Comuna 13?',
    author: 'Sarah M.',
    replies: 12,
    time: '2 hours ago',
    trending: true,
  },
  {
    id: 2,
    title: 'Tip: Always use written contracts in Colombia',
    author: 'Mike D.',
    replies: 8,
    time: '5 hours ago',
    trending: false,
  },
  {
    id: 3,
    title: 'Found amazing cook in Florianópolis!',
    author: 'Emma L.',
    replies: 23,
    time: '1 day ago',
    trending: true,
  },
]

// Popular search suggestions
const SEARCH_SUGGESTIONS = [
  'cleaners in El Poblado',
  'weekly maid service Laureles',
  'English speaking cook Medellín',
  'house cleaning Florianópolis',
  'pet-friendly cleaners',
  'vegan meal prep',
  'deep cleaning service',
]

export default function DashboardPage() {
  const router = useRouter()
  const _supabase = createClient()
  const { user, loading: sessionLoading } = useSession()
  const searchRef = useRef<HTMLInputElement>(null)

  const [selectedCity, setSelectedCity] = useState<'medellin' | 'florianopolis'>('medellin')
  const [_loading, _setLoading] = useState(false)
  const [showWelcomeQuiz, setShowWelcomeQuiz] = useState(false)
  const [membershipTier, _setMembershipTier] = useState<'free' | 'premium'>('free')
  const [matchesUsed, setMatchesUsed] = useState(2)
  const [matchesLimit, _setMatchesLimit] = useState(5)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])

  useEffect(() => {
    // Check if user is new and needs quiz
    if (user && !localStorage.getItem('welcomeQuizCompleted')) {
      setShowWelcomeQuiz(true)
    }

    // Simple geo-detection (would use real API in production)
    const detectCity = () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (timezone?.includes('Sao_Paulo')) {
        setSelectedCity('florianopolis')
      } else if (timezone?.includes('Bogota')) {
        setSelectedCity('medellin')
      }
    }
    detectCity()
  }, [user])

  useEffect(() => {
    // Filter suggestions based on query
    if (searchQuery.length > 0) {
      const filtered = SEARCH_SUGGESTIONS.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredSuggestions(filtered.length > 0 ? filtered : SEARCH_SUGGESTIONS.slice(0, 3))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [searchQuery])

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery
    if (searchTerm.trim()) {
      router.push(`/dashboard/explore?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleRequestIntro = (providerId: number) => {
    if (membershipTier === 'free' && matchesUsed >= matchesLimit) {
      router.push('/dashboard/membership')
      return
    }
    console.log('Requesting intro to provider:', providerId)
    setMatchesUsed((prev) => prev + 1)
  }

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Fixed Search */}
      <div className="bg-gradient-to-br from-warmth-50 via-white to-sunset-50 rounded-xl p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 animate-fade-in">
              Welcome back, {user?.email?.split('@')[0] || 'Explorer'}!
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Ready to find your ideal home helper in{' '}
              {selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'}?
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                placeholder={`Search for cleaners, cooks, or home help in ${selectedCity === 'medellin' ? 'El Poblado' : 'Lagoa'}...`}
                aria-label="Search for home services"
                className="w-full pl-12 pr-24 py-4 bg-white rounded-full shadow-md border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setShowSuggestions(false)
                    searchRef.current?.focus()
                  }}
                  className="absolute right-20 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => handleSearch()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors font-medium"
              >
                Search
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-2">
                  <p className="text-xs text-gray-500 px-3 py-1">Popular searches</p>
                  {filteredSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(suggestion)
                        setShowSuggestions(false)
                        handleSearch(suggestion)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-teal-50 rounded-lg transition-colors text-sm text-gray-700 hover:text-teal-600"
                    >
                      <Search className="inline h-3 w-3 mr-2 text-gray-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* City Selector */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setSelectedCity('medellin')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCity === 'medellin'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              <MapPin className="inline h-4 w-4 mr-1" />
              Medellín
            </button>
            <button
              onClick={() => setSelectedCity('florianopolis')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCity === 'florianopolis'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              <MapPin className="inline h-4 w-4 mr-1" />
              Florianópolis
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Matches Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Quick Matches</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    AI-suggested providers based on your preferences
                  </p>
                </div>
                <Link
                  href="/dashboard/explore"
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {SAMPLE_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className="border rounded-lg p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={provider.photo}
                      alt={`${provider.name} - ${provider.service} provider in ${provider.location}`}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-white group-hover:ring-teal-100"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                            {provider.verified && <CheckCircle className="h-4 w-4 text-teal-600" />}
                          </div>
                          <p className="text-sm text-gray-600">{provider.service}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {provider.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {provider.rating} ({provider.reviews})
                            </span>
                            <span className="font-medium text-teal-600">{provider.rate}</span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            {provider.specialties.map((specialty, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-warmth-50 text-gray-700 px-2 py-1 rounded"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                          {/* Why this match? */}
                          <details className="mt-3">
                            <summary className="text-xs text-teal-600 cursor-pointer hover:text-teal-700 font-medium">
                              Why this match? →
                            </summary>
                            <div className="mt-2 p-2 bg-teal-50 rounded text-xs text-gray-600">
                              <span className="font-medium">High Match Score:</span>
                              <ul className="mt-1 space-y-0.5 ml-2">
                                <li>
                                  ✓ Speaks{' '}
                                  {provider.languages.includes('English')
                                    ? 'English'
                                    : 'your language'}
                                </li>
                                <li>✓ In your budget range</li>
                                <li>✓ Available {provider.availability}</li>
                                {provider.verified && <li>✓ Verified provider</li>}
                              </ul>
                            </div>
                          </details>
                        </div>
                        <button
                          onClick={() => handleRequestIntro(provider.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            membershipTier === 'premium' || matchesUsed < matchesLimit
                              ? 'bg-teal-600 text-white hover:bg-teal-700'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={membershipTier === 'free' && matchesUsed >= matchesLimit}
                        >
                          {membershipTier === 'premium'
                            ? 'Request Intro'
                            : matchesUsed >= matchesLimit
                              ? 'Upgrade'
                              : 'Request Intro'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state for quiz */}
              {showWelcomeQuiz && (
                <div className="text-center py-8 bg-warmth-50 rounded-lg">
                  <Users className="h-12 w-12 text-sunset-500 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">Let's find your perfect match!</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Take our 2-minute quiz to get personalized recommendations
                  </p>
                  <Link
                    href="/quiz"
                    className="inline-block px-6 py-2 bg-sunset-500 text-white rounded-lg hover:bg-sunset-600 transition-colors"
                  >
                    Start Quiz →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Membership Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Your Membership</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  membershipTier === 'premium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {membershipTier === 'premium' ? 'Premium' : 'Free Tier'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Matches Used</span>
                  <span className="font-medium">
                    {matchesUsed}/{matchesLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all"
                    style={{ width: `${(matchesUsed / matchesLimit) * 100}%` }}
                  />
                </div>
              </div>

              {membershipTier === 'free' && (
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-600 mb-3">
                    Premium members hire 2x faster with unlimited intros
                  </p>
                  <Link
                    href="/dashboard/membership"
                    className="block w-full text-center px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg"
                  >
                    Start Free 7-Day Trial →
                  </Link>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Then $9/mo • Cancel anytime
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Community Highlights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Community Buzz</h3>
              <Link
                href="/dashboard/community"
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {COMMUNITY_POSTS.map((post) => (
                <Link
                  key={post.id}
                  href="/dashboard/community"
                  className="block pb-3 border-b last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 py-2 rounded transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1 group-hover:text-teal-600">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.replies} replies</span>
                        <span>•</span>
                        <span>{post.time}</span>
                      </div>
                    </div>
                    {post.trending ? (
                      <span className="text-xs bg-sunset-100 text-sunset-700 px-2 py-0.5 rounded-full">
                        Hot
                      </span>
                    ) : membershipTier === 'premium' ? (
                      <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                        Priority
                      </span>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="bg-warmth-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-sunset-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tip of the Day</p>
                    <p className="text-xs text-gray-600 mt-1">
                      In Colombia, always agree on payment terms upfront. Weekly payments are common
                      for domestic help.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl border border-teal-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Active Now</p>
                <p className="text-2xl font-bold text-teal-600">152</p>
                <p className="text-xs text-gray-500">expats online</p>
              </div>
              <Users className="h-8 w-8 text-teal-600 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
