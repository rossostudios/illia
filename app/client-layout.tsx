'use client'

import { usePathname } from 'next/navigation'
import { SessionProvider } from "@/components/SessionProvider"
import Footer from "@/components/Footer"
import AppFooter from "@/components/AppFooter"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <SessionProvider>
      <div className="flex-grow">
        {children}
      </div>
      {isDashboard ? <AppFooter /> : <Footer />}
    </SessionProvider>
  )
}