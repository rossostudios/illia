'use client'

import { motion } from 'framer-motion'
import { Home, MessageSquare, Search, Star, User } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDirectMessages } from '@/hooks/use-direct-messages'

type NavItem = {
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

  if (!isMobile) {
    return null
  }

  return (
    <motion.nav
      animate={{ y: isVisible ? 0 : 100 }}
      className="fixed right-0 bottom-0 left-0 z-40 border-gray-200 border-t bg-white md:hidden dark:border-gray-800 dark:bg-gray-900"
      initial={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid h-16 grid-cols-5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href.includes('explore') && pathname.includes('explore')) ||
            (item.href.includes('matches') && pathname.includes('matches'))

          return (
            <Link
              className={`relative flex flex-col items-center justify-center py-2 transition-colors ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              href={item.href}
              key={item.label}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="-translate-x-1/2 absolute top-0 left-1/2 h-0.5 w-12 bg-teal-600 dark:bg-teal-400"
                  layoutId="bottomNavIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <div className="relative">
                <item.icon className="h-5 w-5" />

                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <span className="-top-1 -right-1 absolute flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 font-bold text-white text-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span className="mt-1 text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Safe area for iPhones with notch */}
      <div className="h-safe-area-inset-bottom bg-white dark:bg-gray-900" />
    </motion.nav>
  )
}
