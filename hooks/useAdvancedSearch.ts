'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { useToast } from '@/hooks/useToast'
import { createClient } from '@/lib/supabase/client'

export interface SearchFilters {
  // Location filters
  city?: string
  neighborhood?: string
  latitude?: number
  longitude?: number
  radius?: number // in kilometers

  // Service filters
  services?: string[]

  // Price filters
  priceMin?: number
  priceMax?: number
  rateType?: 'monthly' | 'hourly' | 'both'

  // Quality filters
  minRating?: number
  verifiedOnly?: boolean

  // Language filters
  languages?: string[]

  // Specialty filters
  specialties?: string[]

  // Availability filters
  availability?: string[]
  availabilitySchedule?: Record<string, string[]>

  // Text search
  query?: string

  // Sorting
  sortBy?: 'relevance' | 'price' | 'rating' | 'distance' | 'recent'
  sortOrder?: 'asc' | 'desc'
}

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
  distance?: number // calculated distance in km
  relevance_score?: number
}

export interface SearchAnalytics {
  searchType: 'text' | 'voice' | 'filter' | 'location'
  query?: string
  filtersUsed: Partial<SearchFilters>
  resultCount: number
  timeToResults: number
  clickedResultId?: string
  conversionFunnel?: string
}

interface UseAdvancedSearchOptions {
  enableAnalytics?: boolean
  debounceMs?: number
  maxResults?: number
}

export function useAdvancedSearch(options: UseAdvancedSearchOptions = {}) {
  const { enableAnalytics = true, debounceMs = 300, maxResults = 50 } = options
  const { user } = useSession()
  const { showToast } = useToast()

  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTime, setSearchTime] = useState<number>(0)

  // Debounced search function
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  const performSearch = useCallback(
    async (searchFilters: SearchFilters) => {
      const startTime = Date.now()
      setLoading(true)
      setError(null)

      try {
        let query = createClient()
          .from('providers')
          .select('*', { count: 'exact' })
          .eq('active', true)

        // Location filters
        if (searchFilters.city) {
          query = query.eq('city', searchFilters.city)
        }

        if (searchFilters.neighborhood) {
          query = query.eq('neighborhood', searchFilters.neighborhood)
        }

        // Geospatial search with radius
        if (searchFilters.latitude && searchFilters.longitude && searchFilters.radius) {
          const { latitude, longitude, radius } = searchFilters

          // Using PostGIS for geospatial queries (if available)
          // For now, we'll use a simplified distance calculation
          // In production, you'd want to use PostGIS or similar
          query = query.not('latitude', 'is', null).not('longitude', 'is', null)
        }

        // Service filters
        if (searchFilters.services && searchFilters.services.length > 0) {
          query = query.overlaps('services', searchFilters.services)
        }

        // Price filters
        if (searchFilters.priceMin !== undefined) {
          if (searchFilters.rateType === 'monthly' || searchFilters.rateType === 'both') {
            query = query.gte('rate_monthly', searchFilters.priceMin)
          }
          if (searchFilters.rateType === 'hourly' || searchFilters.rateType === 'both') {
            query = query.gte('rate_hourly', searchFilters.priceMin)
          }
        }

        if (searchFilters.priceMax !== undefined) {
          if (searchFilters.rateType === 'monthly' || searchFilters.rateType === 'both') {
            query = query.lte('rate_monthly', searchFilters.priceMax)
          }
          if (searchFilters.rateType === 'hourly' || searchFilters.rateType === 'both') {
            query = query.lte('rate_hourly', searchFilters.priceMax)
          }
        }

        // Quality filters
        if (searchFilters.minRating) {
          query = query.gte('rating', searchFilters.minRating)
        }

        if (searchFilters.verifiedOnly) {
          query = query.eq('verified', true)
        }

        // Language filters
        if (searchFilters.languages && searchFilters.languages.length > 0) {
          query = query.overlaps('languages', searchFilters.languages)
        }

        // Specialty filters
        if (searchFilters.specialties && searchFilters.specialties.length > 0) {
          query = query.overlaps('specialties', searchFilters.specialties)
        }

        // Text search
        if (searchFilters.query) {
          query = query.or(
            `name.ilike.%${searchFilters.query}%,bio.ilike.%${searchFilters.query}%,neighborhood.ilike.%${searchFilters.query}%`
          )
        }

        // Sorting
        const sortBy = searchFilters.sortBy || 'relevance'
        const sortOrder = searchFilters.sortOrder || 'desc'

        switch (sortBy) {
          case 'price':
            query = query.order('rate_monthly', { ascending: sortOrder === 'asc' })
            break
          case 'rating':
            query = query.order('rating', { ascending: sortOrder === 'desc' })
            break
          case 'recent':
            query = query.order('created_at', { ascending: false })
            break
          case 'distance':
            // Would need PostGIS for proper distance sorting
            if (searchFilters.latitude && searchFilters.longitude) {
              // For now, just order by creation date
              query = query.order('created_at', { ascending: false })
            }
            break
          default: // relevance
            query = query.order('rating', { ascending: false })
        }

        // Limit results
        query = query.limit(maxResults)

        const { data, error: queryError, count } = await query

        if (queryError) {
          throw queryError
        }

        // Calculate distances if needed
        let processedResults: SearchResult[] = data || []

        if (searchFilters.latitude && searchFilters.longitude) {
          processedResults = processedResults
            .map((provider) => ({
              ...provider,
              distance: calculateDistance(
                searchFilters.latitude!,
                searchFilters.longitude!,
                provider.latitude,
                provider.longitude
              ),
            }))
            .filter(
              (provider) =>
                !searchFilters.radius || (provider.distance ?? Infinity) <= searchFilters.radius
            )
        }

        // Calculate relevance scores
        processedResults = processedResults.map((provider) => ({
          ...provider,
          relevance_score: calculateRelevanceScore(provider, searchFilters),
        }))

        setResults(processedResults)
        setTotalCount(count || 0)

        const endTime = Date.now()
        const timeTaken = endTime - startTime
        setSearchTime(timeTaken)

        // Analytics tracking
        if (enableAnalytics && user) {
          await trackSearchAnalytics({
            searchType: searchFilters.query ? 'text' : 'filter',
            query: searchFilters.query,
            filtersUsed: searchFilters,
            resultCount: processedResults.length,
            timeToResults: timeTaken / 1000,
          })
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Search failed'
        setError(errorMessage)
        showToast(errorMessage, 'error')
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    },
    [user, enableAnalytics, maxResults, showToast]
  )

  // Debounced search trigger
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      if (Object.keys(filters).length > 0) {
        performSearch(filters)
      }
    }, debounceMs)

    setDebounceTimer(timer)

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [filters, performSearch, debounceMs, debounceTimer])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    setResults([])
    setTotalCount(0)
  }, [])

  const trackResultClick = useCallback(
    async (providerId: string) => {
      if (enableAnalytics && user) {
        await trackSearchAnalytics({
          searchType: filters.query ? 'text' : 'filter',
          query: filters.query,
          filtersUsed: filters,
          resultCount: results.length,
          timeToResults: searchTime / 1000,
          clickedResultId: providerId,
        })
      }
    },
    [enableAnalytics, user, filters, results.length, searchTime]
  )

  return {
    filters,
    results,
    loading,
    error,
    totalCount,
    searchTime,
    updateFilters,
    clearFilters,
    trackResultClick,
    performSearch: (filters: SearchFilters) => performSearch(filters),
  }
}

