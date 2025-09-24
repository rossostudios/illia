'use client'

import { Bell, HelpCircle, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import DashboardSidebar from '@/components/DashboardSidebar'
import MobileBottomNavEnhanced from '@/components/MobileBottomNavEnhanced'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useSession } from '@/hooks/use-session'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
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

  // Keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      // ESC to blur search
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
  }

  // Debounced search handler
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      // TODO: Implement actual search logic here
      if (value.trim()) {
        // This is where you'd trigger search API calls or filter data
      }
    }, 300) // 300ms debounce delay
  }, [])

  // Cleanup timeout on unmount
  useEffect(
    () => () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    },
    []
  )

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <DashboardSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        userEmail={user?.email}
      />

      {/* Main content area with responsive margin */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {/* Top navigation bar */}
        <header className="sticky top-0 z-10 border-gray-200 border-b bg-white px-4 py-4 md:px-8 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-4">
              {/* Hamburger menu button - Minimum 44px touch target */}
              <button
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-teal-400 dark:focus:ring-offset-[#161616] dark:hover:bg-gray-800/50"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Search bar */}
              <div className="relative max-w-4xl flex-1">
                <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                <input
                  aria-describedby="search-hint"
                  aria-label="Search"
                  autoComplete="off"
                  className={`w-full rounded-lg border py-2 pr-10 pl-10 text-gray-900 text-sm transition-all placeholder:text-gray-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-gray-100 dark:focus:border-teal-400 dark:focus:ring-teal-400 dark:placeholder:text-gray-400 ${
                    isSearchFocused
                      ? 'border-teal-500 bg-white dark:border-teal-400 dark:bg-gray-900'
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50'
                  }`}
                  onBlur={() => setIsSearchFocused(false)}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search providers, services, or locations..."
                  ref={searchInputRef}
                  spellCheck="false"
                  type="search"
                  value={searchQuery}
                />
                {!searchQuery && (
                  <kbd
                    aria-label="Press Command K to focus search"
                    className="pointer-events-none absolute top-2 right-2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-gray-500 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    id="search-hint"
                  >
                    ⌘K
                  </kbd>
                )}
                {searchQuery && (
                  <button
                    aria-label="Clear search"
                    className="-translate-y-1/2 absolute top-1/2 right-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-400 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-900 dark:hover:bg-gray-700"
                    onClick={() => {
                      setSearchQuery('')
                      searchInputRef.current?.focus()
                    }}
                  >
                    <span className="sr-only">Clear</span>
                    <svg
                      aria-label="icon"
                      className="h-4 w-4"
                      fill="none"
                      role="img"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>Icon</title>
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <button
                aria-label="Notifications"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 dark:hover:bg-gray-800"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="sr-only">Notifications</span>
              </button>
              <button
                aria-label="Help"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 dark:hover:bg-gray-800"
              >
                <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Link
                className="px-2 font-medium text-gray-800 text-sm hover:text-teal-600 hover:underline dark:text-gray-200 dark:hover:text-teal-400"
                href={`/${locale}/docs`}
              >
                Docs
              </Link>
              <button className="rounded-lg bg-teal-500 px-4 py-1.5 font-medium text-sm text-white shadow-sm transition-colors hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700">
                Upgrade
              </button>
            </div>
          </div>
        </header>

        {/* Breadcrumbs */}
        <div className="border-gray-200 border-b bg-gray-50 px-4 py-2 md:px-8 dark:border-gray-800 dark:bg-gray-900/50">
          <Breadcrumbs />
        </div>

        {/* Page content - Add padding for mobile bottom nav */}
        <main className="flex-1 p-4 pb-20 md:p-8 md:pb-8" id="main-content">
          {children}
        </main>
      </div>

      {/* Enhanced Mobile Bottom Navigation */}
      <MobileBottomNavEnhanced />
    </div>
  )
}
