import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type DateRange = {
  start: Date
  end: Date
}

export type UserEngagementMetrics = {
  totalSearches: number
  totalMatches: number
  totalLeads: number
  conversionRate: number
  avgSearchTime: number
  searchesByDate: Array<{ date: string; count: number }>
  matchesByDate: Array<{ date: string; count: number }>
  leadsByDate: Array<{ date: string; count: number }>
}

export type SearchAnalyticsData = {
  popularSearchTerms: Array<{ term: string; count: number }>
  searchTypeDistribution: Array<{ type: string; count: number }>
  avgResultsPerSearch: number
  topClickedProviders: Array<{ providerId: string; providerName: string; clicks: number }>
}

export type ProviderPerformanceData = {
  totalProviders: number
  verifiedProviders: number
  avgRating: number
  topRatedProviders: Array<{ name: string; rating: number; reviewCount: number }>
  providersByService: Array<{ service: string; count: number }>
  providersByCity: Array<{ city: string; count: number }>
}

export type AnalyticsData = {
  engagement: UserEngagementMetrics
  search: SearchAnalyticsData
  providers: ProviderPerformanceData
}

// Default/fallback data to prevent errors
const defaultAnalyticsData: AnalyticsData = {
  engagement: {
    totalSearches: 0,
    totalMatches: 0,
    totalLeads: 0,
    conversionRate: 0,
    avgSearchTime: 0,
    searchesByDate: [],
    matchesByDate: [],
    leadsByDate: [],
  },
  search: {
    popularSearchTerms: [],
    searchTypeDistribution: [],
    avgResultsPerSearch: 0,
    topClickedProviders: [],
  },
  providers: {
    totalProviders: 0,
    verifiedProviders: 0,
    avgRating: 0,
    topRatedProviders: [],
    providersByService: [],
    providersByCity: [],
  },
}

