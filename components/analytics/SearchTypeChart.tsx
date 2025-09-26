'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from '@/components/LazyChart'
import type { SearchAnalyticsData } from '@/hooks/use-analytics'

type SearchTypeChartProps = {
  data: SearchAnalyticsData
  className?: string
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function SearchTypeChart({ data, className = '' }: SearchTypeChartProps) {
  const chartData = data.searchTypeDistribution.map((item, index) => ({
    name: item.type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    value: item.count,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <div className={`h-48 w-full sm:h-64 ${className}`}>
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={chartData}
            dataKey="value"
            fill="#8884d8"
            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            outerRadius={80}
          >
            {chartData.map((entry, index) => (
              <Cell fill={entry.color} key={`cell-${index}`} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }: any) => {
              if (active && payload && payload.length) {
                const data = payload[0]
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <p className="font-medium text-gray-900 text-sm dark:text-white">{data.name}</p>
                    <p className="text-gray-600 text-sm dark:text-gray-300">
                      {data.value} searches
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
