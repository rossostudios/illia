'use client'

import { Loader2, MapPin, Search, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/use-debounce'

export type LocationSuggestion = {
  place_id: string
  display_name: string
  lat: string
  lon: string
  type: string
  importance: number
  address?: {
    city?: string
    town?: string
    village?: string
    suburb?: string
    state?: string
    country?: string
  }
}

type LocationAutocompleteProps = {
  value: string
  onChange: (value: string) => void
  onLocationSelect: (location: {
    latitude: number
    longitude: number
    address: string
    city?: string
  }) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  showCurrentLocation?: boolean
}

export function LocationAutocomplete({
  value,
  onChange,
  onLocationSelect,
  placeholder = 'Enter city, address, or location',
  className = '',
  disabled = false,
  showCurrentLocation = true,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [gettingLocation, setGettingLocation] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const debouncedValue = useDebounce(value, 300)

  // Search for locations using Nominatim API (OpenStreetMap)
  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=CO,BR&addressdetails=1&extratags=1`
      )

      if (!response.ok) {
        throw new Error('Location search failed')
      }

      const data: LocationSuggestion[] = await response.json()
      setSuggestions(data)
      setShowDropdown(true)
      setSelectedIndex(-1)
    } catch (_error) {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Get current user location
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    setGettingLocation(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 300_000, // 5 minutes
        })
      })

      const { latitude, longitude } = position.coords

      // Reverse geocode to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      )

      if (response.ok) {
        const data: LocationSuggestion = await response.json()
        onLocationSelect({
          latitude,
          longitude,
          address: data.display_name,
          city: data.address?.city || data.address?.town || data.address?.village,
        })
        onChange(data.display_name)
        setShowDropdown(false)
      } else {
        // Fallback: use coordinates directly
        onLocationSelect({
          latitude,
          longitude,
          address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        })
        onChange(`Current location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`)
        setShowDropdown(false)
      }
    } catch (_error) {
      alert('Unable to get your current location. Please check your browser permissions.')
    } finally {
      setGettingLocation(false)
    }
  }, [onLocationSelect, onChange])

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      onChange(newValue)
      if (newValue.trim()) {
        setShowDropdown(true)
      } else {
        setSuggestions([])
        setShowDropdown(false)
      }
    },
    [onChange]
  )

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    (suggestion: LocationSuggestion) => {
      const latitude = Number.parseFloat(suggestion.lat)
      const longitude = Number.parseFloat(suggestion.lon)

      onLocationSelect({
        latitude,
        longitude,
        address: suggestion.display_name,
        city: suggestion.address?.city || suggestion.address?.town || suggestion.address?.village,
      })

      onChange(suggestion.display_name)
      setShowDropdown(false)
      setSuggestions([])
    },
    [onLocationSelect, onChange]
  )

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown || suggestions.length === 0) {
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSuggestionSelect(suggestions[selectedIndex])
          }
          break
        case 'Escape':
          setShowDropdown(false)
          setSelectedIndex(-1)
          break
      }
    },
    [showDropdown, suggestions, selectedIndex, handleSuggestionSelect]
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search when debounced value changes
  useEffect(() => {
    searchLocations(debouncedValue)
  }, [debouncedValue, searchLocations])

  // Clear input
  const handleClear = useCallback(() => {
    onChange('')
    setSuggestions([])
    setShowDropdown(false)
    inputRef.current?.focus()
  }, [onChange])

  return (
    <div className={`relative ${className}`}>
      {/* Input field */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>

        <input
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-10 pl-10 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => value && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          ref={inputRef}
          type="text"
          value={value}
        />

        {value && (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            onClick={handleClear}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Current location button */}
      {showCurrentLocation && !disabled && (
        <button
          className="absolute top-2 right-2 p-1 text-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={gettingLocation}
          onClick={getCurrentLocation}
          title="Use current location"
        >
          {gettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </button>
      )}

      {/* Suggestions dropdown */}
      {showDropdown && (suggestions.length > 0 || loading) && (
        <div
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
          ref={dropdownRef}
        >
          {loading && suggestions.length === 0 && (
            <div className="flex items-center gap-2 px-4 py-3 text-gray-500 text-sm dark:text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching locations...
            </div>
          )}

          {!loading && suggestions.length === 0 && value.length >= 2 && (
            <div className="px-4 py-3 text-gray-500 text-sm dark:text-gray-400">
              No locations found. Try a different search term.
            </div>
          )}

          {suggestions.map((suggestion, index) => (
            <button
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none dark:focus:bg-gray-700 dark:hover:bg-gray-800 ${
                index === selectedIndex ? 'bg-teal-50 dark:bg-teal-900/20' : ''
              }`}
              key={suggestion.place_id}
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-gray-900 text-sm dark:text-white">
                    {suggestion.display_name.split(',')[0]}
                  </div>
                  <div className="truncate text-gray-500 text-xs dark:text-gray-400">
                    {suggestion.display_name.split(',').slice(1).join(',').trim()}
                  </div>
                  {suggestion.type && (
                    <div className="mt-1 text-teal-600 text-xs capitalize dark:text-teal-400">
                      {suggestion.type.replace('_', ' ')}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Custom hook for debouncing
function _useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
