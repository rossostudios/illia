// Changelog: Fixed truncated search bar to full-width with integrated icon/clear; expanded hero text; added auto-complete stub.
// - Search bar now full-width with proper placeholder text
// - Hero text no longer truncates on any screen size
// - Added search suggestions dropdown (hardcoded for MVP, ready for Supabase)
// - Integrated search icon and clear button for better UX
// - Routes to Service Finder with query params on search

'use client'

import { Award, CheckCircle, Loader2, MapPin, Search, Sparkles, Star, Users, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
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
  const searchInputId = useId()

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
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }

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
      // Include recent searches in suggestions
      const combined = [
        ...new Set([
          ...filtered,
          ...recentSearches.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase())),
        ]),
      ].slice(0, 5)
      setFilteredSuggestions(combined.length > 0 ? combined : SEARCH_SUGGESTIONS.slice(0, 3))
      setShowSuggestions(true)
      setSelectedSuggestionIndex(-1)
    } else if (searchQuery.length === 0 && recentSearches.length > 0) {
      // Show recent searches when input is focused but empty
      setFilteredSuggestions(recentSearches.slice(0, 5))
    } else {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }, [searchQuery, recentSearches])

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery
    if (searchTerm.trim()) {
      // Save to recent searches
      const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 10)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))

      router.push(`/dashboard/explore?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedSuggestionIndex >= 0) {
        handleSearch(filteredSuggestions[selectedSuggestionIndex])
        setShowSuggestions(false)
      } else {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
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
      <div className="bg-gradient-to-br from-teal-50/50 via-white to-blue-50/50 dark:from-gray-800/50 dark:via-gray-800 dark:to-gray-900/50 rounded-xl p-6 md:p-8 border border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 animate-fade-in">
              Welcome back, {user?.email?.split('@')[0] || 'Explorer'}!
            </h1>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300">
              Ready to find your ideal home helper in{' '}
              {selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'}?
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 dark:text-gray-400 pointer-events-none" />
              <input
                id={searchInputId}
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={`Search for cleaners, cooks, or home help in ${selectedCity === 'medellin' ? 'El Poblado' : 'Lagoa'}...`}
                aria-label="Search for home services"
                aria-autocomplete="list"
                aria-controls="search-suggestions"
                aria-expanded={showSuggestions}
                aria-activedescendant={
                  selectedSuggestionIndex >= 0 ? `suggestion-${selectedSuggestionIndex}` : undefined
                }
                className="w-full pl-12 pr-24 py-4 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setShowSuggestions(false)
                    searchRef.current?.focus()
                  }}
                  className="absolute right-20 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleSearch()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-full hover:bg-teal-700 dark:hover:bg-teal-600 focus:bg-teal-700 dark:focus:bg-teal-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all font-medium shadow-sm"
              >
                Search
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                id="search-suggestions"
                role="listbox"
                className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 px-3 py-1">
                    {searchQuery.length === 0 ? 'Recent searches' : 'Suggestions'}
                  </p>
                  {filteredSuggestions.map((suggestion, idx) => {
                    const isSelected = idx === selectedSuggestionIndex
                    const isRecent = recentSearches.includes(suggestion)

                    return (
                      <button
                        type="button"
                        key={idx}
                        id={`suggestion-${idx}`}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSearchQuery(suggestion)
                          setShowSuggestions(false)
                          handleSearch(suggestion)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                          isSelected
                            ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'
                            : 'hover:bg-teal-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                        } focus:bg-teal-50 dark:focus:bg-gray-700 focus:outline-none focus:text-teal-600 dark:focus:text-teal-400`}
                      >
                        <Search className="inline h-3 w-3 mr-2 text-gray-500 dark:text-gray-400" />
                        {suggestion}
                        {isRecent && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            (recent)
                          </span>
                        )}
                      </button>
                    )
                  })}
                  {searchQuery.length === 0 && recentSearches.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setRecentSearches([])
                        localStorage.removeItem('recentSearches')
                        setShowSuggestions(false)
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mt-1 border-t border-gray-200 dark:border-gray-700"
                    >
                      Clear recent searches
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* City Selector */}
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCity('medellin')}
              className={`px-4 py-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none ${
                selectedCity === 'medellin'
                  ? 'bg-teal-600 dark:bg-teal-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <MapPin className="inline h-4 w-4 mr-1" />
              Medellín
            </button>
            <button
              type="button"
              onClick={() => setSelectedCity('florianopolis')}
              className={`px-4 py-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none ${
                selectedCity === 'florianopolis'
                  ? 'bg-teal-600 dark:bg-teal-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Your Quick Matches
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    AI-suggested providers based on your preferences
                  </p>
                </div>
                <Link
                  href="/dashboard/explore"
                  className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 focus:text-teal-700 dark:focus:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded font-medium transition-all"
                >
                  View All →
                </Link>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {SAMPLE_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg hover:scale-[1.02] focus-within:shadow-lg focus-within:scale-[1.02] focus-within:ring-2 focus-within:ring-teal-500 dark:focus-within:ring-teal-400 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800 transition-all duration-200 cursor-pointer group bg-white dark:bg-gray-800/50"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={provider.photo}
                      alt={`${provider.name} - ${provider.service} provider in ${provider.location}`}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 group-hover:ring-teal-100 dark:group-hover:ring-teal-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {provider.name}
                            </h3>
                            {provider.verified && (
                              <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {provider.service}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                              {provider.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {provider.rating} ({provider.reviews})
                            </span>
                            <span className="font-medium text-teal-600 dark:text-teal-400">
                              {provider.rate}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            {provider.specialties.map((specialty, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-teal-50 dark:bg-teal-900/20 text-gray-700 dark:text-gray-300 px-2 py-1 rounded font-medium"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                          {/* Why this match? */}
                          <details className="mt-3">
                            <summary className="text-xs text-teal-600 dark:text-teal-400 cursor-pointer hover:text-teal-700 dark:hover:text-teal-300 font-medium">
                              Why this match? →
                            </summary>
                            <div className="mt-2 p-2 bg-teal-50 dark:bg-teal-900/20 rounded text-xs text-gray-700 dark:text-gray-300">
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
                          type="button"
                          onClick={() => handleRequestIntro(provider.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none ${
                            membershipTier === 'premium' || matchesUsed < matchesLimit
                              ? 'bg-teal-600 dark:bg-teal-500 text-white hover:bg-teal-700 dark:hover:bg-teal-600 shadow-sm'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed'
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
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Sparkles className="h-12 w-12 text-teal-600 dark:text-teal-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">
                    Let's find your perfect match!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Take our 2-minute quiz to get personalized recommendations
                  </p>
                  <Link
                    href="/en/dashboard/quiz"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-500 dark:to-teal-600 text-white rounded-lg font-medium hover:from-teal-700 hover:to-teal-800 dark:hover:from-teal-600 dark:hover:to-teal-700 focus:from-teal-700 focus:to-teal-800 dark:focus:from-teal-600 dark:focus:to-teal-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all shadow-lg hover:shadow-xl focus:shadow-xl transform hover:-translate-y-0.5 focus:-translate-y-0.5"
                  >
                    <Sparkles className="h-5 w-5" />
                    Take the Smart Match Quiz
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">2 min</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Membership Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Your Membership</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  membershipTier === 'premium'
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {membershipTier === 'premium' ? 'Premium' : 'Free Tier'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Matches Used</span>
                  <span className="font-medium">
                    {matchesUsed}/{matchesLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-teal-600 dark:bg-teal-400 h-2 rounded-full transition-all"
                    style={{ width: `${(matchesUsed / matchesLimit) * 100}%` }}
                  />
                </div>
              </div>

              {membershipTier === 'free' && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-medium">
                    Premium members hire 2x faster with unlimited intros
                  </p>
                  <Link
                    href="/dashboard/membership"
                    className="block w-full text-center px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-500 dark:to-teal-600 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 dark:hover:from-teal-600 dark:hover:to-teal-700 focus:from-teal-700 focus:to-teal-800 dark:focus:from-teal-600 dark:focus:to-teal-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all shadow-md hover:shadow-lg focus:shadow-lg"
                  >
                    Start Free 7-Day Trial →
                  </Link>
                  <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
                    Then $9/mo • Cancel anytime
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Community Highlights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Community Buzz</h3>
              <Link
                href="/dashboard/community"
                className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 focus:text-teal-700 dark:focus:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded transition-all"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {COMMUNITY_POSTS.map((post) => (
                <Link
                  key={post.id}
                  href="/dashboard/community"
                  className="block pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-750 focus:bg-gray-50 dark:focus:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-inset -mx-2 px-2 py-2 rounded transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.replies} replies</span>
                        <span>•</span>
                        <span>{post.time}</span>
                      </div>
                    </div>
                    {post.trending ? (
                      <span className="text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
                        Hot
                      </span>
                    ) : membershipTier === 'premium' ? (
                      <span className="text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 rounded">
                        Priority
                      </span>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Tip of the Day
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                      In Colombia, always agree on payment terms upfront. Weekly payments are common
                      for domestic help.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-gray-800 rounded-xl border border-teal-200 dark:border-teal-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Active Now</p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">152</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">expats online</p>
              </div>
              <Users className="h-8 w-8 text-teal-600 dark:text-teal-400 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
