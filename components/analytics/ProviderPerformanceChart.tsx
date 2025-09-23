'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ProviderPerformanceData } from '@/hooks/useAnalytics'

interface ProviderPerformanceChartProps {
  data: ProviderPerformanceData
  className?: string
}

export function ProviderPerformanceChart({ data, className = '' }: ProviderPerformanceChartProps) {
  const chartData = data.providersByService.slice(0, 8).map((service) => ({
    service: service.service.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    count: service.count,
  }))

  return (
    <div className={`w-full h-48 sm:h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="service"
            className="text-xs"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0]
                return (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {data.value} providers
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
