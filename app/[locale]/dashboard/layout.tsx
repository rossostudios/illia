'use client'

import { Bell, HelpCircle, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import DashboardSidebar from '@/components/DashboardSidebar'
import MobileBottomNavEnhanced from '@/components/MobileBottomNavEnhanced'
import SearchResults from '@/components/SearchResults'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useSession } from '@/hooks/use-session'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
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

    // Show/hide search results based on query
    if (value.trim()) {
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
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
      {/* Sidebar - Responsive */}
      <DashboardSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        userEmail={user?.email}
      />

      {/* Main content area with responsive margin */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        } ml-0`}
      >
        {/* Top navigation bar */}
        <header className="sticky top-0 z-30 border-gray-200 border-b bg-white px-3 py-3 sm:px-4 sm:py-4 md:px-8 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex flex-1 items-center gap-2 sm:gap-4">
              {/* Hamburger menu button - Always visible */}
              <button
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 md:min-h-[44px] md:min-w-[44px] dark:focus:ring-teal-400 dark:focus:ring-offset-[#161616] dark:hover:bg-gray-800/50"
                onClick={toggleSidebar}
                type="button"
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Search bar - Hidden on mobile, replaced with search icon */}
              <div className="relative hidden max-w-4xl flex-1 sm:block">
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
                  onBlur={() => {
                    setIsSearchFocused(false)
                    // Delay hiding results to allow clicking on them
                    setTimeout(() => {
                      setShowSearchResults(false)
                    }, 200)
                  }}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true)
                    if (searchQuery.trim()) {
                      setShowSearchResults(true)
                    }
                  }}
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
                      setShowSearchResults(false)
                      searchInputRef.current?.focus()
                    }}
                    type="button"
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
                {/* Search Results Dropdown */}
                <SearchResults
                  isOpen={showSearchResults}
                  locale={locale}
                  onClose={() => setShowSearchResults(false)}
                  query={searchQuery}
                />
              </div>
            </div>
            {/* Mobile search icon - positioned correctly */}
            <button
              aria-label="Search"
              className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:hidden dark:focus:ring-offset-gray-900 dark:hover:bg-gray-800"
              onClick={() => searchInputRef.current?.focus()}
              type="button"
            >
              <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <ThemeToggle />
              <button
                aria-label="Notifications"
                className="hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:flex dark:focus:ring-offset-gray-900 dark:hover:bg-gray-800"
                type="button"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="sr-only">Notifications</span>
              </button>
              <button
                aria-label="Help"
                className="hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:flex dark:focus:ring-offset-gray-900 dark:hover:bg-gray-800"
                type="button"
              >
                <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Link
                className="hidden px-2 font-medium text-gray-800 text-sm hover:text-teal-600 hover:underline md:inline-block dark:text-gray-200 dark:hover:text-teal-400"
                href={`/${locale}/docs`}
              >
                Docs
              </Link>
              <button
                className="rounded-lg bg-teal-500 px-3 py-1.5 font-medium text-white text-xs shadow-sm transition-colors hover:bg-teal-600 sm:px-4 sm:text-sm dark:bg-teal-600 dark:hover:bg-teal-700"
                type="button"
              >
                Upgrade
              </button>
            </div>
          </div>
        </header>

        {/* Breadcrumbs - Hidden on mobile */}
        <div className="hidden border-gray-200 border-b bg-gray-50 px-4 py-2 sm:block md:px-8 dark:border-gray-800 dark:bg-gray-900/50">
          <Breadcrumbs />
        </div>

        {/* Page content - Add padding for mobile bottom nav */}
        <main
          className="flex-1 overflow-y-auto p-3 pb-28 sm:p-4 sm:pb-24 md:p-8 md:pb-8"
          id="main-content"
        >
          {children}
        </main>
      </div>

      {/* Enhanced Mobile Bottom Navigation */}
      <MobileBottomNavEnhanced />
    </div>
  )
}
