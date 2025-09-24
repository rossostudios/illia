'use client'

import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { Home, MessageSquare, Plus, Search, Star, User } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDirectMessages } from '@/hooks/use-direct-messages'

type NavItem = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  badge?: number
}

export default function MobileBottomNavEnhanced() {
  const pathname = usePathname()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showFab, setShowFab] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, 100], [1, 0])

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

  // Enhanced scroll behavior with touch gestures
  useEffect(() => {
    let touchStartY = 0
    let touchEndY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.changedTouches[0].screenY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].screenY
      handleSwipe()
    }

    const handleSwipe = () => {
      const swipeThreshold = 75 // Increased from 50 to prevent accidental triggers
      const diff = touchStartY - touchEndY

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swiped up - hide nav
          setIsVisible(false)
        } else {
          // Swiped down - show nav
          setIsVisible(true)
        }
      }
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsVisible(true)
        setShowFab(false)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
        setShowFab(true)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
        setShowFab(false)
      }

      setLastScrollY(currentScrollY)
      y.set(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [lastScrollY, y])

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
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {showFab && (
          <motion.button
            animate={{ scale: 1, opacity: 1 }}
            aria-label="Quick action"
            className="fixed right-6 bottom-20 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg dark:bg-teal-500"
            exit={{ scale: 0, opacity: 0 }}
            initial={{ scale: 0, opacity: 0 }}
            onClick={() => setIsVisible(true)}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Enhanced Bottom Navigation */}
      <motion.nav
        animate={{ y: isVisible ? 0 : 100 }}
        className="safe-area-padding fixed right-0 bottom-0 left-0 z-50 border-gray-200 border-t bg-white shadow-lg backdrop-blur-lg md:hidden dark:border-gray-700 dark:bg-gray-900"
        initial={{ y: 0 }}
        ref={navRef}
        style={{ opacity }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 500,
        }}
      >
        {/* Pull indicator for gesture hint */}
        <div className="-top-1 -translate-x-1/2 absolute left-1/2 h-1 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />

        <div className="relative grid h-[60px] grid-cols-5 items-center">
          {navItems.map((item, _index) => {
            const isActive =
              pathname === item.href ||
              (item.href.includes('explore') && pathname.includes('explore')) ||
              (item.href.includes('matches') && pathname.includes('matches'))

            return (
              <Link
                className="relative flex h-full touch-manipulation flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95"
                href={item.href}
                key={item.label}
              >
                {/* Ripple effect container */}
                <motion.div
                  className={`relative flex flex-col items-center justify-center ${
                    isActive
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  whileTap={{ scale: 0.85 }}
                >
                  {/* Active indicator with animation */}
                  {isActive && (
                    <motion.div
                      className="-top-2 absolute h-0.5 w-12 rounded-full bg-teal-600 dark:bg-teal-400"
                      layoutId="bottomNavIndicator"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                        mass: 0.5,
                      }}
                    />
                  )}

                  {/* Icon container with badge */}
                  <div className="relative">
                    <motion.div
                      animate={isActive ? { y: -2 } : { y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${isActive ? 'stroke-2' : ''}`}
                      />
                    </motion.div>

                    {/* Enhanced Badge with pulse animation */}
                    {item.badge && item.badge > 0 && (
                      <motion.span
                        animate={{ scale: 1 }}
                        className="-top-1 -right-1 absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 font-bold text-[10px] text-white"
                        initial={{ scale: 0 }}
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                        {item.badge > 0 && (
                          <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75" />
                        )}
                      </motion.span>
                    )}
                  </div>

                  {/* Label with fade animation */}
                  <motion.span
                    animate={isActive ? { opacity: 1 } : { opacity: 0.7 }}
                    className="mt-0.5 font-medium text-[11px] sm:text-xs"
                  >
                    {item.label}
                  </motion.span>
                </motion.div>

                {/* Touch feedback overlay */}
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  whileTap={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                />
              </Link>
            )
          })}
        </div>

        {/* Safe area padding for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-transparent" />
      </motion.nav>
    </>
  )
}
