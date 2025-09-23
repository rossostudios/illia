'use client'

import { Download, FileText, Search, Star, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PopularSearchTermsChart } from '@/components/analytics/PopularSearchTermsChart'
import { ProviderPerformanceChart } from '@/components/analytics/ProviderPerformanceChart'
import { SearchTypeChart } from '@/components/analytics/SearchTypeChart'
import { UserEngagementChart } from '@/components/analytics/UserEngagementChart'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Skeleton } from '@/components/ui/Skeleton'
import { type DateRange, useAnalytics } from '@/hooks/useAnalytics'
import { exportAnalyticsToCSV, exportAnalyticsToPDF } from '@/utils/analyticsExport'

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  })

  const { data, loading, error, refetch } = useAnalytics(dateRange)

  // Log any runtime errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Runtime error in analytics page:', event.error)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  // Don't show error if we have data (even fallback data)
  const shouldShowError = error && !data

  const handleDateRangeChange = (range: '7d' | '30d' | '90d' | '1y') => {
    const end = new Date()
    const start = new Date()

    switch (range) {
      case '7d':
        start.setDate(end.getDate() - 7)
        break
      case '30d':
        start.setDate(end.getDate() - 30)
        break
      case '90d':
        start.setDate(end.getDate() - 90)
        break
      case '1y':
        start.setFullYear(end.getFullYear() - 1)
        break
    }

    setDateRange({ start, end })
  }

  const exportToPDF = async () => {
    if (!data) return

    try {
      const dateRangeText = `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
      await exportAnalyticsToPDF(data, {
        title: 'Illia Analytics Report',
        dateRange: dateRangeText,
        includeCharts: true,
        includeStats: true,
      })
    } catch (error) {
      console.error('Failed to export PDF:', error)
      // You could show a toast notification here
    }
  }

  const exportToCSV = () => {
    if (!data) return

    try {
      exportAnalyticsToCSV(data)
    } catch (error) {
      console.error('Failed to export CSV:', error)
      // You could show a toast notification here
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (shouldShowError) {
    return (
      <div className="p-6">
        <ErrorMessage error={error} />
        <Button onClick={refetch} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  // Loading skeleton for metrics
  const renderMetricsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="ml-4 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Loading skeleton for charts
  const renderChartSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <Skeleton className="h-6 w-48 mb-4" />
      <Skeleton className="w-full h-48 sm:h-64" />
    </div>
  )

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No analytics data available.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track user engagement and platform performance
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Date Range Selector */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={
                dateRange.start.getTime() ===
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime()
                  ? 'primary'
                  : 'outline'
              }
              size="sm"
              onClick={() => handleDateRangeChange('7d')}
            >
              7 Days
            </Button>
            <Button
              variant={
                dateRange.start.getTime() ===
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime()
                  ? 'primary'
                  : 'outline'
              }
              size="sm"
              onClick={() => handleDateRangeChange('30d')}
            >
              30 Days
            </Button>
            <Button
              variant={
                dateRange.start.getTime() ===
                new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).getTime()
                  ? 'primary'
                  : 'outline'
              }
              size="sm"
              onClick={() => handleDateRangeChange('90d')}
            >
              90 Days
            </Button>
            <Button
              variant={
                dateRange.start.getTime() ===
                new Date(
                  new Date().getFullYear() - 1,
                  new Date().getMonth(),
                  new Date().getDate()
                ).getTime()
                  ? 'primary'
                  : 'outline'
              }
              size="sm"
              onClick={() => handleDateRangeChange('1y')}
            >
              1 Year
            </Button>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      {loading ? (
        renderMetricsSkeleton()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Searches
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.engagement.totalSearches.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Matches
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.engagement.totalMatches.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.engagement.conversionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Provider Rating
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.providers.avgRating.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderChartSkeleton()}
          {renderChartSkeleton()}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Engagement Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              User Engagement Trends
            </h3>
            <div data-chart-type="user-engagement">
              <UserEngagementChart data={data.engagement} />
            </div>
          </div>

          {/* Popular Search Terms */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popular Search Terms
            </h3>
            <div data-chart-type="popular-search-terms">
              <PopularSearchTermsChart data={data.search} />
            </div>
          </div>

          {/* Provider Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Rated Providers
            </h3>
            <div className="space-y-3">
              {data.providers.topRatedProviders.slice(0, 5).map((provider, index) => (
                <div key={provider.name} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">
                      {index + 1}.
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">{provider.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {provider.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Type Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Search Type Distribution
            </h3>
            <div data-chart-type="search-type-distribution">
              <SearchTypeChart data={data.search} />
            </div>
          </div>
        </div>
      )}

      {/* Additional Charts */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderChartSkeleton()}
          {renderChartSkeleton()}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Provider Performance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Services Distribution
            </h3>
            <div data-chart-type="provider-performance">
              <ProviderPerformanceChart data={data.providers} />
            </div>
          </div>

          {/* Provider Ratings Chart Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Provider Ratings Distribution
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <Star className="w-12 h-12 mr-3" />
              <span>Coming soon</span>
            </div>
          </div>
        </div>
      )}

      {/* Additional Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Provider Statistics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Providers</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.providers.totalProviders}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Verified Providers</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.providers.verifiedProviders}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Verification Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.providers.totalProviders > 0
                    ? (
                        (data.providers.verifiedProviders / data.providers.totalProviders) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Lead Generation
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Leads</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.engagement.totalLeads}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Avg Search Time</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.engagement.avgSearchTime.toFixed(2)}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Avg Results</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.search.avgResultsPerSearch.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Provider Distribution
            </h3>
            <div className="space-y-2">
              {data.providers.providersByCity.map((city) => (
                <div key={city.city} className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                    {city.city}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {city.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
