'use client'

import {
  Calendar,
  Clock,
  DollarSign,
  HeadphonesIcon,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'

type DashboardStatsProps = {
  stats: any
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: Users,
      change: '+12%',
      changeType: 'increase',
      color: 'blue',
    },
    {
      title: 'Active Providers',
      value: stats?.total_providers || 0,
      icon: UserCheck,
      change: '+8%',
      changeType: 'increase',
      color: 'green',
    },
    {
      title: 'Total Bookings',
      value: stats?.total_bookings || 0,
      icon: Calendar,
      change: '+23%',
      changeType: 'increase',
      color: 'purple',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.total_revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      change: '+15%',
      changeType: 'increase',
      color: 'yellow',
    },
    {
      title: 'Pending Providers',
      value: stats?.pending_providers || 0,
      icon: Clock,
      change: stats?.pending_providers > 0 ? 'Needs attention' : 'All clear',
      changeType: stats?.pending_providers > 0 ? 'warning' : 'success',
      color: 'orange',
    },
    {
      title: 'Open Tickets',
      value: stats?.open_tickets || 0,
      icon: HeadphonesIcon,
      change: '-5%',
      changeType: 'decrease',
      color: 'red',
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
      red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((stat) => (
        <div
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          key={stat.title}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className={`rounded-lg p-2 ${getColorClasses(stat.color)}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            {stat.changeType === 'increase' && <TrendingUp className="h-4 w-4 text-green-500" />}
            {stat.changeType === 'decrease' && <TrendingDown className="h-4 w-4 text-red-500" />}
          </div>

          <h3 className="mb-1 font-bold text-2xl text-gray-900 dark:text-white">{stat.value}</h3>
          <p className="text-gray-600 text-sm dark:text-gray-400">{stat.title}</p>

          <div className="mt-3">
            <span
              className={`font-medium text-xs ${
                stat.changeType === 'increase'
                  ? 'text-green-600 dark:text-green-400'
                  : stat.changeType === 'decrease'
                    ? 'text-red-600 dark:text-red-400'
                    : stat.changeType === 'warning'
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-green-600 dark:text-green-400'
              }`}
            >
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
