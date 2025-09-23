'use client'

import { Bell, HelpCircle, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import DashboardSidebar from '@/components/DashboardSidebar'
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center flex-1 gap-4">
              {/* Hamburger menu button */}
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Menu className="h-5 w-5 text-gray-600" />
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
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all ${
                    isSearchFocused ? 'bg-white border-teal-500' : 'bg-gray-50 border-gray-200'
                  }`}
                  aria-label="Search"
                  aria-describedby="search-hint"
                  autoComplete="off"
                  spellCheck="false"
                />
                {!searchQuery && (
                  <kbd
                    id="search-hint"
                    className="absolute right-2 top-2 text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-500 pointer-events-none"
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
                    className="absolute right-2 top-2 text-xs bg-gray-100 hover:bg-gray-200 rounded p-1 text-gray-500 transition-colors"
                    aria-label="Clear search"
                  >
                    <span className="sr-only">Clear</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Notifications"
              >
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
