'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

// Breakpoint configuration matching Tailwind CSS
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

// Device types for more semantic usage
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'wide'

type ViewportInfo = {
  width: number
  height: number
  breakpoint: Breakpoint
  deviceType: DeviceType
  orientation: 'portrait' | 'landscape'
  isTouch: boolean
  pixelRatio: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isRetina: boolean
}

type ResponsiveConfig = {
  debounce?: number
  enableOrientationDetection?: boolean
  enableTouchDetection?: boolean
  enablePixelRatioDetection?: boolean
}

// Custom hook for comprehensive responsive design
export function useResponsive(config: ResponsiveConfig = {}) {
  const {
    debounce = 150,
    enableOrientationDetection = true,
    enableTouchDetection = true,
    enablePixelRatioDetection = true,
  } = config

  const [viewport, setViewport] = useState<ViewportInfo>(() => getViewportInfo())

  // Memoized getters for common checks
  const queries = useMemo(
    () => ({
      isMobileOnly: () => viewport.width < breakpoints.sm,
      isMobileOrTablet: () => viewport.width < breakpoints.lg,
      isTabletOnly: () => viewport.width >= breakpoints.sm && viewport.width < breakpoints.lg,
      isDesktopOrWide: () => viewport.width >= breakpoints.lg,
      isWideOnly: () => viewport.width >= breakpoints['2xl'],
      isPortrait: () => viewport.orientation === 'portrait',
      isLandscape: () => viewport.orientation === 'landscape',
      isHighDPI: () => viewport.pixelRatio >= 2,
      matchesBreakpoint: (bp: Breakpoint) => viewport.breakpoint === bp,
      isAbove: (bp: Breakpoint) => viewport.width >= breakpoints[bp],
      isBelow: (bp: Breakpoint) => viewport.width < breakpoints[bp],
      isBetween: (min: Breakpoint, max: Breakpoint) =>
        viewport.width >= breakpoints[min] && viewport.width < breakpoints[max],
    }),
    [viewport]
  )

  // Debounced resize handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setViewport(getViewportInfo())
      }, debounce)
    }

    const handleOrientationChange = () => {
      setViewport(getViewportInfo())
    }

    window.addEventListener('resize', handleResize, { passive: true })

    if (enableOrientationDetection) {
      window.addEventListener('orientationchange', handleOrientationChange)
    }

    // Update on mount to ensure correct initial state
    setViewport(getViewportInfo())

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      if (enableOrientationDetection) {
        window.removeEventListener('orientationchange', handleOrientationChange)
      }
    }
  }, [debounce, enableOrientationDetection])

  return {
    viewport,
    ...queries,
    // Utility functions
    getBreakpointValue: <T>(values: Partial<Record<Breakpoint, T>>): T | undefined => {
      const breakpointOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs']

      for (const bp of breakpointOrder) {
        if (viewport.width >= breakpoints[bp] && values[bp] !== undefined) {
          return values[bp]
        }
      }

      return values.xs
    },

    // Container query helper
    containerClass: (classes: Partial<Record<Breakpoint, string>>): string => {
      const classList: string[] = []

      Object.entries(classes).forEach(([bp, className]) => {
        if (viewport.width >= breakpoints[bp as Breakpoint]) {
          classList.push(className)
        }
      })

      return classList.join(' ')
    },
  }
}

// Helper function to get current viewport information
function getViewportInfo(): ViewportInfo {
  if (typeof window === 'undefined') {
    return {
      width: 1024,
      height: 768,
      breakpoint: 'lg',
      deviceType: 'desktop',
      orientation: 'landscape',
      isTouch: false,
      pixelRatio: 1,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isRetina: false,
    }
  }

  const width = window.innerWidth
  const height = window.innerHeight
  const pixelRatio = window.devicePixelRatio || 1

  // Determine breakpoint
  let breakpoint: Breakpoint = 'xs'
  const breakpointEntries = Object.entries(breakpoints).reverse()
  for (const [bp, minWidth] of breakpointEntries) {
    if (width >= minWidth) {
      breakpoint = bp as Breakpoint
      break
    }
  }

  // Determine device type
  let deviceType: DeviceType
  if (width < breakpoints.sm) {
    deviceType = 'mobile'
  } else if (width < breakpoints.lg) {
    deviceType = 'tablet'
  } else if (width < breakpoints['2xl']) {
    deviceType = 'desktop'
  } else {
    deviceType = 'wide'
  }

  // Check for touch capability
  const isTouch =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as string).msMaxTouchPoints > 0

  return {
    width,
    height,
    breakpoint,
    deviceType,
    orientation: width > height ? 'landscape' : 'portrait',
    isTouch,
    pixelRatio,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop' || deviceType === 'wide',
    isRetina: pixelRatio >= 2,
  }
}

// Hook for element resize detection
export function useElementResize<T extends HTMLElement = HTMLDivElement>(
  callback?: (dimensions: { width: number; height: number }) => void,
  debounceMs = 150
) {
  const [element, setElement] = useState<T | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const ref = useCallback((node: T | null) => {
    setElement(node)
  }, [])

  useEffect(() => {
    if (!element) {
      return
    }

    let timeoutId: NodeJS.Timeout

    const observer = new ResizeObserver((entries) => {
      clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect
          const newDimensions = { width, height }

          setDimensions(newDimensions)
          callback?.(newDimensions)
        }
      }, debounceMs)
    })

    observer.observe(element)

    // Initial measurement
    const { width, height } = element.getBoundingClientRect()
    setDimensions({ width, height })

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [element, callback, debounceMs])

  return { ref, dimensions, element }
}

// Hook for intersection observer (viewport visibility)
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {}
) {
  const [element, setElement] = useState<T | null>(null)
  const [isInView, setIsInView] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  const ref = useCallback((node: T | null) => {
    setElement(node)
  }, [])

  useEffect(() => {
    if (!element) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        setEntry(entry)
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [element, options.threshold, options.root, options.rootMargin, options])

  return { ref, isInView, entry }
}

// Hook for match media queries
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }

    // Legacy browsers
    mediaQuery.addListener(handler)
    return () => mediaQuery.removeListener(handler)
  }, [query])

  return matches
}

// Preset media queries
export const mediaQueries = {
  prefersReducedMotion: '(prefers-reduced-motion: reduce)',
  prefersDark: '(prefers-color-scheme: dark)',
  prefersLight: '(prefers-color-scheme: light)',
  isTouch: '(hover: none) and (pointer: coarse)',
  isMouse: '(hover: hover) and (pointer: fine)',
  isPortrait: '(orientation: portrait)',
  isLandscape: '(orientation: landscape)',
  isRetina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',

  // Breakpoint queries
  mobile: `(max-width: ${breakpoints.sm - 1}px)`,
  tablet: `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktop: `(min-width: ${breakpoints.lg}px)`,
  wide: `(min-width: ${breakpoints['2xl']}px)`,
} as const

// Export type for media query keys
export type MediaQueryKey = keyof typeof mediaQueries
