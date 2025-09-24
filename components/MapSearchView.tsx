'use client'

import { Bookmark, Filter, List, Map, MapPin, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AISearchInput } from '@/components/AISearchInput'
import { EnhancedSearchResults } from '@/components/EnhancedSearchResults'
import { LocationAutocomplete } from '@/components/LocationAutocomplete'
import { MapView, type ProviderLocation } from '@/components/MapView'
import { SavedSearchesPanel } from '@/components/SavedSearchesPanel'
import { Button } from '@/components/ui/Button'
import { type FilterOptions, FilterPanel } from '@/components/ui/FilterPanel'
import { VoiceSearchButton } from '@/components/VoiceSearchButton'
import { useAdvancedSearch } from '@/hooks/use-advanced-search'
import { useSearchSuggestions } from '@/hooks/use-search-suggestions'

type MapSearchViewProps = {
  initialFilters?: Partial<FilterOptions>
  onResultsChange?: (results: any[]) => void
  className?: string
}

export function MapSearchView({
  initialFilters = {},
  onResultsChange,
  className = '',
}: MapSearchViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [showFilters, setShowFilters] = useState(false)
  const [showSavedSearches, setShowSavedSearches] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number
    longitude: number
    address: string
    city?: string
  } | null>(null)

  // Search hooks
  const { filters, results, loading, updateFilters, clearFilters } = useAdvancedSearch({
    enableAnalytics: true,
    debounceMs: 500,
  })

  const { query, setQuery, suggestions, aiSuggestion } = useSearchSuggestions({
    enableAI: true,
    maxSuggestions: 8,
  })

  // Convert search results to provider locations for map
  const providerLocations: ProviderLocation[] = useMemo(
    () =>
      results
        .map((result) => ({
          id: result.id,
          name: result.name,
          latitude: result.latitude || 0,
          longitude: result.longitude || 0,
          address: result.address || '',
          services: result.services || [],
          rating: result.rating || 0,
          price: result.rate_monthly || 0,
          verified: result.verified,
          specialties: result.specialties || [],
        }))
        .filter((provider) => provider.latitude && provider.longitude),
    [results]
  )

  // Handle location selection from autocomplete
  const handleLocationSelect = useCallback(
    (location: { latitude: number; longitude: number; address: string; city?: string }) => {
      setSelectedLocation(location)
      updateFilters({
        location: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      })
    },
    [updateFilters]
  )

  // Handle provider click on map
  const handleProviderClick = useCallback((_provider: ProviderLocation) => {}, [])

  // Handle map location change
  const handleMapLocationChange = useCallback(
    (location: [number, number], _zoom: number) => {
      // Update search filters based on map movement
      updateFilters({
        latitude: location[0],
        longitude: location[1],
        // Could also update radius based on zoom level
      })
    },
    [updateFilters]
  )

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: FilterOptions) => {
      updateFilters(newFilters)
    },
    [updateFilters]
  )

  // Handle loading saved search
  const handleLoadSavedSearch = useCallback(
    (savedFilters: Record<string, any>) => {
      updateFilters(savedFilters)
      setShowSavedSearches(false)
    },
    [updateFilters]
  )

  // Update parent component with results
  useEffect(() => {
    onResultsChange?.(results)
  }, [results, onResultsChange])

  // Get map center based on selected location or default
  const mapCenter = useMemo((): [number, number] => {
    if (selectedLocation) {
      return [selectedLocation.latitude, selectedLocation.longitude]
    }
    // Default centers based on major cities
    if (filters.city === 'medellin') {
      return [6.2442, -75.5812] // Medellín center
    }
    if (filters.city === 'florianopolis') {
      return [-27.5954, -48.548] // Florianópolis center
    }
    return [-27.5954, -48.548] // Default to Florianópolis
  }, [selectedLocation, filters.city])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
        {/* AI-Powered Search */}
        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
            🔍 Smart Search
          </label>
          <div className="relative">
            <AISearchInput
              className="w-full"
              onChange={(value) => updateFilters({ query: value })}
              onSubmit={(query, aiSuggestion) => {
                updateFilters({ query })
                if (aiSuggestion?.suggestedFilters) {
                  updateFilters(aiSuggestion.suggestedFilters)
                }
              }}
              placeholder="Describe what you're looking for (e.g., 'English speaking cleaner in Medellín')"
              value={filters.query || ''}
            />
            <div className="absolute top-3 right-3 z-10">
              <VoiceSearchButton
                language="en-US"
                onResult={(_transcript, processedQuery) => {
                  updateFilters({ query: processedQuery })
                }}
                showTranscript={true}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Location Search */}
        <div className="mb-4">
          <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
            <MapPin className="mr-1 inline h-4 w-4" />
            Specific Location (Optional)
          </label>
          <LocationAutocomplete
            className="w-full"
            onChange={(value) => updateFilters({ location: value })}
            onLocationSelect={handleLocationSelect}
            placeholder="Enter city, address, or location..."
            value={filters.location || ''}
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              className="flex items-center gap-2"
              onClick={() => setViewMode('list')}
              size="sm"
              variant={viewMode === 'list' ? 'primary' : 'outline'}
            >
              <List className="h-4 w-4" />
              List
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={() => setViewMode('map')}
              size="sm"
              variant={viewMode === 'map' ? 'primary' : 'outline'}
            >
              <Map className="h-4 w-4" />
              Map
            </Button>
          </div>

          <Button
            className="flex items-center gap-2"
            onClick={() => setShowSavedSearches(!showSavedSearches)}
            size="sm"
            variant="outline"
          >
            <Bookmark className="h-4 w-4" />
            Saved Searches
          </Button>

          <Button
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            variant="outline"
          >
            <Filter className="h-4 w-4" />
            Filters
            {Object.keys(filters).length > 0 && (
              <span className="ml-1 rounded-full bg-teal-100 px-1.5 py-0.5 text-teal-700 text-xs dark:bg-teal-900 dark:text-teal-300">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>
        </div>

        {/* AI Suggestions */}
        {aiSuggestion && (
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-900/20">
            <div className="flex items-start gap-3">
              <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-teal-500" />
              <div>
                <p className="font-medium text-sm text-teal-900 dark:text-teal-100">
                  AI Suggestion
                </p>
                <p className="mt-1 text-sm text-teal-700 dark:text-teal-300">
                  {aiSuggestion.reasoning}
                </p>
                {aiSuggestion.alternativeQueries.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {aiSuggestion.alternativeQueries.slice(0, 3).map((query, index) => (
                      <Button
                        className="rounded-full bg-teal-100 px-3 py-1 text-teal-700 text-xs transition-colors hover:bg-teal-200 dark:bg-teal-900 dark:text-teal-300 dark:hover:bg-teal-800"
                        key={index}
                        onClick={() => setQuery(query)}
                      >
                        "{query}"
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-lg dark:text-white">Filters</h3>
            <div className="flex items-center gap-2">
              <Button
                className="text-sm"
                onClick={() => {
                  setShowFilters(false)
                  setShowSavedSearches(true)
                }}
                size="sm"
                variant="outline"
              >
                <Bookmark className="mr-1 h-4 w-4" />
                Saved Searches
              </Button>
              <Button onClick={() => setShowFilters(false)} size="sm" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={clearFilters}
            resultCount={results.length}
            showMobileToggle={false}
          />
        </div>
      )}

      {/* Saved Searches Panel */}
      {showSavedSearches && (
        <SavedSearchesPanel
          className="absolute top-4 right-4 z-30 w-96 max-w-[calc(100vw-2rem)]"
          currentFilters={filters}
          onClose={() => setShowSavedSearches(false)}
          onLoadSearch={handleLoadSavedSearch}
        />
      )}

      {/* Results View */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map View */}
        {(viewMode === 'map' || viewMode === 'list') && (
          <div className={viewMode === 'map' ? 'lg:col-span-3' : 'lg:col-span-2'}>
            <MapView
              center={mapCenter}
              className="h-[500px] lg:h-[600px]"
              onLocationChange={handleMapLocationChange}
              onProviderClick={handleProviderClick}
              providers={providerLocations}
              radius={filters.radius}
              radiusCenter={
                selectedLocation
                  ? [selectedLocation.latitude, selectedLocation.longitude]
                  : undefined
              }
              zoom={filters.radius ? Math.max(8, 15 - Math.log2(filters.radius)) : 12}
            />
          </div>
        )}

        {/* Enhanced List View */}
        {viewMode === 'list' && (
          <div className="lg:col-span-1">
            <EnhancedSearchResults
              loading={loading}
              onProviderClick={handleProviderClick}
              results={results}
            />
          </div>
        )}
      </div>
    </div>
  )
}
