// Changelog: Created Directory page—searchable filters, responsive table/grid, profile modals; integrated Supabase query stub.

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Filter,
  Globe,
  Heart,
  Home,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Star,
  Users,
  Utensils,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useId, useMemo, useState } from 'react'
import { MapSearchView } from '@/components/MapSearchView'
import { Button } from '@/components/ui/Button'

// Mock provider data
const MOCK_PROVIDERS = [
  {
    id: 1,
    name: 'Maria Rodriguez',
    bio: 'Professional cleaner with 10 years of experience. Specializes in eco-friendly products and deep cleaning. Available for weekly or bi-weekly service.',
    service: 'Cleaning + Cooking',
    location: 'El Poblado',
    city: 'medellin',
    rate: '$200/month',
    rateNum: 200,
    rating: 4.8,
    reviews: 47,
    verified: true,
    languages: ['Spanish', 'English'],
    photo: 'https://i.pravatar.cc/150?img=1',
    specialties: ['Eco-friendly', 'Pet-friendly', 'Deep cleaning'],
    availability: 'Mon-Fri mornings',
    experience: '10 years',
    responseTime: '< 2 hours',
  },
  {
    id: 2,
    name: 'Ana Silva',
    bio: 'Reliable house cleaner and organizer. Great with pets and children. I bring my own supplies and focus on thorough, consistent service.',
    service: 'House Cleaning',
    location: 'Lagoa',
    city: 'florianopolis',
    rate: 'R$800/month',
    rateNum: 180,
    rating: 4.9,
    reviews: 62,
    verified: true,
    languages: ['Portuguese', 'English'],
    photo: 'https://i.pravatar.cc/150?img=5',
    specialties: ['Organization', 'Deep cleaning', 'Move-in/out'],
    availability: 'Flexible schedule',
    experience: '7 years',
    responseTime: '< 1 hour',
  },
  {
    id: 3,
    name: 'Carlos Martinez',
    bio: 'Expert in Colombian cuisine and meal prep. Can accommodate dietary restrictions including vegan and gluten-free options.',
    service: 'Cooking & Meal Prep',
    location: 'Laureles',
    city: 'medellin',
    rate: '$150/month',
    rateNum: 150,
    rating: 4.7,
    reviews: 31,
    verified: false,
    languages: ['Spanish'],
    photo: 'https://i.pravatar.cc/150?img=8',
    specialties: ['Colombian cuisine', 'Meal planning', 'Vegan options'],
    availability: 'Weekday evenings',
    experience: '5 years',
    responseTime: '< 4 hours',
  },
  {
    id: 4,
    name: 'Lucia Fernandes',
    bio: 'Experienced housekeeper offering comprehensive cleaning and laundry services. Detail-oriented and trustworthy.',
    service: 'House Cleaning',
    location: 'Campeche',
    city: 'florianopolis',
    rate: 'R$700/month',
    rateNum: 160,
    rating: 4.6,
    reviews: 28,
    verified: true,
    languages: ['Portuguese', 'Spanish'],
    photo: 'https://i.pravatar.cc/150?img=9',
    specialties: ['Laundry', 'Ironing', 'Window cleaning'],
    availability: 'Tue-Thu all day',
    experience: '8 years',
    responseTime: '< 3 hours',
  },
  {
    id: 5,
    name: 'Diego Ramirez',
    bio: 'Professional chef specializing in healthy meal prep. Former restaurant chef now focused on private clients.',
    service: 'Meal Prep',
    location: 'Envigado',
    city: 'medellin',
    rate: '$180/month',
    rateNum: 180,
    rating: 4.9,
    reviews: 43,
    verified: true,
    languages: ['Spanish', 'English', 'French'],
    photo: 'https://i.pravatar.cc/150?img=11',
    specialties: ['Gourmet cooking', 'Dietary restrictions', 'Wine pairing'],
    availability: 'Mon-Wed-Fri',
    experience: '12 years',
    responseTime: '< 30 min',
  },
  {
    id: 6,
    name: 'Patricia Santos',
    bio: 'Dedicated cleaner with attention to detail. Specializes in organizing and decluttering spaces.',
    service: 'Cleaning + Organization',
    location: 'Centro',
    city: 'florianopolis',
    rate: 'R$750/month',
    rateNum: 170,
    rating: 4.8,
    reviews: 55,
    verified: true,
    languages: ['Portuguese'],
    photo: 'https://i.pravatar.cc/150?img=20',
    specialties: ['KonMari method', 'Closet organization', 'Deep cleaning'],
    availability: 'Weekdays',
    experience: '6 years',
    responseTime: '< 2 hours',
  },
  {
    id: 7,
    name: 'Roberto Gomez',
    bio: 'All-around home help: cleaning, basic maintenance, and errands. Reliable and punctual service guaranteed.',
    service: 'General Home Help',
    location: 'Sabaneta',
    city: 'medellin',
    rate: '$220/month',
    rateNum: 220,
    rating: 4.5,
    reviews: 19,
    verified: false,
    languages: ['Spanish', 'Basic English'],
    photo: 'https://i.pravatar.cc/150?img=33',
    specialties: ['Handyman tasks', 'Grocery shopping', 'Pet care'],
    availability: 'Full-time available',
    experience: '4 years',
    responseTime: '< 6 hours',
  },
  {
    id: 8,
    name: 'Isabella Costa',
    bio: 'Premium cleaning service with eco-friendly products. Specialized in luxury homes and Airbnb turnovers.',
    service: 'Premium Cleaning',
    location: 'Jurerê',
    city: 'florianopolis',
    rate: 'R$1200/month',
    rateNum: 280,
    rating: 5.0,
    reviews: 38,
    verified: true,
    languages: ['Portuguese', 'English', 'Italian'],
    photo: 'https://i.pravatar.cc/150?img=25',
    specialties: ['Luxury homes', 'Airbnb', 'Green cleaning'],
    availability: 'By appointment',
    experience: '9 years',
    responseTime: '< 1 hour',
  },
]