// Helper functions
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function calculateRelevanceScore(provider: SearchResult, filters: SearchFilters): number {
  let score = 0

  // Rating bonus
  score += provider.rating * 10

  // Verified bonus
  if (provider.verified) score += 20

  // Distance penalty (closer is better)
  if (provider.distance !== undefined) {
    score -= Math.min(provider.distance * 2, 50)
  }

  // Review count bonus
  score += Math.min(provider.review_count, 50)

  // Language match bonus
  if (filters.languages && filters.languages.length > 0) {
    const matchedLanguages = provider.languages.filter((lang) =>
      filters.languages?.some((filterLang) => lang.toLowerCase().includes(filterLang.toLowerCase()))
    )
    score += matchedLanguages.length * 15
  }

  // Service match bonus
  if (filters.services && filters.services.length > 0) {
    const matchedServices = provider.services.filter((service) =>
      filters.services?.some((filterService) =>
        service.toLowerCase().includes(filterService.toLowerCase())
      )
    )
    score += matchedServices.length * 25
  }

  return Math.max(score, 0)
}

async function trackSearchAnalytics(analytics: SearchAnalytics) {
  try {
    const supabase = createClient()
    await supabase.from('search_analytics').insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      search_type: analytics.searchType,
      query: analytics.query,
      filters_used: analytics.filtersUsed,
      result_count: analytics.resultCount,
      time_to_results: analytics.timeToResults,
      clicked_result_id: analytics.clickedResultId,
      conversion_funnel: analytics.conversionFunnel,
      user_agent: navigator.userAgent,
      ip_address: null, // Will be set by server
    })
  } catch (error) {
    console.error('Failed to track search analytics:', error)
  }
}
