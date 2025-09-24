import { useCallback, useEffect, useState } from 'react'
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

export function useAnalytics(dateRange?: DateRange) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchEngagementMetrics = useCallback(
    async (startDate: Date, endDate: Date): Promise<UserEngagementMetrics> => {
      try {
        // Get search analytics
        const { data: searches, error: searchError } = await supabase
          .from('search_analytics')
          .select('created_at, result_count, time_to_results')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())

        if (searchError) {
          // Return fallback data
          return {
            totalSearches: 0,
            totalMatches: 0,
            totalLeads: 0,
            conversionRate: 0,
            avgSearchTime: 0,
            searchesByDate: [],
            matchesByDate: [],
            leadsByDate: [],
          }
        }

        // Get matches data
        const { data: matches, error: matchesError } = await supabase
          .from('matches')
          .select('created_at, score')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())

        if (matchesError) {
        }

        // Get leads data
        const { data: leads, error: leadsError } = await supabase
          .from('leads')
          .select('created_at')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())

        if (leadsError) {
        }

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

        // Group by date functions
        const groupByDate = (items: any[], dateField: string) => {
          const grouped = items.reduce(
            (acc, item) => {
              try {
                if (!item[dateField]) {
                  return acc
                }
                const date = new Date(item[dateField]).toISOString().split('T')[0]
                acc[date] = (acc[date] || 0) + 1
              } catch (_error) {
                // Error handled silently
              }
              return acc
            },
            {} as Record<string, number>
          )

          return Object.entries(grouped).map(([date, count]) => ({ date, count }))
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
      } catch (_error) {
        // Return fallback data
        return {
          totalSearches: 0,
          totalMatches: 0,
          totalLeads: 0,
          conversionRate: 0,
          avgSearchTime: 0,
          searchesByDate: [],
          matchesByDate: [],
          leadsByDate: [],
        }
      }
    },
    [supabase]
  )

  const fetchSearchAnalytics = useCallback(
    async (startDate: Date, endDate: Date): Promise<SearchAnalyticsData> => {
      try {
        const { data: analytics, error } = await supabase
          .from('search_analytics')
          .select('query, search_type, result_count, clicked_result_id')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())

        if (error) {
          return {
            popularSearchTerms: [],
            searchTypeDistribution: [],
            avgResultsPerSearch: 0,
            topClickedProviders: [],
          }
        }

        // Popular search terms
        const termCounts =
          analytics?.reduce(
            (acc, item) => {
              if (item.query) {
                acc[item.query] = (acc[item.query] || 0) + 1
              }
              return acc
            },
            {} as Record<string, number>
          ) || {}

        const popularSearchTerms = Object.entries(termCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([term, count]) => ({ term, count }))

        // Search type distribution
        const typeCounts =
          analytics?.reduce(
            (acc, item) => {
              acc[item.search_type] = (acc[item.search_type] || 0) + 1
              return acc
            },
            {} as Record<string, number>
          ) || {}

        const searchTypeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
          type,
          count,
        }))

        // Average results per search
        const avgResultsPerSearch = analytics?.length
          ? analytics.reduce((sum, item) => sum + (item.result_count || 0), 0) / analytics.length
          : 0

        // Top clicked providers
        const clickCounts =
          analytics?.reduce(
            (acc, item) => {
              if (item.clicked_result_id) {
                acc[item.clicked_result_id] = (acc[item.clicked_result_id] || 0) + 1
              }
              return acc
            },
            {} as Record<string, number>
          ) || {}

        const topClickedProviders = await Promise.all(
          Object.entries(clickCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(async ([providerId, clicks]) => {
              const { data: provider } = await supabase
                .from('providers')
                .select('name')
                .eq('id', providerId)
                .single()

              return {
                providerId,
                providerName: provider?.name || 'Unknown',
                clicks,
              }
            })
        )

        return {
          popularSearchTerms,
          searchTypeDistribution,
          avgResultsPerSearch,
          topClickedProviders,
        }
      } catch (_error) {
        return {
          popularSearchTerms: [],
          searchTypeDistribution: [],
          avgResultsPerSearch: 0,
          topClickedProviders: [],
        }
      }
    },
    [supabase]
  )

  const fetchProviderPerformance = useCallback(async (): Promise<ProviderPerformanceData> => {
    try {
      // Get all providers
      const { data: providers, error } = await supabase
        .from('providers')
        .select('id, name, rating, reviews_count, services, city, verified')

      if (error) {
        return {
          totalProviders: 0,
          verifiedProviders: 0,
          avgRating: 0,
          topRatedProviders: [],
          providersByService: [],
          providersByCity: [],
        }
      }

      const totalProviders = providers?.length || 0
      const verifiedProviders = providers?.filter((p) => p.verified).length || 0

      // Average rating
      const ratings = providers?.filter((p) => p.rating).map((p) => p.rating) || []
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

      // Top rated providers
      const topRatedProviders =
        providers
          ?.filter((p) => p.rating && p.reviews_count)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 10)
          .map((p) => ({
            name: p.name,
            rating: p.rating,
            reviewCount: p.reviews_count || 0,
          })) || []

      // Providers by service
      const serviceCounts =
        providers?.reduce(
          (acc, provider) => {
            provider.services?.forEach((service) => {
              acc[service] = (acc[service] || 0) + 1
            })
            return acc
          },
          {} as Record<string, number>
        ) || {}

      const providersByService = Object.entries(serviceCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([service, count]) => ({ service, count }))

      // Providers by city
      const cityCounts =
        providers?.reduce(
          (acc, provider) => {
            if (provider.city) {
              acc[provider.city] = (acc[provider.city] || 0) + 1
            }
            return acc
          },
          {} as Record<string, number>
        ) || {}

      const providersByCity = Object.entries(cityCounts).map(([city, count]) => ({ city, count }))

      return {
        totalProviders,
        verifiedProviders,
        avgRating,
        topRatedProviders,
        providersByService,
        providersByCity,
      }
    } catch (_error) {
      return {
        totalProviders: 0,
        verifiedProviders: 0,
        avgRating: 0,
        topRatedProviders: [],
        providersByService: [],
        providersByCity: [],
      }
    }
  }, [supabase])

  const fetchAnalytics = useCallback(
    async (range?: DateRange) => {
      setLoading(true)
      setError(null)

      try {
        const startDate = range?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        const endDate = range?.end || new Date()

        const [engagement, search, providers] = await Promise.all([
          fetchEngagementMetrics(startDate, endDate),
          fetchSearchAnalytics(startDate, endDate),
          fetchProviderPerformance(),
        ])

        setData({ engagement, search, providers })
        // Clear any previous errors if we successfully got data
        setError(null)
      } catch (err) {
        // Only set error if we don't have any data
        if (!data) {
          setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
        }
      } finally {
        setLoading(false)
      }
    },
    [fetchEngagementMetrics, fetchSearchAnalytics, fetchProviderPerformance, data]
  )

  useEffect(() => {
    fetchAnalytics(dateRange)
  }, [fetchAnalytics, dateRange])

  return {
    data,
    loading,
    error,
    refetch: () => fetchAnalytics(dateRange),
  }
}
