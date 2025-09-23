'use client'

import {
  ArrowUpDown,
  Check,
  Download,
  Eye,
  Filter,
  Grid3X3,
  List,
  MapPin,
  SlidersHorizontal,
  SortAsc,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'

export interface SearchResult {
  id: string
  name: string
  bio: string
  photo_url: string
  city: string
  neighborhood: string
  latitude: number
  longitude: number
  address: string
  services: string[]
  languages: string[]
  rate_monthly: number
  rate_hourly: number
  rating: number
  review_count: number
  verified: boolean
  specialties: string[]
  availability: string
  availability_schedule: Record<string, string[]>
  distance?: number
  relevance_score?: number
}

export interface SortOption {
  key: string
  label: string
  direction: 'asc' | 'desc'
  icon: React.ReactNode
}

interface ProviderLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  address: string
  services: string[]
  rating: number
  price: number
  verified: boolean
  specialties: string[]
}

interface EnhancedSearchResultsProps {
  results: SearchResult[]
  loading?: boolean
  onProviderClick: (provider: ProviderLocation) => void
  className?: string
}

const SORT_OPTIONS: SortOption[] = [
  { key: 'relevance', label: 'Relevance', direction: 'desc', icon: <Zap className="h-4 w-4" /> },
  { key: 'rating', label: 'Rating', direction: 'desc', icon: <Star className="h-4 w-4" /> },
  { key: 'price', label: 'Price', direction: 'asc', icon: <SortAsc className="h-4 w-4" /> },
  { key: 'distance', label: 'Distance', direction: 'asc', icon: <MapPin className="h-4 w-4" /> },
  {
    key: 'reviews',
    label: 'Most Reviewed',
    direction: 'desc',
    icon: <Users className="h-4 w-4" />,
  },
  {
    key: 'experience',
    label: 'Experience',
    direction: 'desc',
    icon: <Check className="h-4 w-4" />,
  },
]

