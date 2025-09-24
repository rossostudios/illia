'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

// Lazy load all Recharts components
export const LineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart as ComponentType<any>),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
)

export const BarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart as ComponentType<any>),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
)

export const AreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart as ComponentType<any>),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
)

export const PieChart = dynamic(
  () => import('recharts').then((mod) => mod.PieChart as ComponentType<any>),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
)

export const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer as ComponentType<any>),
  { ssr: false }
)

export const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis as ComponentType<any>),
  { ssr: false }
)

export const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis as ComponentType<any>),
  { ssr: false }
)

export const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip as ComponentType<any>),
  { ssr: false }
)

export const Legend = dynamic(
  () => import('recharts').then((mod) => mod.Legend as ComponentType<any>),
  { ssr: false }
)

export const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid as ComponentType<any>),
  { ssr: false }
)

export const Line = dynamic(
  () => import('recharts').then((mod) => mod.Line as ComponentType<any>),
  { ssr: false }
)

export const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar as ComponentType<any>), {
  ssr: false,
})

export const Area = dynamic(
  () => import('recharts').then((mod) => mod.Area as ComponentType<any>),
  { ssr: false }
)

export const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie as ComponentType<any>), {
  ssr: false,
})

export const Cell = dynamic(
  () => import('recharts').then((mod) => mod.Cell as ComponentType<any>),
  { ssr: false }
)

// Loading skeleton for charts
function ChartSkeleton() {
  return <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
}
