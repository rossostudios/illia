'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SearchAnalyticsData } from '@/hooks/useAnalytics'

interface PopularSearchTermsChartProps {
  data: SearchAnalyticsData
  className?: string
}

export function PopularSearchTermsChart({ data, className = '' }: PopularSearchTermsChartProps) {
  const chartData = data.popularSearchTerms.slice(0, 10).map((term, _index) => ({
    term: term.term.length > 20 ? `${term.term.substring(0, 20)}...` : term.term,
    count: term.count,
    fullTerm: term.term,
  }))

  return (
    <div className={`w-full h-48 sm:h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout="horizontal"
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis type="number" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="term"
            className="text-xs"
            tick={{ fontSize: 12 }}
            width={100}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {data.fullTerm}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {data.count} searches
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
