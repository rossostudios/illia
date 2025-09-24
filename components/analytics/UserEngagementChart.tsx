'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from '@/components/LazyChart'
import type { UserEngagementMetrics } from '@/hooks/use-analytics'

type UserEngagementChartProps = {
  data: UserEngagementMetrics
  className?: string
}

export function UserEngagementChart({ data, className = '' }: UserEngagementChartProps) {
  // Validate data before processing
  if (!(data?.searchesByDate && Array.isArray(data.searchesByDate))) {
    return (
      <div
        className={`h-48 w-full sm:h-64 ${className} flex items-center justify-center text-gray-500`}
      >
        <div className="text-center">
          <div className="font-medium text-lg">No data available</div>
          <div className="text-sm">Chart data is missing or invalid</div>
        </div>
      </div>
    )
  }

  // Combine the three datasets by date
  const _chartData = data.searchesByDate.map((searchItem) => {
    const matchItem = data.matchesByDate.find((m) => m.date === searchItem.date)
    const leadItem = data.leadsByDate.find((l) => l.date === searchItem.date)

    try {
      return {
        date: new Date(searchItem.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        searches: searchItem.count,
        matches: matchItem?.count || 0,
        leads: leadItem?.count || 0,
      }
    } catch (_error) {
      return {
        date: 'Invalid Date',
        searches: 0,
        matches: 0,
        leads: 0,
      }
    }
  })

  // Also include dates that have matches or leads but no searches
  const allDates = new Set([
    ...data.searchesByDate.map((d) => d.date),
    ...data.matchesByDate.map((d) => d.date),
    ...data.leadsByDate.map((d) => d.date),
  ])

  const completeChartData = Array.from(allDates)
    .sort()
    .map((date) => {
      try {
        const searchItem = data.searchesByDate.find((s) => s.date === date)
        const matchItem = data.matchesByDate.find((m) => m.date === date)
        const leadItem = data.leadsByDate.find((l) => l.date === date)

        return {
          date: new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          searches: searchItem?.count || 0,
          matches: matchItem?.count || 0,
          leads: leadItem?.count || 0,
        }
      } catch (_error) {
        return {
          date: 'Invalid Date',
          searches: 0,
          matches: 0,
          leads: 0,
        }
      }
    })

  // Ensure we have data to display
  if (
    completeChartData.length === 0 ||
    completeChartData.every((item) => item.searches === 0 && item.matches === 0 && item.leads === 0)
  ) {
    return (
      <div
        className={`h-48 w-full sm:h-64 ${className} flex items-center justify-center text-gray-500`}
      >
        <div className="text-center">
          <div className="font-medium text-lg">No data to display</div>
          <div className="text-sm">No engagement data found for the selected period</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-48 w-full sm:h-64 ${className}`}>
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={completeChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid className="opacity-30" strokeDasharray="3 3" />
          <XAxis className="text-xs" dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }}
          />
          <Legend />
          <Line
            activeDot={{ r: 6 }}
            dataKey="searches"
            dot={{ r: 4 }}
            name="Searches"
            stroke="#3b82f6"
            strokeWidth={2}
            type="monotone"
          />
          <Line
            activeDot={{ r: 6 }}
            dataKey="matches"
            dot={{ r: 4 }}
            name="Matches"
            stroke="#10b981"
            strokeWidth={2}
            type="monotone"
          />
          <Line
            activeDot={{ r: 6 }}
            dataKey="leads"
            dot={{ r: 4 }}
            name="Leads"
            stroke="#f59e0b"
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
