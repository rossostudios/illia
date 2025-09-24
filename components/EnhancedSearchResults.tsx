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

export type SearchResult = {
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

export type SortOption = {
  key: string
  label: string
  direction: 'asc' | 'desc'
  icon: React.ReactNode
}

type ProviderLocation = {
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

type EnhancedSearchResultsProps = {
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
      }
      return bValue - aValue
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
    <div className={`rounded-xl bg-white shadow-md dark:bg-gray-900 ${className}`}>
      {/* Header with controls */}
      <div className="border-gray-200 border-b p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
              Results ({processedResults.length})
            </h3>
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                Searching...
              </div>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-600">
              <Button
                className={`rounded-l-lg p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </button>
              <Button
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <Button
                className={`rounded-r-lg p-2 transition-colors ${
                  viewMode === 'compact'
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setViewMode('compact')}
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
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-gray-900 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              onChange={(e) => {
                const [key, direction] = e.target.value.split('-') as [string, 'asc' | 'desc']
                const option = SORT_OPTIONS.find((opt) => opt.key === key)
                if (option) {
                  setSortBy({ ...option, direction })
                }
              }}
              value={`${sortBy.key}-${sortBy.direction}`}
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
            <ArrowUpDown className="pointer-events-none absolute top-2.5 right-2 h-4 w-4 text-gray-400" />
          </div>

          {/* Filters toggle */}
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            variant="outline"
          >
            <Filter className="h-4 w-4" />
            Filters
            {(priceRange[0] > 0 || priceRange[1] < 1000 || minRating > 0) && (
              <span className="h-2 w-2 rounded-full bg-teal-500" />
            )}
          </Button>

          {/* Comparison mode toggle */}
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              setComparisonMode(!comparisonMode)
              if (!comparisonMode) {
                setSelectedForComparison(new Set())
              }
            }}
            size="sm"
            variant={comparisonMode ? 'primary' : 'outline'}
          >
            <Eye className="h-4 w-4" />
            Compare ({selectedForComparison.size})
          </Button>

          {/* Export button */}
          <div className="group relative">
            <Button className="flex items-center gap-2" size="sm" variant="outline">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <div className="pointer-events-none absolute top-full right-0 z-10 mt-1 rounded-lg border border-gray-200 bg-white opacity-0 shadow-lg transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-900">
              <div className="py-1">
                <Button
                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => exportResults('csv')}
                >
                  Export as CSV
                </button>
                <Button
                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => exportResults('json')}
                >
                  Export as JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <input
                  className="w-full"
                  max="1000"
                  min="0"
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number.parseInt(e.target.value, 10)])
                  }
                  step="50"
                  type="range"
                  value={priceRange[1]}
                />
              </div>
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Minimum Rating: {minRating} stars
                </label>
                <input
                  className="w-full"
                  max="5"
                  min="0"
                  onChange={(e) => setMinRating(Number.parseFloat(e.target.value))}
                  step="0.5"
                  type="range"
                  value={minRating}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison mode header */}
      {comparisonMode && selectedForComparison.size > 0 && (
        <div className="border-teal-200 border-b bg-teal-50 px-6 py-3 dark:border-teal-800 dark:bg-teal-900/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-teal-700 dark:text-teal-300">
              Comparing {selectedForComparison.size} providers
            </span>
            <Button onClick={() => setSelectedForComparison(new Set())} size="sm" variant="outline">
              <X className="mr-1 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="p-6">
        {processedResults.length === 0 && !loading ? (
          <div className="py-12 text-center">
            <MapPin className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
            <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
              No providers found
            </h3>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search location
            </p>
            <Button
              onClick={() => {
                setPriceRange([0, 1000])
                setMinRating(0)
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div
            className={`space-y-4 ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
                : viewMode === 'compact'
                  ? 'space-y-2'
                  : ''
            }`}
          >
            {processedResults.slice(0, comparisonMode ? 50 : 20).map((result) => (
              <ResultCard
                comparisonMode={comparisonMode}
                isSelectedForComparison={selectedForComparison.has(result.id)}
                key={result.id}
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
                result={result}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {processedResults.length > (comparisonMode ? 50 : 20) && (
          <div className="mt-6 text-center">
            <Button variant="outline">
              Load More Results ({processedResults.length - (comparisonMode ? 50 : 20)} remaining)
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

type ResultCardProps = {
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
      <div
        className={`${baseClasses} flex items-center justify-between p-3`}
        onClick={onClick}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-3">
          <img
            alt={result.name}
            className="h-10 w-10 rounded-full object-cover"
            src={result.photo_url}
          />
          <div>
            <h4 className="font-medium text-gray-900 text-sm dark:text-white">{result.name}</h4>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <span>⭐ {result.rating}</span>
              <span>${result.rate_monthly}/mo</span>
              <span>{result.neighborhood || result.city}</span>
            </div>
          </div>
        </div>

        {comparisonMode && (
          <button className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
              isSelectedForComparison
                ? 'border-teal-500 bg-teal-500 text-white'
                : 'border-gray-300 hover:border-teal-400'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onComparisonToggle()
            }}
            type="button"
          >
            {isSelectedForComparison && <Check className="h-3 w-3" />}
          </button>
        )}
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className={`${baseClasses} p-4`} onClick={onClick} role="button" tabIndex={0}>
        <div className="mb-3 flex items-start gap-3">
          <img
            alt={result.name}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
            src={result.photo_url}
          />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-start justify-between">
              <h4 className="truncate font-medium text-gray-900 dark:text-white">{result.name}</h4>
              {comparisonMode && (
                <button className={`ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    isSelectedForComparison
                      ? 'border-teal-500 bg-teal-500 text-white'
                      : 'border-gray-300 hover:border-teal-400'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onComparisonToggle()
                  }}
                  type="button"
                >
                  {isSelectedForComparison && <Check className="h-3 w-3" />}
                </button>
              )}
            </div>

            {result.verified && (
              <span className="mb-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-700 text-xs dark:bg-green-900 dark:text-green-300">
                Verified
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-gray-600 text-sm dark:text-gray-400">
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
                className="rounded bg-teal-100 px-2 py-0.5 text-teal-700 text-xs dark:bg-teal-900 dark:text-teal-300"
                key={service}
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
    <div className={`${baseClasses} p-4`} onClick={onClick} role="button" tabIndex={0}>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex flex-1 items-start gap-3">
          <img
            alt={result.name}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
            src={result.photo_url}
          />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-start justify-between">
              <h4 className="truncate font-medium text-gray-900 dark:text-white">{result.name}</h4>
              {comparisonMode && (
                <button className={`ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    isSelectedForComparison
                      ? 'border-teal-500 bg-teal-500 text-white'
                      : 'border-gray-300 hover:border-teal-400'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onComparisonToggle()
                  }}
                  type="button"
                >
                  {isSelectedForComparison && <Check className="h-3 w-3" />}
                </button>
              )}
            </div>

            {result.bio && (
              <p className="mb-2 line-clamp-2 text-gray-600 text-sm dark:text-gray-400">
                {result.bio}
              </p>
            )}

            <div className="flex items-center gap-4 text-gray-600 text-sm dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{result.neighborhood || result.city}</span>
              </div>
              {result.experience && <span>{result.experience}</span>}
            </div>
          </div>
        </div>

        {result.verified && (
          <span className="ml-2 flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-green-700 text-xs dark:bg-green-900 dark:text-green-300">
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
          <div className="font-medium text-lg text-teal-600">
            ${result.rate_monthly}
            <span className="text-gray-500 text-sm">/mo</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {result.services?.slice(0, 3).map((service) => (
          <span
            className="rounded bg-teal-100 px-2 py-0.5 text-teal-700 text-xs dark:bg-teal-900 dark:text-teal-300"
            key={service}
          >
            {service}
          </span>
        ))}
        {result.specialties?.length > 0 && (
          <span className="rounded bg-purple-100 px-2 py-0.5 text-purple-700 text-xs dark:bg-purple-900 dark:text-purple-300">
            +{result.specialties.length} specialties
          </span>
        )}
      </div>
    </div>
  )
})