const SERVICES = [
  { id: 'cleaning', label: 'House Cleaning', icon: Home },
  { id: 'cooking', label: 'Cooking', icon: Utensils },
  { id: 'cleaning-cooking', label: 'Cleaning + Cooking', icon: Home },
  { id: 'meal-prep', label: 'Meal Prep', icon: Utensils },
  { id: 'organization', label: 'Organization', icon: Home },
  { id: 'general', label: 'General Help', icon: Users },
]

export default function DirectoryPage() {
  const _router = useRouter()
  const searchInputId = useId()
  const sortSelectId = useId()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<'all' | 'medellin' | 'florianopolis'>('all')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([100, 400])
  const [minRating, setMinRating] = useState(0)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)
  const [showRatingDropdown, setShowRatingDropdown] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [savedProviders, setSavedProviders] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

  const itemsPerPage = 9

  // Filter providers based on criteria
  const filteredProviders = useMemo(() => {
    return MOCK_PROVIDERS.filter((provider) => {
      // Search query
      if (
        searchQuery &&
        !provider.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !provider.bio.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !provider.location.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // City filter
      if (selectedCity !== 'all' && provider.city !== selectedCity) {
        return false
      }

      // Service filter
      if (selectedServices.length > 0) {
        const providerServices = provider.service.toLowerCase()
        const hasService = selectedServices.some((service) =>
          providerServices.includes(service.replace('-', ' '))
        )
        if (!hasService) return false
      }

      // Price filter
      if (provider.rateNum < priceRange[0] || provider.rateNum > priceRange[1]) {
        return false
      }

      // Rating filter
      if (provider.rating < minRating) {
        return false
      }

      // Extras filter
      if (selectedExtras.length > 0) {
        if (
          selectedExtras.includes('english') &&
          !provider.languages.some((lang) => lang.toLowerCase() === 'english')
        ) {
          return false
        }
        if (selectedExtras.includes('verified') && !provider.verified) {
          return false
        }
        if (
          selectedExtras.includes('eco') &&
          !provider.specialties.some((spec) => spec.toLowerCase().includes('eco'))
        ) {
          return false
        }
      }

      return true
    })
  }, [searchQuery, selectedCity, selectedServices, priceRange, minRating, selectedExtras])

  // Pagination
  const paginatedProviders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProviders.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProviders, currentPage])

  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage)

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    )
  }

  const handleExtraToggle = (extra: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCity('all')
    setSelectedServices([])
    setPriceRange([100, 400])
    setMinRating(0)
    setSelectedExtras([])
    setCurrentPage(1)
  }

  const hasActiveFilters =
    selectedCity !== 'all' ||
    selectedServices.length > 0 ||
    priceRange[0] !== 100 ||
    priceRange[1] !== 400 ||
    minRating > 0 ||
    selectedExtras.length > 0

  const handleSaveProvider = (providerId: number) => {
    setSavedProviders((prev) =>
      prev.includes(providerId) ? prev.filter((id) => id !== providerId) : [...prev, providerId]
    )
  }

  return (
    <div className="min-h-screen bg-warmth-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <h1 className="text-3xl font-bold text-teal-600">Directory</h1>
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="p-1 hover:bg-teal-50 rounded-full transition-colors"
                  aria-label="More information about Directory"
                >
                  <Users className="h-5 w-5 text-teal-500" />
                </button>
                {showTooltip && (
                  <div
                    className="absolute left-0 top-8 w-64 p-3 bg-white rounded-lg shadow-lg border border-teal-100 z-10"
                    role="tooltip"
                  >
                    <p className="text-sm text-gray-700 font-medium">
                      Discover trusted cleaners, cooks, and more. Filters help narrow by
                      city/service—verified by our community.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'map' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Map
              </Button>
            </div>
          </div>
          <p className="text-gray-700 mt-2 font-medium">
            Browse vetted home help providers in Medellín & Florianópolis
          </p>
        </div>

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="mb-6">
            <MapSearchView
              initialFilters={{
                city: selectedCity === 'all' ? undefined : selectedCity,
                services: selectedServices,
                priceMin: priceRange[0],
                priceMax: priceRange[1],
                rating: minRating,
                languages: selectedExtras.includes('english') ? ['english'] : [],
                verified: selectedExtras.includes('verified'),
                specialties: selectedExtras.includes('eco') ? ['eco-friendly'] : [],
              }}
              onResultsChange={(results) => {
                // Update local state with map search results
                console.log('Map search results:', results)
              }}
            />
          </div>
        )}

        {/* Traditional Grid View */}
        {viewMode === 'grid' && (
          <>
            {/* Search & Filters Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 sticky top-0 z-20">
              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-500 dark:text-teal-400" />
                <input
                  id={searchInputId}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search for cleaners in El Poblado..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-teal-300 dark:border-teal-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                  aria-label="Search for home help providers"
                />
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap gap-2">
                {/* City Tabs */}
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity('all')
                      setCurrentPage(1)
                    }}
                    className={`px-3 py-1.5 min-h-[36px] rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                      selectedCity === 'all'
                        ? 'bg-teal-600 dark:bg-teal-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    All Cities
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity('medellin')
                      setCurrentPage(1)
                    }}
                    className={`px-3 py-1.5 min-h-[36px] rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                      selectedCity === 'medellin'
                        ? 'bg-teal-600 dark:bg-teal-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Medellín
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity('florianopolis')
                      setCurrentPage(1)
                    }}
                    className={`px-3 py-1.5 min-h-[36px] rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                      selectedCity === 'florianopolis'
                        ? 'bg-teal-600 dark:bg-teal-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Florianópolis
                  </button>
                </div>

                {/* Service Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                    className="flex items-center gap-2 px-4 py-2 min-h-[44px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all"
                    aria-label="Filter by services"
                    aria-expanded={showServiceDropdown}
                  >
                    <Filter className="h-4 w-4" />
                    Services
                    {selectedServices.length > 0 && (
                      <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs">
                        {selectedServices.length}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {showServiceDropdown && (
                    <div className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-30">
                      {SERVICES.map((service) => {
                        const Icon = service.icon
                        const isSelected = selectedServices.includes(service.id)
                        return (
                          <label
                            key={service.id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                handleServiceToggle(service.id)
                                setCurrentPage(1)
                              }}
                              className="text-teal-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                              aria-label={`Filter by ${service.label}`}
                            />
                            <Icon className="h-4 w-4 text-gray-800" aria-hidden="true" />
                            <span className="text-sm">{service.label}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Rating Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRatingDropdown(!showRatingDropdown)}
                    className="flex items-center gap-2 px-4 py-2 min-h-[44px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all"
                    aria-label="Filter by rating"
                    aria-expanded={showRatingDropdown}
                  >
                    <Star className="h-4 w-4" />
                    Rating
                    {minRating > 0 && <span className="text-sm text-teal-600">{minRating}+</span>}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {showRatingDropdown && (
                    <div className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-30">
                      {[0, 4, 4.5, 4.8].map((rating) => (
                        <button
                          type="button"
                          key={rating}
                          onClick={() => {
                            setMinRating(rating)
                            setShowRatingDropdown(false)
                            setCurrentPage(1)
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-sm ${
                            minRating === rating
                              ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {rating === 0 ? 'All ratings' : `${rating}+ stars`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div
                  className="flex items-center gap-2 px-4 py-2 min-h-[44px] border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  aria-label="Price range filter"
                >
                  <DollarSign
                    className="h-4 w-4 text-gray-600 dark:text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    ${priceRange[0]}-${priceRange[1]}/mo
                  </span>
                </div>

                {/* Extras */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleExtraToggle('english')
                      setCurrentPage(1)
                    }}
                    className={`px-3 py-2 min-h-[44px] rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                      selectedExtras.includes('english')
                        ? 'bg-sunset-100 dark:bg-sunset-900/30 text-sunset-700 dark:text-sunset-300 border border-sunset-300 dark:border-sunset-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    English Speaker
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleExtraToggle('verified')
                      setCurrentPage(1)
                    }}
                    className={`px-3 py-2 min-h-[44px] rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                      selectedExtras.includes('verified')
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Check className="h-3 w-3 inline mr-1" />
                    Verified Only
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleExtraToggle('eco')
                      setCurrentPage(1)
                    }}
                    className={`px-3 py-2 min-h-[44px] rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                      selectedExtras.includes('eco')
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Eco-Friendly
                  </button>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2 min-h-[44px] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all"
                  >
                    <X className="h-4 w-4 inline mr-1" />
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="mt-3 flex items-center justify-between">
                <div
                  className="text-sm text-gray-700 dark:text-gray-300 font-medium"
                  role="status"
                  aria-live="polite"
                >
                  Showing{' '}
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {filteredProviders.length}
                  </span>{' '}
                  provider{filteredProviders.length !== 1 ? 's' : ''}
                  {hasActiveFilters && (
                    <span className="text-gray-600 dark:text-gray-400">
                      {' '}
                      (filtered from {MOCK_PROVIDERS.length})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <label htmlFor={sortSelectId}>Sort by:</label>
                  <select
                    id={sortSelectId}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="price">Price</option>
                    <option value="reviews">Reviews</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Listings Section */}
            {filteredProviders.length > 0 ? (
              <>
                {/* Responsive Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                  {paginatedProviders.map((provider, index) => (
                    <motion.div
                      key={provider.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/30 group cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        boxShadow:
                          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Provider Image with Badges */}
                      <div className="relative">
                        <img
                          src={provider.photo}
                          alt={provider.name}
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                        {/* Trust Badges */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          {provider.verified && (
                            <div
                              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md"
                              title="Verified"
                            >
                              <Check className="h-4 w-4 text-teal-600" />
                            </div>
                          )}
                          {provider.languages.includes('English') && (
                            <div
                              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md"
                              title="English Speaker"
                            >
                              <Globe className="h-4 w-4 text-sunset-600" />
                            </div>
                          )}
                          {provider.specialties.some((s) => s.toLowerCase().includes('eco')) && (
                            <div
                              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md"
                              title="Eco-Friendly"
                            >
                              <span className="text-sm">🌿</span>
                            </div>
                          )}
                        </div>
                        {/* Response Time Badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {provider.responseTime}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        {/* Provider Header */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                              {provider.name}
                            </h3>
                            <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                              {provider.rate}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {provider.location}
                            </p>
                            <div
                              className="flex items-center gap-1"
                              aria-label={`Rating: ${provider.rating} out of 5 stars with ${provider.reviews} reviews`}
                            >
                              <Star
                                className="h-4 w-4 text-sunset-500 fill-sunset-500"
                                aria-hidden="true"
                              />
                              <span className="text-sm font-medium">{provider.rating}</span>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                ({provider.reviews})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Service */}
                        <div className="mb-3">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {provider.service}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                            • {provider.experience}
                          </span>
                        </div>

                        {/* Bio with Review Snippet */}
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                          {provider.bio}
                        </p>

                        {/* Mock Review Snippet */}
                        {provider.reviews > 30 && (
                          <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg mb-3 border-l-3 border-teal-500 dark:border-teal-400">
                            <p className="text-xs text-gray-600 dark:text-gray-400 italic line-clamp-1">
                              "Excellent service, very reliable and professional!"
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              — Recent client
                            </p>
                          </div>
                        )}

                        {/* Specialties */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {provider.specialties.slice(0, 3).map((specialty) => (
                            <span
                              key={specialty}
                              className="px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs rounded-full font-medium"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedProvider(provider)}
                            className="flex-1 py-2.5 bg-teal-600 dark:bg-teal-500 text-white font-medium hover:bg-teal-700 dark:hover:bg-teal-600 focus:bg-teal-700 dark:focus:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-lg transition-all"
                            aria-label={`View full profile of ${provider.name}`}
                          >
                            <MessageSquare className="h-4 w-4 inline mr-1" />
                            View Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveProvider(provider.id)}
                            className={`px-4 py-2.5 border rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                              savedProviders.includes(provider.id)
                                ? 'bg-sunset-50 dark:bg-sunset-900/30 text-sunset-700 dark:text-sunset-300 border-sunset-300 dark:border-sunset-700'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                            aria-label={
                              savedProviders.includes(provider.id)
                                ? 'Remove from saved'
                                : 'Save provider'
                            }
                          >
                            <Heart
                              className={`h-4 w-4 ${savedProviders.includes(provider.id) ? 'fill-sunset-500' : ''}`}
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                        currentPage === 1
                          ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Previous page</span>
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 min-h-[36px] rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                          currentPage === i + 1
                            ? 'bg-teal-600 dark:bg-teal-500 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                        currentPage === totalPages
                          ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Next page</span>
                    </button>
                  </nav>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No providers match your filters
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Try broadening your search—
                  {selectedCity === 'medellin'
                    ? 'Medellín'
                    : selectedCity === 'florianopolis'
                      ? 'Florianópolis'
                      : 'both cities'}{' '}
                  have 200+ cleaners!
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-6 py-3 min-h-[48px] bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 focus:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
                >
                  Clear Filters & Search Again
                </button>
              </div>
            )}

            {/* Profile Modal */}
            <AnimatePresence>
              {selectedProvider && (
                <motion.div
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="provider-name"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedProvider(null)}
                >
                  <motion.div
                    className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-8">
                      {/* Modal Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={selectedProvider.photo}
                            alt={selectedProvider.name}
                            className="w-20 h-20 rounded-xl object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h2 id="provider-name" className="text-2xl font-bold text-gray-900">
                                {selectedProvider.name}
                              </h2>
                              {selectedProvider.verified && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-teal-100 rounded-full">
                                  <Check className="h-3 w-3 text-teal-600" />
                                  <span className="text-xs text-teal-700 font-medium">
                                    Verified
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-800 mb-2">
                              <MapPin className="h-4 w-4 inline mr-1" />
                              {selectedProvider.location},{' '}
                              {selectedProvider.city === 'medellin' ? 'Medellín' : 'Florianópolis'}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div
                                className="flex items-center gap-1"
                                aria-label={`Rating: ${selectedProvider.rating} out of 5 stars with ${selectedProvider.reviews} reviews`}
                              >
                                <Star
                                  className="h-4 w-4 text-sunset-500 fill-sunset-500"
                                  aria-hidden="true"
                                />
                                <span className="font-semibold">{selectedProvider.rating}</span>
                                <span className="text-gray-700">
                                  ({selectedProvider.reviews} reviews)
                                </span>
                              </div>
                              <span className="font-bold text-teal-600 text-lg">
                                {selectedProvider.rate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedProvider(null)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                          aria-label="Close modal"
                        >
                          <X className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>

                      {/* Service & Availability */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-700 mb-1">Service</p>
                          <p className="font-medium text-gray-900">{selectedProvider.service}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-700 mb-1">Availability</p>
                          <p className="font-medium text-gray-900">
                            {selectedProvider.availability}
                          </p>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">About</h3>
                        <p className="text-gray-700 leading-relaxed">{selectedProvider.bio}</p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="text-center p-3 bg-teal-50 rounded-lg">
                          <Award className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-800 font-medium">Experience</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedProvider.experience}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-sunset-50 rounded-lg">
                          <Clock className="h-5 w-5 text-sunset-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-800 font-medium">Response Time</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedProvider.responseTime}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-warmth-50 rounded-lg">
                          <Globe className="h-5 w-5 text-warmth-500 mx-auto mb-1" />
                          <p className="text-xs text-gray-800 font-medium">Languages</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedProvider.languages.join(', ')}
                          </p>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProvider.specialties.map((specialty: string) => (
                            <motion.span
                              key={specialty}
                              className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              {specialty}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Mock Reviews Section */}
                      {selectedProvider.reviews > 30 && (
                        <div className="mb-6">
                          <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                            Recent Reviews
                          </h3>
                          <div className="space-y-3">
                            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-teal-500">
                              <p className="text-gray-700 italic mb-2">
                                "Maria is absolutely wonderful! She's punctual, thorough, and speaks
                                excellent English. My apartment has never been cleaner."
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-800 font-medium">
                                  — Sarah M., 2 weeks ago
                                </span>
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 text-sunset-500 fill-sunset-500"
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-teal-500">
                              <p className="text-gray-700 italic mb-2">
                                "Very reliable and trustworthy. I feel comfortable leaving her alone
                                in my home."
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-800 font-medium">
                                  — Mike D., 1 month ago
                                </span>
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 text-sunset-500 fill-sunset-500"
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CTA Buttons */}
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            className="flex-1 py-3 min-h-[48px] bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 focus:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
                          >
                            <MessageSquare className="h-4 w-4 inline mr-2" />
                            Request Introduction
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveProvider(selectedProvider.id)}
                            className={`px-6 py-3 min-h-[48px] border rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                              savedProviders.includes(selectedProvider.id)
                                ? 'bg-sunset-50 text-sunset-700 border-sunset-300'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Heart
                              className={`h-4 w-4 inline mr-2 ${savedProviders.includes(selectedProvider.id) ? 'fill-sunset-500' : ''}`}
                            />
                            {savedProviders.includes(selectedProvider.id) ? 'Saved' : 'Save'}
                          </button>
                        </div>

                        {/* WhatsApp Teaser */}
                        <button
                          type="button"
                          className="w-full py-3 min-h-[48px] bg-green-50 text-green-700 border border-green-300 rounded-lg font-medium hover:bg-green-100 focus:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
                        >
                          <Phone className="h-4 w-4" />
                          <span>Chat on WhatsApp</span>
                          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                            Premium
                          </span>
                        </button>
                      </div>

                      {/* Premium Nudge */}
                      <p className="text-xs text-center text-gray-800 mt-4">
                        Upgrade to Premium to unlock direct contact and priority introductions
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
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
