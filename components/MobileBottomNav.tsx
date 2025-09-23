'use client'

import { motion } from 'framer-motion'
import { Home, MessageSquare, Search, Star, User } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDirectMessages } from '@/hooks/useDirectMessages'

interface NavItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  badge?: number
}

export default function MobileBottomNav() {
  const pathname = usePathname()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Get unread message count
  const { conversations } = useDirectMessages()
  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unread_count, 0)

  const navItems: NavItem[] = [
    {
      icon: Home,
      label: 'Home',
      href: `/${locale}/dashboard`,
    },
    {
      icon: Search,
      label: 'Explore',
      href: `/${locale}/dashboard/explore`,
    },
    {
      icon: Star,
      label: 'Matches',
      href: `/${locale}/dashboard/matches`,
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      href: `/${locale}/dashboard/messages`,
      badge: unreadCount,
    },
    {
      icon: User,
      label: 'Profile',
      href: `/${locale}/dashboard/profile`,
    },
  ]

  // Hide/show on scroll for better UX
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true) // Show when scrolling up or at top
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false) // Hide when scrolling down
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Only show on mobile devices
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile) return null

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href.includes('explore') && pathname.includes('explore')) ||
            (item.href.includes('matches') && pathname.includes('matches'))

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-2 transition-colors ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-teal-600 dark:bg-teal-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <div className="relative">
                <item.icon className="h-5 w-5" />

                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Safe area for iPhones with notch */}
      <div className="h-safe-area-inset-bottom bg-white dark:bg-gray-900" />
    </motion.nav>
  )
}
