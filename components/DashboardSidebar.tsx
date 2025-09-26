'use client'

import {
  BarChart3,
  Calendar,
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
import { TooltipWrapper } from '@/components/ui/Tooltip'
import { useDirectMessages } from '@/hooks/use-direct-messages'
import { supabase } from '@/utils/supabase/client'

type DashboardSidebarProps = {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  userEmail?: string | null
}

export default function DashboardSidebar({
  isCollapsed = false,
  onToggleCollapse,
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
      icon: Calendar,
      label: 'Bookings',
      href: `/${locale}/dashboard/bookings`,
      subtitle: 'Manage appointments',
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
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onToggleCollapse} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-gray-200 border-r bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${
          isCollapsed ? 'w-0 md:w-16' : 'w-64'
        } overflow-hidden md:overflow-visible`}
      >
        {/* Logo and Mobile Close Button */}
        <div
          className={`flex items-center border-gray-200 border-b dark:border-gray-800 ${
            isCollapsed ? 'justify-center p-4' : 'justify-between p-4 md:p-6'
          }`}
        >
          <Link className="block" href={`/${locale}/dashboard`} onClick={onToggleCollapse}>
            <span
              className={`font-bold text-gray-900 transition-all hover:opacity-80 dark:text-white ${
                isCollapsed ? 'hidden text-xl md:block' : 'text-2xl'
              }`}
            >
              {isCollapsed ? 'I' : 'Illia'}
            </span>
          </Link>
          {/* Mobile close button */}
          {!isCollapsed && (
            <button
              aria-label="Close menu"
              className="rounded-lg p-2 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
              onClick={onToggleCollapse}
              type="button"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 space-y-1 overflow-y-auto pt-3 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {sidebarItems.map((item) => {
            const isActive = ('hasSubmenu' in item && item.hasSubmenu) ? pathname.includes(item.href) : pathname === item.href

            const linkElement = (
              <Link
                className={`flex items-center justify-between rounded-lg font-medium text-sm transition-colors ${
                  isCollapsed ? 'px-2 py-2' : 'px-3 py-2'
                } ${isActive ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
                href={item.href}
                onClick={(e) => {
                  if ('hasSubmenu' in item && item.hasSubmenu && !isCollapsed) {
                    e.preventDefault()
                    setShowExtractMenu(!showExtractMenu)
                  } else if (window.innerWidth < 768) {
                    // Close sidebar on mobile after navigation
                    onToggleCollapse?.()
                  }
                }}
              >
                <div
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                >
                  <div className="relative">
                    <item.icon
                      className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'} ${isActive ? 'text-teal-600 dark:text-teal-400' : ''}`}
                    />
                    {item.badge && item.badge > 0 && (
                      <span className="-top-1 -right-1 absolute flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 font-bold text-white text-xs">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {item.badge && item.badge > 0 && !isCollapsed && (
                          <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 font-bold text-white text-xs">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <span className="mt-0.5 text-gray-500 text-xs dark:text-gray-400">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {'hasSubmenu' in item && item.hasSubmenu && !isCollapsed ? (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${'isOpen' in item && item.isOpen ? 'rotate-180' : ''}`}
                  />
                ) : null}
              </Link>
            )

            return (
              <div key={item.label}>
                {isCollapsed ? (
                  <TooltipWrapper content={item.label} delay={300} position="right">
                    {linkElement}
                  </TooltipWrapper>
                ) : (
                  linkElement
                )}
                {'hasSubmenu' in item && item.hasSubmenu && 'isOpen' in item && item.isOpen && !isCollapsed ? (
                  <div className="mt-1 ml-7 space-y-1">
                    {'submenu' in item && (item.submenu as any[])?.map((subitem: any) => (
                      <Link
                        className={`block rounded-lg px-3 py-2 text-sm ${
                          pathname === subitem.href
                            ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                        }`}
                        href={subitem.href}
                        key={subitem.label}
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        {/* What's New */}
        {showWhatsNew && !isCollapsed && (
          <div className="px-4 pb-3">
            <div className="rounded-lg bg-teal-50 p-3 dark:bg-teal-900/20">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span className="font-semibold text-teal-600 text-xs dark:text-teal-400">
                    What&apos;s New (5)
                  </span>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  onClick={() => setShowWhatsNew(false)}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-gray-700 text-xs dark:text-gray-300">
                New: Medellín cleaners added!
              </p>
            </div>
          </div>
        )}

        {/* User section */}
        {isCollapsed ? (
          <div className="border-gray-200 border-t p-2 dark:border-gray-800">
            <TooltipWrapper content="Sign Out" delay={300} position="right">
              <button
                className="flex w-full items-center justify-center rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                onClick={handleLogout}
                type="button"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </TooltipWrapper>
          </div>
        ) : (
          <div className="relative border-gray-200 border-t bg-white dark:border-gray-800 dark:bg-gray-900">
            <button
              className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              type="button"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                  <span className="font-medium text-teal-600 text-xs dark:text-teal-400">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : 'G'}
                  </span>
                </div>
                <span className="text-gray-700 text-xs dark:text-gray-300">
                  {userEmail || 'Guest'}
                </span>
              </div>
              <ChevronDown
                className={`h-3 w-3 text-gray-500 transition-transform dark:text-gray-400 ${showUserDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 bottom-full left-0 mb-1 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-950">
                <Link
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  href={`/${locale}/dashboard/settings`}
                  onClick={() => setShowUserDropdown(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Account Settings</span>
                </Link>
                <button
                  className="flex w-full items-center space-x-2 border-gray-100 border-t px-4 py-2 text-red-600 text-sm hover:bg-red-50 dark:border-gray-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={handleLogout}
                  type="button"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
