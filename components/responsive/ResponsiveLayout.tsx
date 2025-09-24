'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { breakpoints, useResponsive } from '@/hooks/use-responsive'

// Layout context for sharing layout state
type LayoutContextType = {
  layout: 'mobile' | 'tablet' | 'desktop' | 'wide'
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  mainColumnWidth: number
  sidebarWidth: number
}

const LayoutContext = createContext<LayoutContextType>({
  layout: 'desktop',
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  mainColumnWidth: 0,
  sidebarWidth: 280,
})

export const useLayout = () => useContext(LayoutContext)

// Main responsive layout provider
type ResponsiveLayoutProps = {
  children: ReactNode
  sidebar?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  rightPanel?: ReactNode
  mobileNav?: ReactNode
  className?: string
}

export function ResponsiveLayout({
  children,
  sidebar,
  header,
  footer,
  rightPanel,
  mobileNav,
  className = '',
}: ResponsiveLayoutProps) {
  const { viewport, isMobile, isTablet, isDesktop } = useResponsive()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  // Determine layout type based on viewport
  const getLayoutType = () => {
    if (viewport.width < breakpoints.sm) {
      return 'mobile'
    }
    if (viewport.width < breakpoints.lg) {
      return 'tablet'
    }
    if (viewport.width < breakpoints['2xl']) {
      return 'desktop'
    }
    return 'wide'
  }

  const layout = getLayoutType()

  // Calculate dynamic widths
  const getSidebarWidth = () => {
    if (layout === 'mobile') {
      return 0
    }
    if (layout === 'tablet') {
      return sidebarCollapsed ? 60 : 200
    }
    if (layout === 'desktop') {
      return sidebarCollapsed ? 80 : 280
    }
    return sidebarCollapsed ? 80 : 320
  }

  const getMainColumnWidth = () => {
    if (layout === 'mobile') {
      return viewport.width
    }
    const sidebarW = getSidebarWidth()
    const rightPanelW = rightPanel && layout === 'wide' ? 320 : 0
    return viewport.width - sidebarW - rightPanelW
  }

  const sidebarWidth = getSidebarWidth()
  const mainColumnWidth = getMainColumnWidth()

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    if (layout === 'tablet' && !sidebarCollapsed) {
      setSidebarCollapsed(true)
    } else if (layout === 'desktop' && sidebarCollapsed) {
      setSidebarCollapsed(false)
    }
  }, [layout, sidebarCollapsed])

  // Layout configurations
  const layoutConfigs = {
    mobile: {
      gridTemplate: `
        "header" auto
        "main" 1fr
        "nav" auto
      `,
      gridColumns: '1fr',
    },
    tablet: {
      gridTemplate: `
        "sidebar header" auto
        "sidebar main" 1fr
        "sidebar footer" auto
      `,
      gridColumns: `${sidebarWidth}px 1fr`,
    },
    desktop: {
      gridTemplate: `
        "sidebar header header" auto
        "sidebar main main" 1fr
        "sidebar footer footer" auto
      `,
      gridColumns: `${sidebarWidth}px 1fr`,
    },
    wide: {
      gridTemplate: `
        "sidebar header right" auto
        "sidebar main right" 1fr
        "sidebar footer right" auto
      `,
      gridColumns: `${sidebarWidth}px 1fr ${rightPanel ? '320px' : '0'}`,
    },
  }

  const currentConfig = layoutConfigs[layout]

  return (
    <LayoutContext.Provider
      value={{
        layout,
        sidebarCollapsed,
        setSidebarCollapsed,
        mainColumnWidth,
        sidebarWidth,
      }}
    >
      <div
        className={`responsive-layout min-h-screen ${className}`}
        style={{
          display: 'grid',
          gridTemplate: currentConfig.gridTemplate,
          gridTemplateColumns: currentConfig.gridColumns,
          gridTemplateRows: 'auto 1fr auto',
          height: '100vh',
          transition: 'grid-template-columns 0.3s ease',
        }}
      >
        {/* Header */}
        {header && (
          <motion.header
            animate={{ y: 0 }}
            className="z-30 border-gray-200 border-b bg-white dark:border-gray-800 dark:bg-gray-900"
            initial={{ y: -100 }}
            style={{ gridArea: 'header' }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            {header}
          </motion.header>
        )}

        {/* Sidebar - Desktop/Tablet */}
        {sidebar && layout !== 'mobile' && (
          <motion.aside
            animate={{ x: 0, width: sidebarWidth }}
            className="z-20 overflow-y-auto border-gray-200 border-r bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
            initial={{ x: -sidebarWidth }}
            style={{ gridArea: 'sidebar' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1 }}
                className="h-full"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key={sidebarCollapsed ? 'collapsed' : 'expanded'}
                transition={{ duration: 0.2 }}
              >
                {sidebar}
              </motion.div>
            </AnimatePresence>
          </motion.aside>
        )}

        {/* Mobile Sidebar Overlay */}
        {sidebar && layout === 'mobile' && (
          <AnimatePresence>
            {showMobileSidebar && (
              <>
                <motion.div
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-40 bg-black/50"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  onClick={() => setShowMobileSidebar(false)}
                />
                <motion.aside
                  animate={{ x: 0 }}
                  className="fixed top-0 bottom-0 left-0 z-50 w-72 overflow-y-auto bg-white shadow-xl dark:bg-gray-900"
                  exit={{ x: -280 }}
                  initial={{ x: -280 }}
                  transition={{ type: 'spring', damping: 25 }}
                >
                  {sidebar}
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        )}

        {/* Main Content */}
        <main className="overflow-y-auto bg-gray-50 dark:bg-gray-950" style={{ gridArea: 'main' }}>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Right Panel - Wide screens only */}
        {rightPanel && layout === 'wide' && (
          <motion.aside
            animate={{ x: 0 }}
            className="overflow-y-auto border-gray-200 border-l bg-white dark:border-gray-800 dark:bg-gray-900"
            initial={{ x: 320 }}
            style={{ gridArea: 'right' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {rightPanel}
          </motion.aside>
        )}

        {/* Footer */}
        {footer && layout !== 'mobile' && (
          <footer
            className="border-gray-200 border-t bg-white dark:border-gray-800 dark:bg-gray-900"
            style={{ gridArea: 'footer' }}
          >
            {footer}
          </footer>
        )}

        {/* Mobile Navigation */}
        {mobileNav && layout === 'mobile' && (
          <nav
            className="border-gray-200 border-t bg-white dark:border-gray-800 dark:bg-gray-900"
            style={{ gridArea: 'nav' }}
          >
            {mobileNav}
          </nav>
        )}

        {/* Mobile menu button */}
        {layout === 'mobile' && sidebar && (
          <button
            className="fixed right-6 bottom-24 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg"
            onClick={() => setShowMobileSidebar(true)}
            type="button"
          >
            <svg
              aria-label="icon"
              className="h-6 w-6"
              fill="none"
              role="img"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Icon</title>
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        )}
      </div>
    </LayoutContext.Provider>
  )
}

// Responsive columns component
type ResponsiveColumnsProps = {
  children: ReactNode[]
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  stackOn?: 'mobile' | 'tablet' | 'never'
  reverse?: boolean
  className?: string
}

export function ResponsiveColumns({
  children,
  columns = { xs: 1, sm: 1, md: 2, lg: 3 },
  gap = 20,
  stackOn = 'mobile',
  reverse = false,
  className = '',
}: ResponsiveColumnsProps) {
  const { viewport, getBreakpointValue } = useResponsive()

  const shouldStack = () => {
    if (stackOn === 'never') {
      return false
    }
    if (stackOn === 'mobile') {
      return viewport.width < breakpoints.sm
    }
    if (stackOn === 'tablet') {
      return viewport.width < breakpoints.lg
    }
    return false
  }

  const columnCount = shouldStack() ? 1 : getBreakpointValue(columns) || 1

  const childArray = Array.isArray(children) ? children : [children]
  const orderedChildren = reverse ? [...childArray].reverse() : childArray

  if (shouldStack()) {
    return (
      <div className={`flex flex-col gap-${gap} ${className}`}>
        {orderedChildren.map((child, index) => (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: reverse ? 20 : -20 }}
            key={index}
            transition={{ delay: index * 0.1 }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {orderedChildren.map((child, index) => (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          key={index}
          transition={{ delay: index * 0.05 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

// Adaptive component that switches between different layouts
type AdaptiveComponentProps = {
  mobile: ReactNode
  tablet?: ReactNode
  desktop: ReactNode
  wide?: ReactNode
}

export function AdaptiveComponent({ mobile, tablet, desktop, wide }: AdaptiveComponentProps) {
  const { layout } = useLayout()

  const getComponent = () => {
    switch (layout) {
      case 'mobile':
        return mobile
      case 'tablet':
        return tablet || desktop
      case 'desktop':
        return desktop
      case 'wide':
        return wide || desktop
      default:
        return desktop
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        key={layout}
        transition={{ duration: 0.2 }}
      >
        {getComponent()}
      </motion.div>
    </AnimatePresence>
  )
}

// Show/Hide based on viewport
type ResponsiveVisibilityProps = {
  children: ReactNode
  show?: 'mobile' | 'tablet' | 'desktop' | 'wide'
  hide?: 'mobile' | 'tablet' | 'desktop' | 'wide'
  showAbove?: 'sm' | 'md' | 'lg' | 'xl'
  showBelow?: 'sm' | 'md' | 'lg' | 'xl'
}

export function ResponsiveVisibility({
  children,
  show,
  hide,
  showAbove,
  showBelow,
}: ResponsiveVisibilityProps) {
  const { viewport } = useResponsive()
  const { layout } = useLayout()

  const isVisible = () => {
    if (show && layout !== show) {
      return false
    }
    if (hide && layout === hide) {
      return false
    }
    if (showAbove && viewport.width < breakpoints[showAbove]) {
      return false
    }
    if (showBelow && viewport.width >= breakpoints[showBelow]) {
      return false
    }
    return true
  }

  if (!isVisible()) {
    return null
  }

  return <>{children}</>
}
