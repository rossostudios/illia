'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ProviderPerformanceData } from '@/hooks/use-analytics'

type ProviderPerformanceChartProps = {
  data: ProviderPerformanceData
  className?: string
}

export function ProviderPerformanceChart({ data, className = '' }: ProviderPerformanceChartProps) {
  const chartData = data.providersByService.slice(0, 8).map((service) => ({
    service: service.service.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    count: service.count,
  }))

  return (
    <div className={`h-48 w-full sm:h-64 ${className}`}>
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid className="opacity-30" strokeDasharray="3 3" />
          <XAxis
            angle={-45}
            className="text-xs"
            dataKey="service"
            height={80}
            textAnchor="end"
            tick={{ fontSize: 12 }}
          />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0]
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <p className="font-medium text-gray-900 text-sm dark:text-white">{label}</p>
                    <p className="text-gray-600 text-sm dark:text-gray-300">
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
