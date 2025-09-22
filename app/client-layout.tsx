'use client'

import { usePathname } from 'next/navigation'
import AppFooter from '@/components/AppFooter'
import Footer from '@/components/Footer'
import { SessionProvider } from '@/components/SessionProvider'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <SessionProvider>
      <div className="flex-grow">{children}</div>
      {isDashboard ? <AppFooter /> : <Footer />}
    </SessionProvider>
  )
}
