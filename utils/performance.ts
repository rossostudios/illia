import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    console.log(metric)

    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      })
    }
  }
}

// Optimize heavy operations with debouncing
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

// Optimize heavy operations with throttling
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
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
  if (typeof window === 'undefined') return false

  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection

  if (connection) {
    const effectiveType = connection.effectiveType
    return effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g'
  }

  return false
}

// Reduce motion for users who prefer it
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
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
