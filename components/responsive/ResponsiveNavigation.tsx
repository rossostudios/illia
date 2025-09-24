'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Bell, ChevronDown, Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { mediaQueries, useMediaQuery, useResponsive } from '@/hooks/use-responsive'

type NavItem = {
  id: string
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
  badge?: number | string
}

type ResponsiveNavigationProps = {
  logo?: React.ReactNode
  items: NavItem[]
  actions?: React.ReactNode
  variant?: 'fixed' | 'sticky' | 'static'
  behavior?: 'hide-on-scroll' | 'shrink-on-scroll' | 'always-visible'
  className?: string
}

export function ResponsiveNavigation({
  logo,
  items,
  actions,
  variant = 'sticky',
  behavior = 'always-visible',
  className = '',
}: ResponsiveNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const { viewport, isMobile, isTablet, isDesktop } = useResponsive()
  const prefersReducedMotion = useMediaQuery(mediaQueries.prefersReducedMotion)
  const pathname = usePathname()

  const { scrollY } = useScroll()
  const lastScrollY = useRef(0)
  const navRef = useRef<HTMLElement>(null)

  // Handle scroll behavior
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (behavior === 'hide-on-scroll') {
      const isScrollingDown = latest > lastScrollY.current && latest > 100
      const isScrollingUp = latest < lastScrollY.current

      if (isScrollingDown && isVisible) {
        setIsVisible(false)
      } else if (isScrollingUp && !isVisible) {
        setIsVisible(true)
      }
    }

    if (behavior === 'shrink-on-scroll' || behavior === 'hide-on-scroll') {
      setIsScrolled(latest > 50)
    }

    lastScrollY.current = latest
  })

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
    setActiveDropdown(null)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setActiveDropdown(null)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (isOpen && isMobile()) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, isMobile])

  const navHeight = isScrolled && behavior === 'shrink-on-scroll' ? 60 : 80

  // Navigation variants
  const navVariants = {
    visible: {
      y: 0,
      height: navHeight,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    hidden: {
      y: -100,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  }

  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: 'easeInOut',
      },
    },
    open: {
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: 'easeInOut',
      },
    },
  }

  const dropdownVariants = {
    closed: {
      opacity: 0,
      y: -10,
      height: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: {
        duration: 0.2,
      },
    },
  }

  // Render navigation item
  const renderNavItem = (item: NavItem, isMobileView = false) => {
    const hasChildren = item.children && item.children.length > 0
    const isActive = pathname === item.href
    const isDropdownOpen = activeDropdown === item.id

    if (isMobileView) {
      return (
        <div className="w-full" key={item.id}>
          <button
            className={`flex w-full items-center justify-between p-4 font-medium text-fluid-base ${isActive ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300'}hover:bg-gray-50 transition-colors duration-200 dark:hover:bg-gray-800`}
            onClick={() => {
              if (item.href && !hasChildren) {
                // Navigate to href
                window.location.href = item.href
              } else if (hasChildren) {
                setActiveDropdown(isDropdownOpen ? null : item.id)
              }
            }}
            type="button"
          >
            <div className="flex items-center gap-3">
              {item.icon && <item.icon className="h-5 w-5" />}
              <span>{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-white text-xs">
                  {item.badge}
                </span>
              )}
            </div>
            {hasChildren && (
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            )}
          </button>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {hasChildren && isDropdownOpen && (
              <motion.div
                animate="open"
                className="bg-gray-50 dark:bg-gray-900"
                exit="closed"
                initial="closed"
                variants={dropdownVariants}
              >
                {item.children?.map((child) => (
                  <Link
                    className="block py-3 pr-4 pl-12 text-fluid-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    href={child.href || '#'}
                    key={child.id}
                  >
                    {child.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    }

    // Desktop navigation item
    return (
      <div className="relative" key={item.id}>
        {item.href && !hasChildren ? (
          <Link
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-fluid-sm ${isActive ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300'}hover:bg-gray-100 transition-all duration-200 dark:hover:bg-gray-800`}
            href={item.href}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-white text-xs">
                {item.badge}
              </span>
            )}
          </Link>
        ) : hasChildren ? (
          <>
            <button
              className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-fluid-sm text-gray-700 transition-all duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setActiveDropdown(isDropdownOpen ? null : item.id)}
              onMouseEnter={() => isDesktop() && setActiveDropdown(item.id)}
              type="button"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.label}</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Desktop dropdown */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  animate="open"
                  className="absolute top-full left-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
                  exit="closed"
                  initial="closed"
                  onMouseLeave={() => isDesktop() && setActiveDropdown(null)}
                  variants={dropdownVariants}
                >
                  {item.children?.map((child) => (
                    <Link
                      className="block px-4 py-3 text-fluid-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                      href={child.href || '#'}
                      key={child.id}
                    >
                      <div className="flex items-center gap-3">
                        {child.icon && <child.icon className="h-4 w-4" />}
                        <span>{child.label}</span>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : null}
      </div>
    )
  }

  return (
    <>
      <motion.nav
        animate={behavior === 'hide-on-scroll' ? (isVisible ? 'visible' : 'hidden') : 'visible'}
        className={`
          ${variant === 'fixed' ? 'fixed' : variant === 'sticky' ? 'sticky' : 'relative'}top-0 right-0 left-0 z-40 border-gray-200 border-b bg-white/95 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/95 ${className}
        `}
        initial="visible"
        ref={navRef}
        style={{ height: navHeight }}
        variants={navVariants}
      >
        <div className="container-responsive mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-full items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              {logo && (
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{
                      scale: isScrolled && behavior === 'shrink-on-scroll' ? 0.85 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {logo}
                  </motion.div>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            {isDesktop() && (
              <div className="hidden items-center gap-2 lg:flex">
                {items.map((item) => renderNavItem(item))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search button */}
              <button
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                type="button"
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Notifications */}
              <button
                className="relative rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                type="button"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* Custom actions */}
              {actions}

              {/* Mobile menu toggle */}
              {!isDesktop() && (
                <button
                  aria-label={isOpen ? 'Close menu' : 'Open menu'}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                >
                  {isOpen ? (
                    <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {!isDesktop() && (
        <>
          {/* Backdrop */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-40 bg-black/50"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Menu panel */}
          <motion.div
            animate={isOpen ? 'open' : 'closed'}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] overflow-y-auto bg-white shadow-2xl dark:bg-gray-900"
            initial="closed"
            variants={menuVariants}
          >
            {/* Menu header */}
            <div className="flex items-center justify-between border-gray-200 border-b p-4 dark:border-gray-800">
              <h2 className="font-semibold text-fluid-lg text-gray-900 dark:text-white">Menu</h2>
              <button
                className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Menu items */}
            <div className="py-2">{items.map((item) => renderNavItem(item, true))}</div>
          </motion.div>
        </>
      )}

      {/* Spacer for fixed/sticky nav */}
      {variant !== 'static' && <div style={{ height: navHeight }} />}
    </>
  )
}
