'use client'

import { usePathname } from 'next/navigation'
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { OptimizedScripts } from '@/components/OptimizedScripts'
import { SessionProvider } from '@/components/SessionProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ThemeProvider } from '@/hooks/use-theme'
import { ToastProvider } from '@/hooks/use-toast'

// Lazy load non-critical components
const AppFooter = lazy(() => import('@/components/AppFooter'))
const Footer = lazy(() => import('@/components/Footer'))
const PwaInstaller = lazy(() => import('@/components/PWAInstaller'))

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Check if it's a dashboard route (accounting for locale prefix)
  const isDashboard =
    pathname?.includes('/dashboard') ||
    pathname?.includes('/quiz') ||
    pathname?.includes('/matches') ||
    pathname?.includes('/providers')

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SessionProvider>
          <ToastProvider>
            <OptimizedScripts />
            <div className="flex-grow">{children}</div>
            <Suspense fallback={<div className="h-16" />}>
              {isDashboard ? <AppFooter /> : <Footer />}
            </Suspense>
            <Suspense fallback={null}>
              <PwaInstaller />
            </Suspense>
          </ToastProvider>
        </SessionProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
