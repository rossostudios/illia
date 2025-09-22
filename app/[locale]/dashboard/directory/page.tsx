// Changelog: Created Directory page—searchable filters, responsive table/grid, profile modals; integrated Supabase query stub.

'use client'

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
  Search,
  Star,
  Users,
  Utensils,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const itemsPerPage = 6

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

  // Detect screen size for responsive view
  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth >= 1024 ? 'table' : 'grid')
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-warmth-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-6">
          <div className="flex items-start gap-2">
            <h1 className="text-3xl font-bold text-teal-600">Directory</h1>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="p-1 hover:bg-teal-50 rounded-full transition-colors"
              >
                <Users className="h-5 w-5 text-teal-500" />
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-8 w-64 p-3 bg-white rounded-lg shadow-lg border border-teal-100 z-10">
                  <p className="text-sm text-gray-600">
                    Discover trusted cleaners, cooks, and more. Filters help narrow by
                    city/service—verified by our community.
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Browse vetted home help providers in Medellín & Florianópolis
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 sticky top-0 z-20">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search for cleaners in El Poblado..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-2">
            {/* City Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setSelectedCity('all')
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedCity === 'all'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Cities
              </button>
              <button
                onClick={() => {
                  setSelectedCity('medellin')
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedCity === 'medellin'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Medellín
              </button>
              <button
                onClick={() => {
                  setSelectedCity('florianopolis')
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedCity === 'florianopolis'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Florianópolis
              </button>
            </div>

            {/* Service Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Services
                {selectedServices.length > 0 && (
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs">
                    {selectedServices.length}
                  </span>
                )}
                <ChevronDown className="h-4 w-4" />
              </button>
              {showServiceDropdown && (
                <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg border p-3 z-30">
                  {SERVICES.map((service) => {
                    const Icon = service.icon
                    const isSelected = selectedServices.includes(service.id)
                    return (
                      <label
                        key={service.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            handleServiceToggle(service.id)
                            setCurrentPage(1)
                          }}
                          className="text-teal-600"
                        />
                        <Icon className="h-4 w-4 text-gray-500" />
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
                onClick={() => setShowRatingDropdown(!showRatingDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Star className="h-4 w-4" />
                Rating
                {minRating > 0 && <span className="text-sm text-teal-600">{minRating}+</span>}
                <ChevronDown className="h-4 w-4" />
              </button>
              {showRatingDropdown && (
                <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border p-3 z-30">
                  {[0, 4, 4.5, 4.8].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        setMinRating(rating)
                        setShowRatingDropdown(false)
                        setCurrentPage(1)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm ${
                        minRating === rating ? 'bg-teal-50 text-teal-700' : ''
                      }`}
                    >
                      {rating === 0 ? 'All ratings' : `${rating}+ stars`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                ${priceRange[0]}-${priceRange[1]}/mo
              </span>
            </div>

            {/* Extras */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleExtraToggle('english')
                  setCurrentPage(1)
                }}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedExtras.includes('english')
                    ? 'bg-sunset-100 text-sunset-700 border border-sunset-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                English Speaker
              </button>
              <button
                onClick={() => {
                  handleExtraToggle('verified')
                  setCurrentPage(1)
                }}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedExtras.includes('verified')
                    ? 'bg-teal-100 text-teal-700 border border-teal-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Check className="h-3 w-3 inline mr-1" />
                Verified Only
              </button>
              <button
                onClick={() => {
                  handleExtraToggle('eco')
                  setCurrentPage(1)
                }}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedExtras.includes('eco')
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Eco-Friendly
              </button>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4 inline mr-1" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Listings Section */}
        {filteredProviders.length > 0 ? (
          <>
            {/* Grid View (Mobile/Tablet) */}
            {viewMode === 'grid' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {paginatedProviders.map((provider, index) => (
                  <div
                    key={provider.id}
                    className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Provider Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={provider.photo}
                        alt={provider.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                          {provider.verified && <Check className="h-4 w-4 text-teal-600" />}
                        </div>
                        <p className="text-sm text-gray-600">{provider.location}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-sunset-500 fill-sunset-500" />
                          <span className="text-xs font-medium">{provider.rating}</span>
                          <span className="text-xs text-gray-500">({provider.reviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{provider.bio}</p>

                    {/* Service & Rate */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">{provider.service}</span>
                      <span className="text-sm font-bold text-teal-600">{provider.rate}</span>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {provider.specialties.slice(0, 2).map((specialty) => (
                        <span
                          key={specialty}
                          className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                      {provider.languages.includes('English') && (
                        <span className="px-2 py-0.5 bg-sunset-50 text-sunset-700 text-xs rounded-full">
                          English
                        </span>
                      )}
                    </div>

                    {/* View Profile Button */}
                    <button
                      onClick={() => setSelectedProvider(provider)}
                      className="w-full py-2 text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      View Profile →
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Table View (Desktop) */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedProviders.map((provider) => (
                      <tr key={provider.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={provider.photo}
                              alt={provider.name}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-gray-900">
                                  {provider.name}
                                </div>
                                {provider.verified && <Check className="h-4 w-4 text-teal-600" />}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {provider.bio}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{provider.service}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{provider.location}</div>
                          <div className="text-xs text-gray-500">
                            {provider.city === 'medellin' ? 'Medellín' : 'Florianópolis'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-teal-600">
                            {provider.rate}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-sunset-500 fill-sunset-500" />
                            <span className="text-sm font-medium">{provider.rating}</span>
                            <span className="text-sm text-gray-500">({provider.reviews})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedProvider(provider)}
                            className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                          >
                            View Profile →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === i + 1
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No providers match your filters
            </h3>
            <p className="text-gray-600 mb-6">
              Try broadening your search—
              {selectedCity === 'medellin'
                ? 'Medellín'
                : selectedCity === 'florianopolis'
                  ? 'Florianópolis'
                  : 'both cities'}{' '}
              have 200+ cleaners!
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Clear Filters & Search Again
            </button>
          </div>
        )}

        {/* Profile Modal */}
        {selectedProvider && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
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
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedProvider.name}
                        </h2>
                        {selectedProvider.verified && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-teal-100 rounded-full">
                            <Check className="h-3 w-3 text-teal-600" />
                            <span className="text-xs text-teal-700 font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {selectedProvider.location},{' '}
                        {selectedProvider.city === 'medellin' ? 'Medellín' : 'Florianópolis'}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-sunset-500 fill-sunset-500" />
                          <span className="font-semibold">{selectedProvider.rating}</span>
                          <span className="text-gray-500">
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
                    onClick={() => setSelectedProvider(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Service & Availability */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Service</p>
                    <p className="font-medium text-gray-900">{selectedProvider.service}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Availability</p>
                    <p className="font-medium text-gray-900">{selectedProvider.availability}</p>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600">{selectedProvider.bio}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 bg-teal-50 rounded-lg">
                    <Award className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedProvider.experience}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-sunset-50 rounded-lg">
                    <Clock className="h-5 w-5 text-sunset-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Response Time</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedProvider.responseTime}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-warmth-50 rounded-lg">
                    <Globe className="h-5 w-5 text-warmth-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Languages</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedProvider.languages.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.specialties.map((specialty: string) => (
                      <span
                        key={specialty}
                        className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
                    <MessageSquare className="h-4 w-4 inline mr-2" />
                    Request Introduction
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    <Heart className="h-4 w-4 inline mr-2" />
                    Save
                  </button>
                </div>

                {/* Premium Nudge */}
                <p className="text-xs text-center text-gray-500 mt-4">
                  Upgrade to Premium to unlock direct contact and priority introductions
                </p>
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
