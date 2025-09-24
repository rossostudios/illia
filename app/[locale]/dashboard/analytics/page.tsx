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
import { type DateRange, useAnalytics } from '@/hooks/use-analytics'
import { exportAnalyticsToCSV, exportAnalyticsToPDF } from '@/utils/analyticsExport'

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  })

  const { data, loading, error, refetch } = useAnalytics(dateRange)

  // Log any runtime errors
  useEffect(() => {
    const handleError = (_event: ErrorEvent) => {
      // TODO: integrate runtime error reporting (e.g., Sentry)
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
      default:
        start.setDate(end.getDate() - 30)
        break
    }

    setDateRange({ start, end })
  }

  const exportToPdf = async () => {
    if (!data) {
      return
    }

    try {
      const dateRangeText = `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
      await exportAnalyticsToPDF(data, {
        title: 'Illia Analytics Report',
        dateRange: dateRangeText,
        includeCharts: true,
      })
    } catch (_error) {
      // You could show a toast notification here
    }
  }

  const exportToCsv = () => {
    if (!data) {
      return
    }

    try {
      exportAnalyticsToCSV(data)
    } catch (_error) {
      // You could show a toast notification here
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (shouldShowError) {
    return (
      <div className="p-6">
        <ErrorMessage error={error} />
        <Button className="mt-4" onClick={refetch}>
          Try Again
        </Button>
      </div>
    )
  }

  const metricSkeletonKeys = [
    'total-users',
    'active-users',
    'conversion-rate',
    'retention',
  ] as const
  const insightSkeletonKeys = ['searches', 'matches', 'leads'] as const
  const insightDetailSkeletonKeys = ['primary', 'secondary', 'tertiary'] as const

  // Loading skeleton for metrics
  const renderMetricsSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metricSkeletonKeys.map((metricKey) => (
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900" key={metricKey}>
          <div className="flex items-center">
            <Skeleton className="h-12 w-12 rounded-lg" />
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
    <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
      <Skeleton className="mb-4 h-6 w-48" />
      <Skeleton className="h-48 w-full sm:h-64" />
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Track user engagement and platform performance
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Date Range Selector */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleDateRangeChange('7d')}
              size="sm"
              variant={
                dateRange.start.getTime() ===
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime()
                  ? 'primary'
                  : 'outline'
              }
            >
              7 Days
            </Button>
            <Button
              onClick={() => handleDateRangeChange('30d')}
              size="sm"
              variant={
                dateRange.start.getTime() ===
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime()
                  ? 'primary'
                  : 'outline'
              }
            >
              30 Days
            </Button>
            <Button
              onClick={() => handleDateRangeChange('90d')}
              size="sm"
              variant={
                dateRange.start.getTime() ===
                new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).getTime()
                  ? 'primary'
                  : 'outline'
              }
            >
              90 Days
            </Button>
            <Button
              onClick={() => handleDateRangeChange('1y')}
              size="sm"
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
            >
              1 Year
            </Button>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={exportToPdf} size="sm" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button onClick={exportToCsv} size="sm" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      {loading ? (
        renderMetricsSkeleton()
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <div className="flex items-center">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-600 text-sm dark:text-gray-400">
                  Total Searches
                </p>
                <p className="font-bold text-2xl text-gray-900 dark:text-white">
                  {data.engagement.totalSearches.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <div className="flex items-center">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-600 text-sm dark:text-gray-400">
                  Total Matches
                </p>
                <p className="font-bold text-2xl text-gray-900 dark:text-white">
                  {data.engagement.totalMatches.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <div className="flex items-center">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-600 text-sm dark:text-gray-400">
                  Conversion Rate
                </p>
                <p className="font-bold text-2xl text-gray-900 dark:text-white">
                  {data.engagement.conversionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <div className="flex items-center">
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-600 text-sm dark:text-gray-400">
                  Avg Provider Rating
                </p>
                <p className="font-bold text-2xl text-gray-900 dark:text-white">
                  {data.providers.avgRating.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {renderChartSkeleton()}
          {renderChartSkeleton()}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* User Engagement Chart */}
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
              User Engagement Trends
            </h3>
            <div data-chart-type="user-engagement">
              <UserEngagementChart data={data.engagement} />
            </div>
          </div>

          {/* Popular Search Terms */}
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
              Popular Search Terms
            </h3>
            <div data-chart-type="popular-search-terms">
              <PopularSearchTermsChart data={data.search} />
            </div>
          </div>

          {/* Provider Performance */}
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
              Top Rated Providers
            </h3>
            <div className="space-y-3">
              {data.providers.topRatedProviders.slice(0, 5).map((provider, index) => (
                <div className="flex items-center justify-between" key={provider.name}>
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-600 text-sm dark:text-gray-300">
                      {index + 1}.
                    </span>
                    <span className="text-gray-900 text-sm dark:text-white">{provider.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 text-yellow-400" />
                    <span className="font-medium text-gray-900 text-sm dark:text-white">
                      {provider.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Type Distribution */}
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {renderChartSkeleton()}
          {renderChartSkeleton()}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Provider Performance Chart */}
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
              Services Distribution
            </h3>
            <div data-chart-type="provider-performance">
              <ProviderPerformanceChart data={data.providers} />
            </div>
          </div>

          {/* Provider Ratings Chart Placeholder */}
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
              Provider Ratings Distribution
            </h3>
            <div className="flex h-64 items-center justify-center text-gray-500">
              <Star className="mr-3 h-12 w-12" />
              <span>Coming soon</span>
            </div>
          </div>
        </div>
      )}

      {/* Additional Stats */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {insightSkeletonKeys.map((metricKey) => (
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900" key={metricKey}>
              <Skeleton className="mb-4 h-6 w-32" />
              <div className="space-y-2">
                {insightDetailSkeletonKeys.map((detailKey) => (
                  <div className="flex justify-between" key={detailKey}>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
              Provider Statistics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm dark:text-gray-300">Total Providers</span>
                <span className="font-medium text-gray-900 text-sm dark:text-white">
                  {data.providers.totalProviders}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm dark:text-gray-300">Verified Providers</span>
                <span className="font-medium text-gray-900 text-sm dark:text-white">
                  {data.providers.verifiedProviders}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm dark:text-gray-300">Verification Rate</span>
                <span className="font-medium text-gray-900 text-sm dark:text-white">
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

          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
              Lead Generation
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm dark:text-gray-300">Total Leads</span>
                <span className="font-medium text-gray-900 text-sm dark:text-white">
                  {data.engagement.totalLeads}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm dark:text-gray-300">Avg Search Time</span>
                <span className="font-medium text-gray-900 text-sm dark:text-white">
                  {data.engagement.avgSearchTime.toFixed(2)}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm dark:text-gray-300">Avg Results</span>
                <span className="font-medium text-gray-900 text-sm dark:text-white">
                  {data.search.avgResultsPerSearch.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
              Provider Distribution
            </h3>
            <div className="space-y-2">
              {data.providers.providersByCity.map((city) => (
                <div className="flex justify-between" key={city.city}>
                  <span className="text-gray-600 text-sm capitalize dark:text-gray-300">
                    {city.city}
                  </span>
                  <span className="font-medium text-gray-900 text-sm dark:text-white">
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
