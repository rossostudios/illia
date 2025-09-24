'use client'

import { FileText, MessageSquare, Settings, TrendingUp, UserCheck, Users } from 'lucide-react'
import Link from 'next/link'

type QuickActionsProps = {
  pendingProviders: number
}

export default function QuickActions({ pendingProviders }: QuickActionsProps) {
  const actions = [
    {
      title: 'Approve Providers',
      description: `${pendingProviders} pending`,
      href: '/admin/providers',
      icon: UserCheck,
      color: pendingProviders > 0 ? 'orange' : 'green',
    },
    {
      title: 'Manage Users',
      description: 'View all users',
      href: '/admin/users',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Moderate Content',
      description: 'Review posts',
      href: '/admin/community',
      icon: MessageSquare,
      color: 'purple',
    },
    {
      title: 'View Analytics',
      description: 'Platform insights',
      href: '/admin/analytics',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Audit Logs',
      description: 'Recent actions',
      href: '/admin/audit',
      icon: FileText,
      color: 'gray',
    },
    {
      title: 'Platform Settings',
      description: 'Configure system',
      href: '/admin/settings',
      icon: Settings,
      color: 'gray',
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      gray: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    }
    return colors[color] || colors.gray
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="border-gray-200 border-b p-6 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 text-lg dark:text-white">Quick Actions</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link
              className="rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
              href={action.href}
              key={action.title}
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${getColorClasses(action.color)}`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm dark:text-white">
                    {action.title}
                  </p>
                  <p className="text-gray-500 text-xs dark:text-gray-400">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
