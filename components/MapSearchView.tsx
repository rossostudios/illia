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
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch'
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions'

interface MapSearchViewProps {
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
  const providerLocations: ProviderLocation[] = useMemo(() => {
    return results
      .map((result) => ({
        id: result.id,
        name: result.name,
        latitude: result.latitude || 0,
        longitude: result.longitude || 0,
        address: result.address || '',
        services: result.services || [],
        rating: result.rating || 0,
        price: result.rate_monthly || 0,
        verified: result.verified || false,
        specialties: result.specialties || [],
      }))
      .filter((provider) => provider.latitude && provider.longitude)
  }, [results])

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
  const handleProviderClick = useCallback((provider: ProviderLocation) => {
    // Could scroll to provider in list view or show details modal
    console.log('Provider clicked:', provider)
  }, [])

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
    } else if (filters.city === 'florianopolis') {
      return [-27.5954, -48.548] // Florianópolis center
    }
    return [-27.5954, -48.548] // Default to Florianópolis
  }, [selectedLocation, filters.city])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        {/* AI-Powered Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🔍 Smart Search
          </label>
          <div className="relative">
            <AISearchInput
              value={filters.query || ''}
              onChange={(value) => updateFilters({ query: value })}
              onSubmit={(query, aiSuggestion) => {
                updateFilters({ query })
                if (aiSuggestion?.suggestedFilters) {
                  updateFilters(aiSuggestion.suggestedFilters)
                }
              }}
              placeholder="Describe what you're looking for (e.g., 'English speaking cleaner in Medellín')"
              className="w-full"
            />
            <div className="absolute right-3 top-3 z-10">
              <VoiceSearchButton
                onResult={(_transcript, processedQuery) => {
                  updateFilters({ query: processedQuery })
                }}
                language="en-US"
                size="md"
                showTranscript={true}
              />
            </div>
          </div>
        </div>

        {/* Location Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Specific Location (Optional)
          </label>
          <LocationAutocomplete
            value={filters.location || ''}
            onChange={(value) => updateFilters({ location: value })}
            onLocationSelect={handleLocationSelect}
            placeholder="Enter city, address, or location..."
            className="w-full"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="flex items-center gap-2"
            >
              <Map className="h-4 w-4" />
              Map
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSavedSearches(!showSavedSearches)}
            className="flex items-center gap-2"
          >
            <Bookmark className="h-4 w-4" />
            Saved Searches
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {Object.keys(filters).length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs rounded-full">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>
        </div>

        {/* AI Suggestions */}
        {aiSuggestion && (
          <div className="mt-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-teal-900 dark:text-teal-100">
                  AI Suggestion
                </p>
                <p className="text-sm text-teal-700 dark:text-teal-300 mt-1">
                  {aiSuggestion.reasoning}
                </p>
                {aiSuggestion.alternativeQueries.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {aiSuggestion.alternativeQueries.slice(0, 3).map((query, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(query)}
                        className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs rounded-full hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors"
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowFilters(false)
                  setShowSavedSearches(true)
                }}
                className="text-sm"
              >
                <Bookmark className="h-4 w-4 mr-1" />
                Saved Searches
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={clearFilters}
            showMobileToggle={false}
            resultCount={results.length}
          />
        </div>
      )}

      {/* Saved Searches Panel */}
      {showSavedSearches && (
        <SavedSearchesPanel
          currentFilters={filters}
          onLoadSearch={handleLoadSavedSearch}
          onClose={() => setShowSavedSearches(false)}
          className="absolute top-4 right-4 z-30 w-96 max-w-[calc(100vw-2rem)]"
        />
      )}

      {/* Results View */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map View */}
        {(viewMode === 'map' || viewMode === 'list') && (
          <div className={viewMode === 'map' ? 'lg:col-span-3' : 'lg:col-span-2'}>
            <MapView
              providers={providerLocations}
              center={mapCenter}
              zoom={filters.radius ? Math.max(8, 15 - Math.log2(filters.radius)) : 12}
              radius={filters.radius}
              radiusCenter={
                selectedLocation
                  ? [selectedLocation.latitude, selectedLocation.longitude]
                  : undefined
              }
              onProviderClick={handleProviderClick}
              onLocationChange={handleMapLocationChange}
              className="h-[500px] lg:h-[600px]"
            />
          </div>
        )}

        {/* Enhanced List View */}
        {viewMode === 'list' && (
          <div className="lg:col-span-1">
            <EnhancedSearchResults
              results={results}
              loading={loading}
              onProviderClick={handleProviderClick}
            />
          </div>
        )}
      </div>
    </div>
  )
}
