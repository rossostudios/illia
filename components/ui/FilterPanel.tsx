'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { DollarSign, Filter, Globe, MapPin, Star, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from './Button'

export type FilterOptions = {
  services: string[]
  priceRange: { min: number; max: number }
  priceType: 'monthly' | 'hourly' | 'both'
  location: string
  latitude?: number
  longitude?: number
  radius: number
  rating: number
  languages: string[]
  availability: string[]
  availabilitySchedule?: Record<string, string[]>
  specialties: string[]
  verified: boolean
  sortBy: 'relevance' | 'price' | 'rating' | 'distance' | 'recent'
  sortOrder: 'asc' | 'desc'
}

type FilterPanelProps = {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onReset?: () => void
  isOpen?: boolean
  onToggle?: () => void
  showMobileToggle?: boolean
  resultCount?: number
}

const DEFAULT_FILTERS: FilterOptions = {
  services: [],
  priceRange: { min: 0, max: 1000 },
  priceType: 'monthly',
  location: '',
  radius: 10,
  rating: 0,
  languages: [],
  availability: [],
  specialties: [],
  verified: false,
  sortBy: 'relevance',
  sortOrder: 'desc',
}

const SERVICE_OPTIONS = [
  'House Cleaning',
  'Deep Cleaning',
  'Cooking',
  'Meal Prep',
  'Laundry',
  'Pet Care',
  'Gardening',
  'Organization',
  'Errands',
  'Child Care',
  'House Sitting',
  'Event Catering',
  'Personal Shopping',
  'Car Maintenance',
]

const LANGUAGE_OPTIONS = [
  'English',
  'Spanish',
  'Portuguese',
  'French',
  'German',
  'Italian',
  'Chinese',
  'Japanese',
]

const _AVAILABILITY_OPTIONS = [
  'Morning',
  'Afternoon',
  'Evening',
  'Weekends',
  'Flexible',
  'Full-time',
  'Part-time',
  'Overnight',
  'Emergency',
]

const SPECIALTY_OPTIONS = [
  'Eco-friendly',
  'Pet-friendly',
  'Child-friendly',
  'Allergies',
  'Kosher',
  'Vegan',
  'Gluten-free',
  'Organic',
  'Luxury',
  'Budget',
  'Experienced',
  'Local',
  'International',
]

