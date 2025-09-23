'use client'

import {
  BarChart3,
  ChevronDown,
  CreditCard,
  Home,
  LogOut,
  Mail,
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
import { useDirectMessages } from '@/hooks/useDirectMessages'
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

  // Get unread message count
  const { conversations } = useDirectMessages()
  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unread_count, 0)

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
      icon: Mail,
      label: 'Messages',
      href: `/${locale}/dashboard/messages`,
      subtitle: 'Direct messages',
      badge: unreadCount, // Shows actual unread count
    },
    {
      icon: Users,
      label: 'Community',
      href: `/${locale}/dashboard/community`,
      subtitle: 'Expat forums',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      href: `/${locale}/dashboard/analytics`,
      subtitle: 'Insights & reports',
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
      className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div
        className={`border-b border-gray-200 dark:border-gray-800 flex items-center justify-center ${isCollapsed ? 'p-4' : 'p-6'}`}
      >
        <Link href={`/${locale}/dashboard`} className="block">
          <span
            className={`font-bold text-gray-900 dark:text-white transition-all hover:opacity-80 ${
              isCollapsed ? 'text-xl' : 'text-2xl'
            }`}
          >
            {isCollapsed ? 'I' : 'Illia'}
          </span>
        </Link>
      </div>

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
                } ${isActive ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
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
                  <div className="relative">
                    <item.icon
                      className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'} ${isActive ? 'text-teal-600 dark:text-teal-400' : ''}`}
                    />
                    {item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {item.badge > 0 && !isCollapsed && (
                          <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.subtitle}
                        </span>
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
                          ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
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
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  What&apos;s New (5)
                </span>
              </div>
              <button
                onClick={() => setShowWhatsNew(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              New: Medellín cleaners added!
            </p>
          </div>
        </div>
      )}

      {/* User section */}
      {!isCollapsed && (
        <div className="relative border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'G'}
                </span>
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {userEmail || 'Guest'}
              </span>
            </div>
            <ChevronDown
              className={`h-3 w-3 text-gray-500 dark:text-gray-400 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {showUserDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <Link
                href={`/${locale}/dashboard/settings`}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowUserDropdown(false)}
              >
                <User className="h-4 w-4" />
                <span>Account Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-t border-gray-100 dark:border-gray-700"
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
