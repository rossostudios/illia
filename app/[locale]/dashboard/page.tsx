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
import { useSession } from '@/hooks/use-session'
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

  const handleRequestIntro = (_providerId: number) => {
    if (membershipTier === 'free' && matchesUsed >= matchesLimit) {
      router.push('/dashboard/membership')
      return
    }
    setMatchesUsed((prev) => prev + 1)
  }

  if (sessionLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Hero Section with Fixed Search */}
      <div className="rounded-lg border border-gray-100 bg-gradient-to-br from-teal-50/50 via-white to-blue-50/50 p-4 md:rounded-xl md:p-6 lg:p-8 dark:border-gray-800 dark:from-gray-900/50 dark:via-gray-900 dark:to-black/50">
        <div className="mx-auto max-w-5xl">
          {/* Hero Header */}
          <div className="mb-4 text-center md:mb-6">
            <h1 className="mb-2 animate-fade-in font-bold text-gray-900 text-xl sm:text-2xl md:text-3xl dark:text-white">
              Welcome back, {user?.email?.split('@')[0] || 'Explorer'}!
            </h1>
            <p className="px-2 text-gray-700 text-sm sm:text-base md:text-lg dark:text-gray-300">
              Ready to find your ideal home helper in{' '}
              {selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'}?
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative mx-auto mb-4 max-w-3xl px-2 sm:px-0 md:mb-6">
            <div className="relative">
              <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 text-gray-600 sm:left-4 sm:h-5 sm:w-5 dark:text-gray-400" />
              <input
                aria-activedescendant={
                  selectedSuggestionIndex >= 0 ? `suggestion-${selectedSuggestionIndex}` : undefined
                }
                aria-autocomplete="list"
                aria-controls="search-suggestions"
                aria-expanded={showSuggestions}
                aria-label="Search for home services"
                className="w-full rounded-full border border-gray-200 bg-white py-3 pr-20 pl-10 text-gray-900 text-sm shadow-md transition-all placeholder:text-gray-500 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:py-4 sm:pr-24 sm:pl-12 sm:text-base dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-teal-400 dark:focus:ring-offset-gray-900 dark:placeholder:text-gray-400"
                id={searchInputId}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder={`Search for cleaners, cooks, or home help in ${selectedCity === 'medellin' ? 'El Poblado' : 'Lagoa'}...`}
                ref={searchRef}
                type="text"
                value={searchQuery}
              />
              {searchQuery && (
                <button
                  aria-label="Clear search"
                  className="-translate-y-1/2 absolute top-1/2 right-20 p-1.5 text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => {
                    setSearchQuery('')
                    setShowSuggestions(false)
                    searchRef.current?.focus()
                  }}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                className="-translate-y-1/2 absolute top-1/2 right-2 flex min-w-[60px] items-center justify-center rounded-full bg-teal-600 px-4 py-1.5 font-medium text-sm text-white shadow-sm transition-all hover:bg-teal-700 focus:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:px-5 sm:py-2 sm:text-base dark:bg-teal-500 dark:focus:bg-teal-600 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-900 dark:hover:bg-teal-600"
                onClick={() => handleSearch()}
                type="button"
              >
                <span className="hidden sm:inline">Search</span>
                <Search className="h-4 w-4 sm:hidden" />
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-950"
                id="search-suggestions"
                role="listbox"
              >
                <div className="p-2">
                  <p className="px-3 py-1 text-gray-600 text-xs dark:text-gray-400">
                    {searchQuery.length === 0 ? 'Recent searches' : 'Suggestions'}
                  </p>
                  {filteredSuggestions.map((suggestion, idx) => {
                    const isSelected = idx === selectedSuggestionIndex
                    const isRecent = recentSearches.includes(suggestion)

                    return (
                      <button
                        aria-selected={isSelected}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${
                          isSelected
                            ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400'
                            : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-teal-400'
                        } focus:bg-teal-50 focus:text-teal-600 focus:outline-none dark:focus:bg-gray-700 dark:focus:text-teal-400`}
                        id={`suggestion-${idx}`}
                        key={idx}
                        onClick={() => {
                          setSearchQuery(suggestion)
                          setShowSuggestions(false)
                          handleSearch(suggestion)
                        }}
                        role="option"
                        type="button"
                      >
                        <Search className="mr-2 inline h-3 w-3 text-gray-500 dark:text-gray-400" />
                        {suggestion}
                        {isRecent && (
                          <span className="ml-2 text-gray-500 text-xs dark:text-gray-400">
                            (recent)
                          </span>
                        )}
                      </button>
                    )
                  })}
                  {searchQuery.length === 0 && recentSearches.length > 0 && (
                    <button
                      className="mt-1 w-full border-gray-200 border-t px-3 py-2 text-left text-gray-500 text-xs hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => {
                        setRecentSearches([])
                        localStorage.removeItem('recentSearches')
                        setShowSuggestions(false)
                      }}
                      type="button"
                    >
                      Clear recent searches
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* City Selector */}
          <div className="flex justify-center gap-2 px-2 sm:px-0">
            <button
              className={`rounded-lg px-3 py-2 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:px-4 sm:text-base ${
                selectedCity === 'medellin'
                  ? 'bg-teal-600 text-white shadow-lg dark:bg-teal-600'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
              onClick={() => setSelectedCity('medellin')}
              type="button"
            >
              <MapPin className="mr-1 inline h-4 w-4" />
              Medellín
            </button>
            <button
              className={`rounded-lg px-3 py-2 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:px-4 sm:text-base ${
                selectedCity === 'florianopolis'
                  ? 'bg-teal-600 text-white shadow-lg dark:bg-teal-600'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
              onClick={() => setSelectedCity('florianopolis')}
              type="button"
            >
              <MapPin className="mr-1 inline h-4 w-4" />
              Florianópolis
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid - Stack on mobile */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {/* Quick Matches Section */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm md:rounded-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="border-gray-200 border-b p-4 md:p-6 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900 text-lg md:text-xl dark:text-white">
                    Your Quick Matches
                  </h2>
                  <p className="mt-1 text-gray-600 text-xs sm:text-sm dark:text-gray-400">
                    AI-suggested providers based on your preferences
                  </p>
                </div>
                <Link
                  className="rounded font-medium text-sm text-teal-600 transition-all hover:text-teal-700 focus:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:text-teal-400 dark:focus:text-teal-300 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-900 dark:hover:text-teal-300"
                  href="/dashboard/explore"
                >
                  View All →
                </Link>
              </div>
            </div>

            <div className="space-y-3 p-4 md:space-y-4 md:p-6">
              {SAMPLE_PROVIDERS.map((provider) => (
                <div
                  className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-3 transition-all duration-200 hover:shadow-lg md:p-4 dark:border-gray-800 dark:bg-gray-950/50"
                  key={provider.id}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <img
                      alt={`${provider.name} - ${provider.service} provider in ${provider.location}`}
                      className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-2 ring-white group-hover:ring-teal-100 sm:h-14 sm:w-14 md:h-16 md:w-16 dark:ring-gray-700 dark:group-hover:ring-teal-900"
                      src={provider.photo}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate font-semibold text-gray-900 text-sm sm:text-base dark:text-white">
                              {provider.name}
                            </h3>
                            {provider.verified && (
                              <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                            )}
                          </div>
                          <p className="text-gray-700 text-xs sm:text-sm dark:text-gray-300">
                            {provider.service}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-gray-600 text-xs sm:gap-4 dark:text-gray-400">
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
                          <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                            {provider.specialties.map((specialty, idx) => (
                              <span
                                className="rounded bg-teal-50 px-1.5 py-0.5 font-medium text-[10px] text-gray-700 sm:px-2 sm:py-1 sm:text-xs dark:bg-teal-900/20 dark:text-gray-300"
                                key={idx}
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                          {/* Why this match? - Hidden on mobile */}
                          <details className="mt-3 hidden sm:block">
                            <summary className="cursor-pointer font-medium text-teal-600 text-xs hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
                              Why this match? →
                            </summary>
                            <div className="mt-2 rounded bg-teal-50 p-2 text-[11px] text-gray-700 sm:text-xs dark:bg-teal-900/20 dark:text-gray-300">
                              <span className="font-medium">High Match Score:</span>
                              <ul className="mt-1 ml-2 space-y-0.5">
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
                          className={`flex-shrink-0 rounded-lg px-3 py-1.5 font-medium text-xs transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:px-4 sm:py-2 sm:text-sm ${
                            membershipTier === 'premium' || matchesUsed < matchesLimit
                              ? 'bg-teal-600 text-white shadow-sm hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600'
                              : 'cursor-not-allowed bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                          }`}
                          disabled={membershipTier === 'free' && matchesUsed >= matchesLimit}
                          onClick={() => handleRequestIntro(provider.id)}
                          type="button"
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
                <div className="rounded-lg bg-gray-50 py-8 text-center dark:bg-gray-950">
                  <Sparkles className="mx-auto mb-3 h-12 w-12 text-teal-600 dark:text-teal-400" />
                  <h3 className="mb-2 font-semibold text-gray-900 text-xl dark:text-white">
                    Let's find your perfect match!
                  </h3>
                  <p className="mb-6 text-gray-600 text-sm dark:text-gray-400">
                    Take our 2-minute quiz to get personalized recommendations
                  </p>
                  <Link
                    className="hover:-translate-y-0.5 focus:-translate-y-0.5 inline-flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-teal-700 hover:to-teal-800 hover:shadow-xl focus:from-teal-700 focus:to-teal-800 focus:shadow-xl focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:from-teal-500 dark:to-teal-600 dark:focus:from-teal-600 dark:focus:to-teal-700 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-800 dark:hover:from-teal-600 dark:hover:to-teal-700"
                    href="/en/dashboard/quiz"
                  >
                    <Sparkles className="h-5 w-5" />
                    Take the Smart Match Quiz
                    <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">2 min</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Membership, Community, etc */}
        <div className="space-y-4 md:space-y-6">
          {/* Membership Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:rounded-xl md:p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Your Membership</h3>
              <span
                className={`rounded-full px-3 py-1 font-medium text-xs ${
                  membershipTier === 'premium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                }`}
              >
                {membershipTier === 'premium' ? 'Premium' : 'Free Tier'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Matches Used</span>
                  <span className="font-medium">
                    {matchesUsed}/{matchesLimit}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-900">
                  <div
                    className="h-2 rounded-full bg-teal-600 transition-all dark:bg-teal-400"
                    style={{ width: `${(matchesUsed / matchesLimit) * 100}%` }}
                  />
                </div>
              </div>

              {membershipTier === 'free' && (
                <div className="border-gray-200 border-t pt-3 dark:border-gray-700">
                  <p className="mb-3 font-medium text-gray-600 text-xs dark:text-gray-400">
                    Premium members hire 2x faster with unlimited intros
                  </p>
                  <Link
                    className="block w-full rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2 text-center text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-800 hover:shadow-lg focus:from-teal-700 focus:to-teal-800 focus:shadow-lg focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:from-teal-500 dark:to-teal-600 dark:focus:from-teal-600 dark:focus:to-teal-700 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-800 dark:hover:from-teal-600 dark:hover:to-teal-700"
                    href="/dashboard/membership"
                  >
                    Start Free 7-Day Trial →
                  </Link>
                  <p className="mt-2 text-center text-gray-600 text-xs dark:text-gray-400">
                    Then $9/mo • Cancel anytime
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Community Highlights */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:rounded-xl md:p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Community Buzz</h3>
              <Link
                className="rounded text-sm text-teal-600 transition-all hover:text-teal-700 focus:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:text-teal-400 dark:focus:text-teal-300 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-800 dark:hover:text-teal-300"
                href="/dashboard/community"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {COMMUNITY_POSTS.map((post) => (
                <Link
                  className="-mx-2 group block rounded border-gray-200 border-b px-2 py-2 pb-3 transition-all last:border-0 last:pb-0 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset dark:border-gray-700 dark:focus:bg-gray-850 dark:focus:ring-teal-400 dark:hover:bg-gray-750"
                  href="/dashboard/community"
                  key={post.id}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="mb-1 font-medium text-gray-900 text-sm group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-3 text-gray-600 text-xs dark:text-gray-400">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.replies} replies</span>
                        <span>•</span>
                        <span>{post.time}</span>
                      </div>
                    </div>
                    {post.trending ? (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-orange-700 text-xs dark:bg-orange-900/20 dark:text-orange-300">
                        Hot
                      </span>
                    ) : membershipTier === 'premium' ? (
                      <span className="rounded bg-teal-50 px-2 py-0.5 text-teal-600 text-xs dark:bg-teal-900/20 dark:text-teal-400">
                        Priority
                      </span>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 border-gray-200 border-t pt-4 dark:border-gray-700">
              <div className="rounded-lg bg-teal-50 p-3 dark:bg-teal-900/20">
                <div className="flex items-start gap-2">
                  <Award className="mt-0.5 h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm dark:text-white">
                      Tip of the Day
                    </p>
                    <p className="mt-1 font-medium text-gray-600 text-xs dark:text-gray-400">
                      In Colombia, always agree on payment terms upfront. Weekly payments are common
                      for domestic help.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Users - Compact on mobile */}
          <div className="rounded-lg border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-3 md:rounded-xl md:p-4 dark:border-teal-800 dark:from-teal-900/20 dark:to-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 text-xs sm:text-sm dark:text-white">
                  Active Now
                </p>
                <p className="font-bold text-teal-600 text-xl sm:text-2xl dark:text-teal-400">
                  152
                </p>
                <p className="text-[11px] text-gray-600 sm:text-xs dark:text-gray-400">
                  expats online
                </p>
              </div>
              <Users className="h-8 w-8 text-teal-600 opacity-50 dark:text-teal-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
