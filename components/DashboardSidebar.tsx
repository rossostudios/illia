'use client'

import {
  ChevronDown,
  CreditCard,
  Globe,
  Home,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  Star,
  User,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'

interface DashboardSidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  userEmail?: string | null
}

export default function DashboardSidebar({
  isCollapsed = false,
  userEmail,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const [showExtractMenu, setShowExtractMenu] = useState(pathname.includes('/extract'))
  const [showWhatsNew, setShowWhatsNew] = useState(true)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push(`/${locale}/login`)
  }

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', href: `/${locale}/dashboard`, subtitle: 'Your home base' },
    {
      icon: Search,
      label: 'Explore',
      href: `/${locale}/dashboard/explore`,
      subtitle: 'Discover matches',
    },
    {
      icon: Users,
      label: 'Directory',
      href: `/${locale}/dashboard/directory`,
      subtitle: 'Browse providers',
    },
    {
      icon: Star,
      label: 'My Matches',
      href: `/${locale}/dashboard/matches`,
      subtitle: 'Reviews & intros',
    },
    {
      icon: MessageSquare,
      label: 'Community',
      href: `/${locale}/dashboard/community`,
      subtitle: 'Expat forums',
    },
    {
      icon: CreditCard,
      label: 'Membership',
      href: `/${locale}/dashboard/membership`,
      subtitle: 'Tier & benefits',
    },
    {
      icon: Settings,
      label: 'Profile',
      href: `/${locale}/dashboard/profile`,
      subtitle: 'Account & settings',
    },
  ]

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-white border-r flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`border-b ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <Link href={`/${locale}/dashboard`} className="flex items-center space-x-2 group">
          <div className="flex flex-col">
            <span
              className={`font-bold text-teal-600 drop-shadow-sm transition-all group-hover:text-teal-700 group-hover:drop-shadow-md ${
                isCollapsed ? 'text-lg' : 'text-xl md:text-2xl'
              }`}
            >
              {isCollapsed ? 'I' : 'Illia.club'}
            </span>
            {!isCollapsed && (
              <span className="text-xs text-gray-500 mt-0.5">Your Expat Lifeline</span>
            )}
          </div>
        </Link>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Find cleaners in El Poblado..."
              className="w-full pl-9 pr-3 py-2 bg-warmth-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <kbd className="absolute right-2 top-2 text-xs bg-white border rounded px-1">⌘K</kbd>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`space-y-1 flex-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {sidebarItems.map((item) => {
          const isActive = item.hasSubmenu ? pathname.includes(item.href) : pathname === item.href

          return (
            <div key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center justify-between rounded-lg text-sm font-medium transition-colors ${
                  isCollapsed ? 'px-2 py-2' : 'px-3 py-2'
                } ${isActive ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={(e) => {
                  if (item.hasSubmenu && !isCollapsed) {
                    e.preventDefault()
                    setShowExtractMenu(!showExtractMenu)
                  }
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <div
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                >
                  <item.icon
                    className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'} ${isActive ? 'text-teal-600' : ''}`}
                  />
                  {!isCollapsed && (
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      {item.subtitle && (
                        <span className="text-xs text-gray-500 mt-0.5">{item.subtitle}</span>
                      )}
                    </div>
                  )}
                </div>
                {item.hasSubmenu && !isCollapsed && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${item.isOpen ? 'rotate-180' : ''}`}
                  />
                )}
              </Link>
              {item.hasSubmenu && item.isOpen && !isCollapsed && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.submenu?.map((subitem) => (
                    <Link
                      key={subitem.label}
                      href={subitem.href}
                      className={`block px-3 py-2 text-sm rounded-lg ${
                        pathname === subitem.href
                          ? 'text-teal-600 bg-teal-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* What's New */}
      {showWhatsNew && !isCollapsed && (
        <div className="px-4 pb-3">
          <div className="bg-teal-50 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <span className="text-xs font-semibold text-teal-600">What&apos;s New (5)</span>
              </div>
              <button
                onClick={() => setShowWhatsNew(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-gray-600">New: Medellín cleaners added!</p>
          </div>
        </div>
      )}

      {/* User section */}
      {!isCollapsed && (
        <div className="relative border-t bg-white">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-teal-600">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'G'}
                </span>
              </div>
              <span className="text-xs text-gray-700">{userEmail || 'Guest'}</span>
            </div>
            <ChevronDown
              className={`h-3 w-3 text-gray-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {showUserDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              <Link
                href={`/${locale}/dashboard/settings`}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowUserDropdown(false)}
              >
                <User className="h-4 w-4" />
                <span>Account Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
