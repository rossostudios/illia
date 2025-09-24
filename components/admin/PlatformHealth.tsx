'use client'

import { Activity, Database, Server, Shield } from 'lucide-react'

export default function PlatformHealth() {
  const healthMetrics = [
    {
      name: 'API Status',
      status: 'operational',
      icon: Server,
      latency: '45ms',
    },
    {
      name: 'Database',
      status: 'operational',
      icon: Database,
      latency: '12ms',
    },
    {
      name: 'Auth Service',
      status: 'operational',
      icon: Shield,
      latency: '23ms',
    },
    {
      name: 'Real-time',
      status: 'operational',
      icon: Activity,
      latency: '8ms',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      case 'degraded':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
      case 'down':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 text-lg dark:text-white">System Health</h2>
      </div>
      <div className="space-y-4 p-6">
        {healthMetrics.map((metric) => (
          <div className="flex items-center justify-between" key={metric.name}>
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${getStatusColor(metric.status)}`}>
                <metric.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm dark:text-white">{metric.name}</p>
                <p className="text-gray-500 text-xs dark:text-gray-400">{metric.latency}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-2 py-1 font-medium text-xs ${getStatusColor(
                metric.status
              )}`}
            >
              {metric.status}
            </span>
          </div>
        ))}

        <div className="border-gray-200 border-t pt-4 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Overall Status</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
