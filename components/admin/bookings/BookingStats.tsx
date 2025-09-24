'use client'

import { Calendar, CheckCircle, Clock, DollarSign, XCircle } from 'lucide-react'

type BookingStatsProps = {
  stats: {
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
    totalRevenue: number
  }
}

export default function BookingStats({ stats }: BookingStatsProps) {
  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.total,
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'yellow',
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      icon: Calendar,
      color: 'purple',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      icon: XCircle,
      color: 'red',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {statCards.map((stat) => (
        <div
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          key={stat.title}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className={`rounded-lg p-2 ${getColorClasses(stat.color)}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </div>
          <p className="font-bold text-2xl text-gray-900 dark:text-white">{stat.value}</p>
          <p className="mt-1 text-gray-600 text-xs dark:text-gray-400">{stat.title}</p>
        </div>
      ))}
    </div>
  )
}
