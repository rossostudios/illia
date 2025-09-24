'use client'

import { lazy, Suspense, useEffect } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { usePrefetchRoutes } from '@/utils/performance'

// Lazy load heavy components
const DashboardSidebar = lazy(() => import('@/components/DashboardSidebar'))
const _NotificationDropdown = lazy(() => import('@/components/NotificationDropdown'))

type PerformanceLayoutProps = {
  children: React.ReactNode
  sidebar?: boolean
  userEmail?: string | null
}

export function PerformanceLayout({ children, sidebar = true, userEmail }: PerformanceLayoutProps) {
  // Prefetch common routes
  usePrefetchRoutes([
    '/en/dashboard',
    '/en/dashboard/explore',
    '/en/dashboard/directory',
    '/en/dashboard/matches',
  ])

  // Preload critical fonts
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.href = '/fonts/parkinsans.woff2'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {sidebar && (
        <Suspense fallback={<SidebarSkeleton />}>
          <DashboardSidebar userEmail={userEmail} />
        </Suspense>
      )}

      <main className="flex-1 overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </main>
    </div>
  )
}

function SidebarSkeleton() {
  return (
    <div className="w-64 border-gray-200 border-r bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="p-6">
        <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <nav className="space-y-2 p-3">
        {[...new Array(8)].map((_, i) => (
          <div className="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" key={i} />
        ))}
      </nav>
    </div>
  )
}
