'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SearchAnalyticsData } from '@/hooks/use-analytics'

type PopularSearchTermsChartProps = {
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
    <div className={`h-48 w-full sm:h-64 ${className}`}>
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          data={chartData}
          layout="horizontal"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid className="opacity-30" strokeDasharray="3 3" />
          <XAxis className="text-xs" tick={{ fontSize: 12 }} type="number" />
          <YAxis
            className="text-xs"
            dataKey="term"
            tick={{ fontSize: 12 }}
            type="category"
            width={100}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <p className="font-medium text-gray-900 text-sm dark:text-white">
                      {data.fullTerm}
                    </p>
                    <p className="text-gray-600 text-sm dark:text-gray-300">
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
