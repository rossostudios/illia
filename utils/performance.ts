import type { NextWebVitalsMetric } from 'next/app'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type WindowWithGtag = Window & {
  gtag?: (command: string, eventName: string, params: Record<string, unknown>) => void
}

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

// Prefetch routes when idle
export function usePrefetchRoutes(routes: string[]) {
  const router = useRouter()

  useEffect(() => {
    const prefetchRoutes = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          routes.forEach((route) => {
            router.prefetch(route)
          })
        })
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          routes.forEach((route) => {
            router.prefetch(route)
          })
        }, 1000)
      }
    }

    prefetchRoutes()
  }, [routes, router])
}

// Measure web vitals
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label !== 'web-vital' || typeof window === 'undefined') {
    return
  }

  const { gtag } = window as WindowWithGtag
  if (!gtag) {
    return
  }

  const eventPayload = {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    // biome-ignore lint/style/useNamingConvention: Required key for gtag events
    event_label: metric.id,
    // biome-ignore lint/style/useNamingConvention: Required key for gtag events
    non_interaction: true,
  } satisfies Record<string, string | number | boolean>

  gtag('event', metric.name, eventPayload)
}

// Optimize heavy operations with debouncing
export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

// Optimize heavy operations with throttling
export function throttle<Args extends unknown[]>(
  func: (...args: Args) => void,
  limit: number
): (...args: Args) => void {
  let inThrottle = false

  return (...args: Args) => {
    if (inThrottle) {
      return
    }

    func(...args)
    inThrottle = true

    setTimeout(() => {
      inThrottle = false
    }, limit)
  }
}

// Lazy load images when they enter viewport
export function lazyLoadImage(imageSrc: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = imageSrc
  })
}

// Detect slow connections
export function isSlowConnection(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const navigatorWithConnection = navigator as NavigatorWithConnection
  const connection =
    navigatorWithConnection.connection ??
    navigatorWithConnection.mozConnection ??
    navigatorWithConnection.webkitConnection

  if (connection) {
    const effectiveType = connection.effectiveType
    return effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g'
  }

  return false
}

// Reduce motion for users who prefer it
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Request idle callback with fallback
export function requestIdleCallbackShim(callback: () => void) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback)
  } else {
    setTimeout(callback, 1)
  }
}