export function useAnalytics(dateRange?: DateRange) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const supabase = createClient()

  const fetchEngagementMetrics = useCallback(
    async (
      startDate: Date,
      endDate: Date,
      signal?: AbortSignal
    ): Promise<UserEngagementMetrics> => {
      try {
        // Get search analytics (if table exists)
        const { data: searches } = await supabase
          .from('search_analytics')
          .select('created_at, result_count, time_to_results')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())

        // Get matches data
        const { data: matches } = await supabase
          .from('matches')
          .select('created_at, score')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())

        // Get leads data (if table exists)
        const { data: leads } = await supabase
          .from('leads')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())

        // Calculate metrics
        const totalSearches = searches?.length || 0
        const totalMatches = matches?.length || 0
        const totalLeads = leads?.length || 0

        // Calculate conversion rate (leads from searches)
        const conversionRate = totalSearches > 0 ? (totalLeads / totalSearches) * 100 : 0

        // Calculate average search time
        const validTimes =
          searches?.filter((s) => s.time_to_results).map((s) => s.time_to_results) || []
        const avgSearchTime =
          validTimes.length > 0 ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length : 0

        // Group by date function
        const groupByDate = (items: any[], dateField: string) => {
          const grouped = items.reduce(
            (acc, item) => {
              try {
                if (!item[dateField]) {
                  return acc
                }
                const date = new Date(item[dateField]).toISOString().split('T')[0]
                acc[date] = (acc[date] || 0) + 1
              } catch {
                // Silently handle date parsing errors
              }
              return acc
            },
            {} as Record<string, number>
          )

          return Object.entries(grouped)
            .map(([date, count]) => ({ date, count: count as number }))
            .sort((a, b) => a.date.localeCompare(b.date))
        }

        return {
          totalSearches,
          totalMatches,
          totalLeads,
          conversionRate,
          avgSearchTime,
          searchesByDate: groupByDate(searches || [], 'created_at'),
          matchesByDate: groupByDate(matches || [], 'created_at'),
          leadsByDate: groupByDate(leads || [], 'created_at'),
        }
      } catch (error: any) {
        if (error?.name === 'AbortError') {
          throw error
        }
        // Return default data on error
        return defaultAnalyticsData.engagement
      }
    },
    [supabase]
  )

  const fetchSearchAnalytics = useCallback(
    async (startDate: Date, endDate: Date, signal?: AbortSignal): Promise<SearchAnalyticsData> => {
      try {
        const { data: analytics } = await supabase
          .from('search_analytics')
          .select('query, search_type, result_count, clicked_result_id')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())

        if (!analytics || analytics.length === 0) {
          return defaultAnalyticsData.search
        }

        // Popular search terms
        const termCounts = analytics.reduce(
          (acc, item) => {
            if (item.query) {
              acc[item.query] = (acc[item.query] || 0) + 1
            }
            return acc
          },
          {} as Record<string, number>
        )

        const popularSearchTerms = Object.entries(termCounts)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([term, count]) => ({ term, count: count as number }))

        // Search type distribution
        const typeCounts = analytics.reduce(
          (acc, item) => {
            const type = item.search_type || 'unknown'
            acc[type] = (acc[type] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        )

        const searchTypeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
          type,
          count: count as number,
        }))

        // Average results per search
        const avgResultsPerSearch =
          analytics.reduce((sum, item) => sum + (item.result_count || 0), 0) / analytics.length

        // Top clicked providers (simplified - don't fetch provider names to avoid N+1)
        const clickCounts = analytics.reduce(
          (acc, item) => {
            if (item.clicked_result_id) {
              acc[item.clicked_result_id] = (acc[item.clicked_result_id] || 0) + 1
            }
            return acc
          },
          {} as Record<string, number>
        )

        const topClickedProviders = Object.entries(clickCounts)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([providerId, clicks]) => ({
            providerId,
            providerName: `Provider ${providerId.slice(0, 8)}...`,
            clicks: clicks as number,
          }))

        return {
          popularSearchTerms,
          searchTypeDistribution,
          avgResultsPerSearch,
          topClickedProviders,
        }
      } catch (error: any) {
        if (error?.name === 'AbortError') {
          throw error
        }
        return defaultAnalyticsData.search
      }
    },
    [supabase]
  )

  const fetchProviderPerformance = useCallback(
    async (signal?: AbortSignal): Promise<ProviderPerformanceData> => {
      try {
        // Use correct table name: service_providers
        const { data: providers } = await supabase
          .from('service_providers')
          .select('id, name, rating_avg, reviews_count, services, city, status')

        if (!providers || providers.length === 0) {
          return defaultAnalyticsData.providers
        }

        const totalProviders = providers.length
        const verifiedProviders = providers.filter((p) => p.status === 'verified').length

        // Average rating
        const ratings = providers.filter((p) => p.rating_avg).map((p) => p.rating_avg) || []
        const avgRating =
          ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

        // Top rated providers
        const topRatedProviders = providers
          .filter((p) => p.rating_avg && p.reviews_count)
          .sort((a, b) => (b.rating_avg || 0) - (a.rating_avg || 0))
          .slice(0, 10)
          .map((p) => ({
            name: p.name,
            rating: p.rating_avg || 0,
            reviewCount: p.reviews_count || 0,
          }))

        // Providers by service
        const serviceCounts = providers.reduce(
          (acc, provider) => {
            if (provider.services && Array.isArray(provider.services)) {
              provider.services.forEach((service: string) => {
                acc[service] = (acc[service] || 0) + 1
              })
            }
            return acc
          },
          {} as Record<string, number>
        )

        const providersByService = Object.entries(serviceCounts)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .map(([service, count]) => ({ service, count: count as number }))

        // Providers by city
        const cityCounts = providers.reduce(
          (acc, provider) => {
            if (provider.city) {
              acc[provider.city] = (acc[provider.city] || 0) + 1
            }
            return acc
          },
          {} as Record<string, number>
        )

        const providersByCity = Object.entries(cityCounts)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .map(([city, count]) => ({ city, count: count as number }))

        return {
          totalProviders,
          verifiedProviders,
          avgRating,
          topRatedProviders,
          providersByService,
          providersByCity,
        }
      } catch (error: any) {
        if (error?.name === 'AbortError') {
          throw error
        }
        return defaultAnalyticsData.providers
      }
    },
    [supabase]
  )

  const fetchAnalytics = useCallback(
    async (range?: DateRange) => {
      // Cancel any ongoing fetch
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController()
      const signal = abortControllerRef.current.signal

      setLoading(true)
      setError(null)

      try {
        const startDate = range?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const endDate = range?.end || new Date()

        const [engagement, search, providers] = await Promise.all([
          fetchEngagementMetrics(startDate, endDate, signal),
          fetchSearchAnalytics(startDate, endDate, signal),
          fetchProviderPerformance(signal),
        ])

        if (!signal.aborted) {
          setData({ engagement, search, providers })
          setError(null)
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          // Use fallback data if fetch fails
          setData(defaultAnalyticsData)
          setError('Failed to fetch some analytics data. Showing default values.')
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false)
        }
        abortControllerRef.current = null
      }
    },
    [fetchEngagementMetrics, fetchSearchAnalytics, fetchProviderPerformance]
  )

  // Fetch analytics on mount and when dateRange changes
  useEffect(() => {
    fetchAnalytics(dateRange)

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [dateRange, fetchAnalytics]) // Only depend on dateRange, not fetchAnalytics

  return {
    data: data || defaultAnalyticsData,
    loading,
    error,
    refetch: () => fetchAnalytics(dateRange),
  }
}