export function EnhancedSearchResults({
  results,
  loading = false,
  onProviderClick,
  className = '',
}: EnhancedSearchResultsProps) {
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0])
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'compact'>('list')
  const [comparisonMode, setComparisonMode] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [minRating, setMinRating] = useState(0)

  // Sort and filter results
  const processedResults = useMemo(() => {
    const filtered = results.filter((result) => {
      const price = result.rate_monthly
      return price >= priceRange[0] && price <= priceRange[1] && result.rating >= minRating
    })

    // Sort results
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy.key) {
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'price':
          aValue = a.rate_monthly
          bValue = b.rate_monthly
          break
        case 'reviews':
          aValue = a.review_count
          bValue = b.review_count
          break
        case 'experience':
          // Simple heuristic based on bio length and verified status
          aValue = (a.bio?.length || 0) + (a.verified ? 100 : 0)
          bValue = (b.bio?.length || 0) + (b.verified ? 100 : 0)
          break
        case 'distance':
          aValue = a.distance || 0
          bValue = b.distance || 0
          break
        default:
          aValue = a.rating // Default to relevance
          bValue = b.rating
      }

      if (sortBy.direction === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

    return filtered
  }, [results, sortBy, priceRange, minRating])

  const handleComparisonToggle = useCallback((providerId: string) => {
    setSelectedForComparison((prev) => {
      const newSelected = new Set(prev)
      if (newSelected.has(providerId)) {
        newSelected.delete(providerId)
      } else if (newSelected.size < 3) {
        // Limit to 3 for comparison
        newSelected.add(providerId)
      }
      return newSelected
    })
  }, [])

  const exportResults = useCallback(
    (format: 'csv' | 'json') => {
      const dataToExport = processedResults.map((result) => ({
        name: result.name,
        services: result.services.join(', '),
        location: `${result.neighborhood}, ${result.city}`,
        rating: result.rating,
        reviews: result.review_count,
        price: result.rate_monthly,
        verified: result.verified,
        specialties: result.specialties.join(', '),
      }))

      if (format === 'csv') {
        const csv = [
          Object.keys(dataToExport[0]).join(','),
          ...dataToExport.map((row) => Object.values(row).join(',')),
        ].join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'search-results.csv'
        a.click()
        URL.revokeObjectURL(url)
      } else {
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'search-results.json'
        a.click()
        URL.revokeObjectURL(url)
      }
    },
    [processedResults]
  )

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md ${className}`}>
      {/* Header with controls */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Results ({processedResults.length})
            </h3>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'compact'
                    ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={`${sortBy.key}-${sortBy.direction}`}
              onChange={(e) => {
                const [key, direction] = e.target.value.split('-') as [string, 'asc' | 'desc']
                const option = SORT_OPTIONS.find((opt) => opt.key === key)
                if (option) setSortBy({ ...option, direction })
              }}
              className="px-3 py-2 pr-8 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={`${option.key}-asc`} value={`${option.key}-asc`}>
                  {option.label} ↑
                </option>
              ))}
              {SORT_OPTIONS.map((option) => (
                <option key={`${option.key}-desc`} value={`${option.key}-desc`}>
                  {option.label} ↓
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Filters toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {(priceRange[0] > 0 || priceRange[1] < 1000 || minRating > 0) && (
              <span className="w-2 h-2 bg-teal-500 rounded-full" />
            )}
          </Button>

          {/* Comparison mode toggle */}
          <Button
            variant={comparisonMode ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setComparisonMode(!comparisonMode)
              if (!comparisonMode) setSelectedForComparison(new Set())
            }}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Compare ({selectedForComparison.size})
          </Button>

          {/* Export button */}
          <div className="relative group">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <div className="absolute top-full mt-1 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-10">
              <div className="py-1">
                <button
                  onClick={() => exportResults('csv')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => exportResults('json')}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Export as JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value, 10)])}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Rating: {minRating} stars
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison mode header */}
      {comparisonMode && selectedForComparison.size > 0 && (
        <div className="px-6 py-3 bg-teal-50 dark:bg-teal-900/20 border-b border-teal-200 dark:border-teal-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-teal-700 dark:text-teal-300">
              Comparing {selectedForComparison.size} providers
            </span>
            <Button variant="outline" size="sm" onClick={() => setSelectedForComparison(new Set())}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="p-6">
        {processedResults.length === 0 && !loading ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No providers found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your filters or search location
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setPriceRange([0, 1000])
                setMinRating(0)
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div
            className={`space-y-4 ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : viewMode === 'compact'
                  ? 'space-y-2'
                  : ''
            }`}
          >
            {processedResults.slice(0, comparisonMode ? 50 : 20).map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                viewMode={viewMode}
                comparisonMode={comparisonMode}
                isSelectedForComparison={selectedForComparison.has(result.id)}
                onClick={() =>
                  onProviderClick({
                    id: result.id,
                    name: result.name,
                    latitude: result.latitude,
                    longitude: result.longitude,
                    address: result.address,
                    services: result.services,
                    rating: result.rating,
                    price: result.rate_monthly,
                    verified: result.verified,
                    specialties: result.specialties,
                  })
                }
                onComparisonToggle={() => handleComparisonToggle(result.id)}
              />
            ))}
          </div>
        )}

        {processedResults.length > (comparisonMode ? 50 : 20) && (
          <div className="text-center mt-6">
            <Button variant="outline">
              Load More Results ({processedResults.length - (comparisonMode ? 50 : 20)} remaining)
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

interface ResultCardProps {
  result: SearchResult
  viewMode: 'list' | 'grid' | 'compact'
  comparisonMode: boolean
  isSelectedForComparison: boolean
  onClick: () => void
  onComparisonToggle: () => void
}

const ResultCard = memo(function ResultCard({
  result,
  viewMode,
  comparisonMode,
  isSelectedForComparison,
  onClick,
  onComparisonToggle,
}: ResultCardProps) {
  const baseClasses = `
    border border-gray-200 dark:border-gray-700 rounded-lg transition-all cursor-pointer
    hover:shadow-md hover:border-teal-300 dark:hover:border-teal-600
    ${isSelectedForComparison ? 'ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900/20' : ''}
  `

  if (viewMode === 'compact') {
    return (
      <div className={`${baseClasses} flex items-center justify-between p-3`} onClick={onClick}>
        <div className="flex items-center gap-3">
          <img
            src={result.photo_url}
            alt={result.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">{result.name}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>⭐ {result.rating}</span>
              <span>${result.rate_monthly}/mo</span>
              <span>{result.neighborhood || result.city}</span>
            </div>
          </div>
        </div>

        {comparisonMode && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onComparisonToggle()
            }}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              isSelectedForComparison
                ? 'bg-teal-500 border-teal-500 text-white'
                : 'border-gray-300 hover:border-teal-400'
            }`}
          >
            {isSelectedForComparison && <Check className="h-3 w-3" />}
          </button>
        )}
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className={`${baseClasses} p-4`} onClick={onClick}>
        <div className="flex items-start gap-3 mb-3">
          <img
            src={result.photo_url}
            alt={result.name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-gray-900 dark:text-white truncate">{result.name}</h4>
              {comparisonMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onComparisonToggle()
                  }}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-2 ${
                    isSelectedForComparison
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : 'border-gray-300 hover:border-teal-400'
                  }`}
                >
                  {isSelectedForComparison && <Check className="h-3 w-3" />}
                </button>
              )}
            </div>

            {result.verified && (
              <span className="inline-flex items-center px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full mb-2">
                Verified
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{result.neighborhood || result.city}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              {result.rating} ({result.review_count})
            </span>
            <span className="font-medium text-teal-600">${result.rate_monthly}/mo</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {result.services?.slice(0, 2).map((service) => (
              <span
                key={service}
                className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs rounded"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // List view (default)
  return (
    <div className={`${baseClasses} p-4`} onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <img
            src={result.photo_url}
            alt={result.name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-gray-900 dark:text-white truncate">{result.name}</h4>
              {comparisonMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onComparisonToggle()
                  }}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-2 ${
                    isSelectedForComparison
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : 'border-gray-300 hover:border-teal-400'
                  }`}
                >
                  {isSelectedForComparison && <Check className="h-3 w-3" />}
                </button>
              )}
            </div>

            {result.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {result.bio}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{result.neighborhood || result.city}</span>
              </div>
              {result.experience && <span>{result.experience}</span>}
            </div>
          </div>
        </div>

        {result.verified && (
          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full flex-shrink-0 ml-2">
            Verified
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            {result.rating} ({result.review_count} reviews)
          </span>
        </div>

        <div className="text-right">
          <div className="font-medium text-teal-600 text-lg">
            ${result.rate_monthly}
            <span className="text-sm text-gray-500">/mo</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        {result.services?.slice(0, 3).map((service) => (
          <span
            key={service}
            className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs rounded"
          >
            {service}
          </span>
        ))}
        {result.specialties?.length > 0 && (
          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded">
            +{result.specialties.length} specialties
          </span>
        )}
      </div>
    </div>
  )
})
