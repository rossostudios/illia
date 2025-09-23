'use client'

import { usePathname } from 'next/navigation'
import AppFooter from '@/components/AppFooter'
import Footer from '@/components/Footer'
import PWAInstaller from '@/components/PWAInstaller'
import { SessionProvider } from '@/components/SessionProvider'
import { ThemeProvider } from '@/hooks/useTheme'
import { ToastProvider } from '@/hooks/useToast'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Check if it's a dashboard route (accounting for locale prefix)
  const isDashboard =
    pathname?.includes('/dashboard') ||
    pathname?.includes('/quiz') ||
    pathname?.includes('/matches') ||
    pathname?.includes('/providers')

  return (
    <ThemeProvider>
      <SessionProvider>
        <ToastProvider>
          <div className="flex-grow">{children}</div>
          {isDashboard ? <AppFooter /> : <Footer />}
          <PWAInstaller />
        </ToastProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
