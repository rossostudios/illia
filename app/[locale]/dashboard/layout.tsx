'use client'

import { Bell, HelpCircle, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import DashboardSidebar from '@/components/DashboardSidebar'
import MobileBottomNav from '@/components/MobileBottomNav'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useSession } from '@/hooks/useSession'

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
        console.log('Searching for:', value)
        // This is where you'd trigger search API calls or filter data
      }
    }, 300) // 300ms debounce delay
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
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
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 md:px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center flex-1 gap-4">
              {/* Hamburger menu button - Minimum 44px touch target */}
              <button
                type="button"
                onClick={toggleSidebar}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-[#161616]"
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Search bar */}
              <div className="relative max-w-2xl flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search providers, services, or locations..."
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-teal-500 dark:focus:border-teal-400 transition-all ${
                    isSearchFocused
                      ? 'bg-white dark:bg-gray-800 border-teal-500 dark:border-teal-400'
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                  }`}
                  aria-label="Search"
                  aria-describedby="search-hint"
                  autoComplete="off"
                  spellCheck="false"
                />
                {!searchQuery && (
                  <kbd
                    id="search-hint"
                    className="absolute right-2 top-2 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 text-gray-500 dark:text-gray-400 pointer-events-none"
                    aria-label="Press Command K to focus search"
                  >
                    ⌘K
                  </kbd>
                )}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      searchInputRef.current?.focus()
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500 dark:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    aria-label="Clear search"
                  >
                    <span className="sr-only">Clear</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <button
                type="button"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="sr-only">Notifications</span>
              </button>
              <button
                type="button"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label="Help"
              >
                <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Link
                href={`/${locale}/docs`}
                className="text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:underline text-sm font-medium px-2"
              >
                Docs
              </Link>
              <button className="bg-teal-500 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Upgrade
              </button>
            </div>
          </div>
        </header>

        {/* Page content - Add padding for mobile bottom nav */}
        <main id="main-content" className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
