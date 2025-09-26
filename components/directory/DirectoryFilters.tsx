'use client'

import { Filter, MapPin, Search, Star, Utensils, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LOCATIONS, SERVICES } from '@/data/mock-providers'

type DirectoryFiltersProps = {
  filters: {
    search: string
    service: string
    location: string
    city: 'medellin' | 'florianopolis'
    rating: string
    verified: boolean
  }
  onFiltersChange: (filters: any) => void
  showFilters: boolean
  onToggleFilters: () => void
  resultCount: number
  viewMode: 'grid' | 'table' | 'map'
  onViewModeChange: (mode: 'grid' | 'table' | 'map') => void
}

export function DirectoryFilters({
  filters,
  onFiltersChange,
  showFilters,
  onToggleFilters,
  resultCount,
  viewMode,
  onViewModeChange,
}: DirectoryFiltersProps) {
  return (
    <>
      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-10 border-gray-200 border-b bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6 dark:border-gray-800 dark:bg-gray-900/95">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
              <input
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                placeholder="Search by name or service..."
                type="text"
                value={filters.search}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={onToggleFilters}
                size="sm"
                variant={showFilters ? 'primary' : 'outline'}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {(filters.service !== 'All Services' ||
                  filters.location !== 'All Areas' ||
                  filters.rating !== 'all' ||
                  filters.verified) && (
                  <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {
                      [
                        filters.service !== 'All Services',
                        filters.location !== 'All Areas',
                        filters.rating !== 'all',
                        filters.verified,
                      ].filter(Boolean).length
                    }
                  </span>
                )}
              </Button>

              {/* City Toggle */}
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
                <Button
                  className={`px-3 py-1.5 text-sm ${
                    filters.city === 'medellin'
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => onFiltersChange({ ...filters, city: 'medellin' })}
                >
                  Medellín
                </Button>
                <Button
                  className={`px-3 py-1.5 text-sm ${
                    filters.city === 'florianopolis'
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => onFiltersChange({ ...filters, city: 'florianopolis' })}
                >
                  Florianópolis
                </Button>
              </div>

              {/* View Toggle */}
              <div className="hidden gap-1 sm:flex">
                <Button
                  onClick={() => onViewModeChange('grid')}
                  size="sm"
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                >
                  Grid
                </Button>
                <Button
                  onClick={() => onViewModeChange('table')}
                  size="sm"
                  variant={viewMode === 'table' ? 'primary' : 'ghost'}
                >
                  List
                </Button>
                <Button
                  onClick={() => onViewModeChange('map')}
                  size="sm"
                  variant={viewMode === 'map' ? 'primary' : 'ghost'}
                >
                  Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-gray-200 border-b bg-gray-50 px-4 py-4 sm:px-6 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Service Filter */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  <Utensils className="mr-2 inline h-4 w-4" />
                  Service Type
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  onChange={(e) => onFiltersChange({ ...filters, service: e.target.value })}
                  value={filters.service}
                >
                  {SERVICES.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  <MapPin className="mr-2 inline h-4 w-4" />
                  Location
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
                  value={filters.location}
                >
                  {LOCATIONS[filters.city].map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  <Star className="mr-2 inline h-4 w-4" />
                  Minimum Rating
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  onChange={(e) => onFiltersChange({ ...filters, rating: e.target.value })}
                  value={filters.rating}
                >
                  <option value="all">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="5">5 Stars Only</option>
                </select>
              </div>

              {/* Verified Filter */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Options
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800">
                  <input
                    checked={filters.verified}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    onChange={(e) => onFiltersChange({ ...filters, verified: e.target.checked })}
                    type="checkbox"
                  />
                  <span className="text-gray-700 text-sm dark:text-gray-300">Verified Only</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            {(filters.service !== 'All Services' ||
              filters.location !== 'All Areas' ||
              filters.rating !== 'all' ||
              filters.verified ||
              filters.search) && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-gray-600 text-sm dark:text-gray-400">
                  Showing {resultCount} results
                </p>
                <Button
                  onClick={() =>
                    onFiltersChange({
                      search: '',
                      service: 'All Services',
                      location: 'All Areas',
                      city: filters.city,
                      rating: 'all',
                      verified: false,
                    })
                  }
                  size="sm"
                  variant="ghost"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
