'use client'

import {
  Calendar,
  DollarSign,
  FileText,
  HeadphonesIcon,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { AdminUser } from '@/lib/admin/auth'
import { cn } from '@/lib/utils'

type AdminSidebarProps = {
  adminUser: AdminUser
}

export default function AdminSidebar({ adminUser }: AdminSidebarProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      permission: null,
    },
    {
      name: 'Provider Approval',
      href: '/admin/providers',
      icon: UserCheck,
      permission: null,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      permission: null,
    },
    {
      name: 'Bookings',
      href: '/admin/bookings',
      icon: Calendar,
      permission: null,
    },
    {
      name: 'Community',
      href: '/admin/community',
      icon: MessageSquare,
      permission: null,
    },
    {
      name: 'Finance',
      href: '/admin/finance',
      icon: DollarSign,
      permission: 'admin',
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: TrendingUp,
      permission: null,
    },
    {
      name: 'Support',
      href: '/admin/support',
      icon: HeadphonesIcon,
      permission: null,
    },
    {
      name: 'Audit Logs',
      href: '/admin/audit',
      icon: FileText,
      permission: 'admin',
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      permission: 'super_admin',
    },
  ]

  const canAccess = (permission: string | null) => {
    if (!permission) {
      return true
    }
    if (adminUser.role === 'super_admin') {
      return true
    }
    if (permission === 'admin' && ['admin', 'super_admin'].includes(adminUser.role)) {
      return true
    }
    return false
  }

  return (
    <aside className="fixed top-16 left-0 h-full w-64 border-gray-200 border-r bg-white dark:border-gray-700 dark:bg-gray-900">
      <nav className="flex h-full flex-col">
        <div className="flex-1 py-4">
          <div className="mb-4 px-4">
            <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 dark:bg-purple-900/20">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="font-medium text-purple-900 text-sm dark:text-purple-100">
                  {adminUser.role.replace('_', ' ').toUpperCase()}
                </p>
                <p className="text-purple-600 text-xs dark:text-purple-400">Admin Panel</p>
              </div>
            </div>
          </div>

          <ul className="space-y-1 px-2">
            {navigation.map((item) => {
              if (!canAccess(item.permission)) {
                return null
              }

              const isActive =
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

              return (
                <li key={item.name}>
                  <Link
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                      isActive
                        ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                    )}
                    href={item.href}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="border-gray-200 border-t p-4 dark:border-gray-700">
          <Link
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50"
            href="/"
          >
            <svg
              aria-label="icon"
              className="h-5 w-5"
              fill="none"
              role="img"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Icon</title>
              <path
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <span className="font-medium">Exit Admin</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}
