'use client'

import { Bell, HelpCircle, Menu } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardSidebar from '@/components/DashboardSidebar'
import { useSession } from '@/hooks/useSession'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { user } = useSession()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      if (mobile && !localStorage.getItem('sidebarCollapsed')) {
        setIsSidebarCollapsed(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState && !window.matchMedia('(max-width: 768px)').matches) {
      setIsSidebarCollapsed(JSON.parse(savedState))
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        userEmail={user?.email}
      />

      {/* Main content area with responsive margin */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {/* Top navigation bar */}
        <header className="bg-white border-b px-4 md:px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Hamburger menu button */}
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button type="button" className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Notifications">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="sr-only">Notifications</span>
              </button>
              <button type="button" className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Help">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </button>
              <Link
                href={`/${locale}/docs`}
                className="text-gray-800 hover:text-teal-600 hover:underline text-sm font-medium px-2"
              >
                Docs
              </Link>
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