export function FilterPanel({
  filters,
  onFiltersChange,
  onReset,
  isOpen = true,
  onToggle,
  showMobileToggle = false,
  resultCount,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  useEffect(() => {
    const filtersChanged = JSON.stringify(localFilters) !== JSON.stringify(filters)
    setHasChanges(filtersChanged)
  }, [localFilters, filters])

  const handleFilterChange = useCallback(
    <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
      setLocalFilters((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const handleApply = () => {
    onFiltersChange(localFilters)
    if (showMobileToggle && onToggle) {
      onToggle()
    }
  }

  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS)
    onReset?.()
  }

  const activeFilterCount = Object.entries(localFilters).filter(([key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') {
      return false
    }
    if (key === 'priceRange') {
      return (
        value.min !== DEFAULT_FILTERS.priceRange.min || value.max !== DEFAULT_FILTERS.priceRange.max
      )
    }
    if (key === 'priceType') {
      return value !== DEFAULT_FILTERS.priceType
    }
    if (key === 'rating') {
      return value > 0
    }
    if (key === 'radius') {
      return value !== DEFAULT_FILTERS.radius
    }
    if (key === 'verified') {
      return value !== false
    }
    if (key === 'latitude' || key === 'longitude') {
      return false // Don't count as active filters
    }
    if (Array.isArray(value)) {
      return value.length > 0
    }
    return Boolean(value)
  }).length

  return (
    <>
      {/* Mobile Toggle Button */}
      {showMobileToggle && (
        <Button
          aria-label="Toggle filters"
          className="fixed right-4 bottom-24 z-40 rounded-full bg-teal-600 p-3 text-white shadow-lg transition-colors hover:bg-teal-700 md:hidden"
          onClick={onToggle}
        >
          <Filter className="h-6 w-6" />
          {activeFilterCount > 0 && (
            <span className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 font-bold text-white text-xs">
              {activeFilterCount}
            </span>
          )}
        </button>
      )}

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className={`${
              showMobileToggle
                ? 'fixed inset-0 z-50 overflow-y-auto bg-white md:relative md:inset-auto md:z-0 dark:bg-gray-900'
                : 'w-full'
            }`}
            exit={{ opacity: 0, x: -300 }}
            initial={{ opacity: 0, x: -300 }}
          >
            <div className="space-y-6 p-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="font-semibold text-gray-900 text-lg dark:text-white">Filters</h2>
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-teal-100 px-2 py-0.5 font-medium text-teal-700 text-xs dark:bg-teal-900 dark:text-teal-300">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {showMobileToggle && (
                  <Button
                    aria-label="Close filters"
                    className="rounded-lg p-2 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
                    onClick={onToggle}
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Sort By */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Sort By
                </label>
                <div className="space-y-2">
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                    onChange={(e) =>
                      handleFilterChange('sortBy', e.target.value as FilterOptions['sortBy'])
                    }
                    value={localFilters.sortBy}
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                    <option value="distance">Distance</option>
                    <option value="recent">Recently Active</option>
                  </select>
                  {(localFilters.sortBy === 'price' ||
                    localFilters.sortBy === 'rating' ||
                    localFilters.sortBy === 'distance') && (
                    <div className="flex gap-2">
                      <Button
                        className={`flex-1 rounded px-3 py-1.5 text-sm transition-colors ${
                          localFilters.sortOrder === 'asc'
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleFilterChange('sortOrder', 'asc')}
                      >
                        ↑{' '}
                        {localFilters.sortBy === 'price'
                          ? 'Low'
                          : localFilters.sortBy === 'rating'
                            ? 'Low'
                            : 'Near'}
                      </button>
                      <Button
                        className={`flex-1 rounded px-3 py-1.5 text-sm transition-colors ${
                          localFilters.sortOrder === 'desc'
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleFilterChange('sortOrder', 'desc')}
                      >
                        ↓{' '}
                        {localFilters.sortBy === 'price'
                          ? 'High'
                          : localFilters.sortBy === 'rating'
                            ? 'High'
                            : 'Far'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Services */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Services
                </label>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {SERVICE_OPTIONS.map((service) => (
                    <label
                      className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-gray-50 dark:hover:bg-gray-800"
                      key={service}
                    >
                      <input
                        checked={localFilters.services.includes(service)}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        onChange={(e) => {
                          const newServices = e.target.checked
                            ? [...localFilters.services, service]
                            : localFilters.services.filter((s) => s !== service)
                          handleFilterChange('services', newServices)
                        }}
                        type="checkbox"
                      />
                      <span className="text-gray-700 text-sm dark:text-gray-300">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Type & Range */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  <DollarSign className="mr-1 inline h-4 w-4" />
                  Price Range
                </label>
                <div className="space-y-3">
                  {/* Price Type Selector */}
                  <div className="flex gap-2">
                    {['monthly', 'hourly', 'both'].map((type) => (
                      <button className={`flex-1 rounded-lg px-3 py-2 text-sm transition-colors ${
                          localFilters.priceType === type
                            ? 'border border-teal-300 bg-teal-100 text-teal-700 dark:border-teal-700 dark:bg-teal-900/20 dark:text-teal-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        key={type}
                        onClick={() =>
                          handleFilterChange('priceType', type as FilterOptions['priceType'])
                        }
                        type="button"
                      >
                        {type === 'monthly' ? 'Monthly' : type === 'hourly' ? 'Hourly' : 'Both'}
                      </button>
                    ))}
                  </div>

                  {/* Price Range Inputs */}
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                      min="0"
                      onChange={(e) =>
                        handleFilterChange('priceRange', {
                          ...localFilters.priceRange,
                          min: Number(e.target.value),
                        })
                      }
                      placeholder="Min"
                      type="number"
                      value={localFilters.priceRange.min}
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                      min="0"
                      onChange={(e) =>
                        handleFilterChange('priceRange', {
                          ...localFilters.priceRange,
                          max: Number(e.target.value),
                        })
                      }
                      placeholder="Max"
                      type="number"
                      value={localFilters.priceRange.max}
                    />
                  </div>
                  <PriceRangeSlider
                    max={localFilters.priceType === 'hourly' ? 100 : 2000}
                    min={0}
                    onChange={([min, max]) => handleFilterChange('priceRange', { min, max })}
                    value={[localFilters.priceRange.min, localFilters.priceRange.max]}
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  <Star className="mr-1 inline h-4 w-4" />
                  Minimum Rating
                </label>
                <div className="flex items-center gap-2">
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <button className={`rounded-lg border px-3 py-1.5 transition-colors ${
                        localFilters.rating === rating
                          ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300'
                          : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                      }`}
                      key={rating}
                      onClick={() => handleFilterChange('rating', rating)}
                      type="button"
                    >
                      {rating === 0 ? 'Any' : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location & Radius */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  <MapPin className="mr-1 inline h-4 w-4" />
                  Location & Distance
                </label>
                <div className="space-y-3">
                  {/* Location Input */}
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="Enter city or address"
                    type="text"
                    value={localFilters.location}
                  />

                  {/* Radius Slider */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-gray-600 text-sm dark:text-gray-400">
                        Search radius
                      </span>
                      <span className="font-medium text-sm text-teal-600 dark:text-teal-400">
                        {localFilters.radius} km
                      </span>
                    </div>
                    <input
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-teal-600 dark:bg-gray-700"
                      max="50"
                      min="1"
                      onChange={(e) => handleFilterChange('radius', Number(e.target.value))}
                      type="range"
                      value={localFilters.radius}
                    />
                    <div className="mt-1 flex justify-between text-gray-500 text-xs dark:text-gray-400">
                      <span>1 km</span>
                      <span>50 km</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  <Globe className="mr-1 inline h-4 w-4" />
                  Languages
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((language) => (
                    <button className={`rounded-lg border px-3 py-1.5 transition-colors ${
                        localFilters.languages.includes(language)
                          ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300'
                          : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                      }`}
                      key={language}
                      onClick={() => {
                        const newLanguages = localFilters.languages.includes(language)
                          ? localFilters.languages.filter((l) => l !== language)
                          : [...localFilters.languages, language]
                        handleFilterChange('languages', newLanguages)
                      }}
                      type="button"
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Specialties & Preferences
                </label>
                <div className="grid max-h-32 grid-cols-2 gap-2 overflow-y-auto">
                  {SPECIALTY_OPTIONS.map((specialty) => (
                    <label
                      className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-gray-50 dark:hover:bg-gray-800"
                      key={specialty}
                    >
                      <input
                        checked={localFilters.specialties.includes(specialty)}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        onChange={(e) => {
                          const newSpecialties = e.target.checked
                            ? [...localFilters.specialties, specialty]
                            : localFilters.specialties.filter((s) => s !== specialty)
                          handleFilterChange('specialties', newSpecialties)
                        }}
                        type="checkbox"
                      />
                      <span className="text-gray-700 text-sm dark:text-gray-300">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verified Only */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-gray-50 p-3 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800">
                <input
                  checked={localFilters.verified}
                  className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  onChange={(e) => handleFilterChange('verified', e.target.checked)}
                  type="checkbox"
                />
                <div>
                  <span className="font-medium text-gray-900 text-sm dark:text-white">
                    Verified Providers Only
                  </span>
                  <p className="text-gray-500 text-xs dark:text-gray-400">
                    Show only background-checked providers
                  </p>
                </div>
              </label>

              {/* Actions */}
              <div className="flex gap-2 border-t pt-4 dark:border-gray-700">
                <Button
                  className="flex-1"
                  disabled={activeFilterCount === 0}
                  onClick={handleReset}
                  variant="outline"
                >
                  Reset
                </Button>
                <Button
                  className="flex-1"
                  disabled={!hasChanges}
                  onClick={handleApply}
                  variant="primary"
                >
                  Apply Filters
                  {resultCount !== undefined && ` (${resultCount})`}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Price Range Slider Component
function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (index: 0 | 1, newValue: number) => {
    const newRange: [number, number] = [...localValue] as [number, number]
    newRange[index] = newValue

    if (index === 0 && newValue > localValue[1]) {
      newRange[1] = newValue
    } else if (index === 1 && newValue < localValue[0]) {
      newRange[0] = newValue
    }

    setLocalValue(newRange)
    onChange(newRange)
  }

  const percentage = {
    min: ((localValue[0] - min) / (max - min)) * 100,
    max: ((localValue[1] - min) / (max - min)) * 100,
  }

  return (
    <div className="relative pt-1">
      <div className="relative h-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="absolute h-2 rounded-full bg-teal-500"
          style={{
            left: `${percentage.min}%`,
            width: `${percentage.max - percentage.min}%`,
          }}
        />
        <input
          className="absolute h-2 w-full cursor-pointer opacity-0"
          max={max}
          min={min}
          onChange={(e) => handleChange(0, Number(e.target.value))}
          type="range"
          value={localValue[0]}
        />
        <input
          className="absolute h-2 w-full cursor-pointer opacity-0"
          max={max}
          min={min}
          onChange={(e) => handleChange(1, Number(e.target.value))}
          type="range"
          value={localValue[1]}
        />
      </div>
    </div>
  )
}
