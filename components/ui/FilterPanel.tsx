'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { DollarSign, Filter, Globe, MapPin, Star, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from './Button'

export interface FilterOptions {
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

interface FilterPanelProps {
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
    if (key === 'sortBy' || key === 'sortOrder') return false
    if (key === 'priceRange')
      return (
        value.min !== DEFAULT_FILTERS.priceRange.min || value.max !== DEFAULT_FILTERS.priceRange.max
      )
    if (key === 'priceType') return value !== DEFAULT_FILTERS.priceType
    if (key === 'rating') return value > 0
    if (key === 'radius') return value !== DEFAULT_FILTERS.radius
    if (key === 'verified') return value !== false
    if (key === 'latitude' || key === 'longitude') return false // Don't count as active filters
    if (Array.isArray(value)) return value.length > 0
    return Boolean(value)
  }).length

  return (
    <>
      {/* Mobile Toggle Button */}
      {showMobileToggle && (
        <button
          onClick={onToggle}
          className="md:hidden fixed bottom-24 right-4 z-40 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 transition-colors"
          aria-label="Toggle filters"
        >
          <Filter className="h-6 w-6" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      )}

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className={`${
              showMobileToggle
                ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto md:relative md:inset-auto md:z-0'
                : 'w-full'
            }`}
          >
            <div className="p-4 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                  {activeFilterCount > 0 && (
                    <span className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-medium px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {showMobileToggle && (
                  <button
                    onClick={onToggle}
                    className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    aria-label="Close filters"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <div className="space-y-2">
                  <select
                    value={localFilters.sortBy}
                    onChange={(e) =>
                      handleFilterChange('sortBy', e.target.value as FilterOptions['sortBy'])
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                      <button
                        onClick={() => handleFilterChange('sortOrder', 'asc')}
                        className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                          localFilters.sortOrder === 'asc'
                            ? 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        ↑{' '}
                        {localFilters.sortBy === 'price'
                          ? 'Low'
                          : localFilters.sortBy === 'rating'
                            ? 'Low'
                            : 'Near'}
                      </button>
                      <button
                        onClick={() => handleFilterChange('sortOrder', 'desc')}
                        className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                          localFilters.sortOrder === 'desc'
                            ? 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Services
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {SERVICE_OPTIONS.map((service) => (
                    <label
                      key={service}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={localFilters.services.includes(service)}
                        onChange={(e) => {
                          const newServices = e.target.checked
                            ? [...localFilters.services, service]
                            : localFilters.services.filter((s) => s !== service)
                          handleFilterChange('services', newServices)
                        }}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Type & Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Price Range
                </label>
                <div className="space-y-3">
                  {/* Price Type Selector */}
                  <div className="flex gap-2">
                    {['monthly', 'hourly', 'both'].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          handleFilterChange('priceType', type as FilterOptions['priceType'])
                        }
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                          localFilters.priceType === type
                            ? 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {type === 'monthly' ? 'Monthly' : type === 'hourly' ? 'Hourly' : 'Both'}
                      </button>
                    ))}
                  </div>

                  {/* Price Range Inputs */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={localFilters.priceRange.min}
                      onChange={(e) =>
                        handleFilterChange('priceRange', {
                          ...localFilters.priceRange,
                          min: Number(e.target.value),
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      min="0"
                      value={localFilters.priceRange.max}
                      onChange={(e) =>
                        handleFilterChange('priceRange', {
                          ...localFilters.priceRange,
                          max: Number(e.target.value),
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                      placeholder="Max"
                    />
                  </div>
                  <PriceRangeSlider
                    min={0}
                    max={localFilters.priceType === 'hourly' ? 100 : 2000}
                    value={[localFilters.priceRange.min, localFilters.priceRange.max]}
                    onChange={([min, max]) => handleFilterChange('priceRange', { min, max })}
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Star className="inline h-4 w-4 mr-1" />
                  Minimum Rating
                </label>
                <div className="flex items-center gap-2">
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('rating', rating)}
                      className={`px-3 py-1.5 rounded-lg border transition-colors ${
                        localFilters.rating === rating
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location & Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location & Distance
                </label>
                <div className="space-y-3">
                  {/* Location Input */}
                  <input
                    type="text"
                    value={localFilters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="Enter city or address"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />

                  {/* Radius Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Search radius
                      </span>
                      <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
                        {localFilters.radius} km
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={localFilters.radius}
                      onChange={(e) => handleFilterChange('radius', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>1 km</span>
                      <span>50 km</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Globe className="inline h-4 w-4 mr-1" />
                  Languages
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((language) => (
                    <button
                      key={language}
                      onClick={() => {
                        const newLanguages = localFilters.languages.includes(language)
                          ? localFilters.languages.filter((l) => l !== language)
                          : [...localFilters.languages, language]
                        handleFilterChange('languages', newLanguages)
                      }}
                      className={`px-3 py-1.5 rounded-lg border transition-colors ${
                        localFilters.languages.includes(language)
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialties & Preferences
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {SPECIALTY_OPTIONS.map((specialty) => (
                    <label
                      key={specialty}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={localFilters.specialties.includes(specialty)}
                        onChange={(e) => {
                          const newSpecialties = e.target.checked
                            ? [...localFilters.specialties, specialty]
                            : localFilters.specialties.filter((s) => s !== specialty)
                          handleFilterChange('specialties', newSpecialties)
                        }}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verified Only */}
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={localFilters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.checked)}
                  className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Verified Providers Only
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show only background-checked providers
                  </p>
                </div>
              </label>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                  disabled={activeFilterCount === 0}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApply}
                  className="flex-1"
                  disabled={!hasChanges}
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
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        <div
          className="absolute h-2 bg-teal-500 rounded-full"
          style={{
            left: `${percentage.min}%`,
            width: `${percentage.max - percentage.min}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={(e) => handleChange(0, Number(e.target.value))}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={(e) => handleChange(1, Number(e.target.value))}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  )
}
