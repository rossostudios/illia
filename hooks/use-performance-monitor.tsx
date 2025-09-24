'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useResponsive } from './useResponsive'

type PerformanceMetrics = {
  // Viewport metrics
  viewportResizes: number
  lastResizeTime: number
  averageResizeDuration: number

  // Layout shifts
  layoutShifts: number
  cumulativeLayoutShift: number

  // Render performance
  renderCount: number
  averageRenderTime: number
  slowRenders: number

  // Interaction metrics
  firstInputDelay: number
  interactionToNextPaint: number[]

  // Resource timing
  imageLoadTime: number[]
  scriptLoadTime: number[]

  // Custom metrics
  customMetrics: Record<string, any>
}

type PerformanceConfig = {
  enableLogging?: boolean
  slowRenderThreshold?: number
  reportInterval?: number
  onReport?: (metrics: PerformanceMetrics) => void
}

export function usePerformanceMonitor(config: PerformanceConfig = {}) {
  const {
    enableLogging = false,
    slowRenderThreshold = 16, // 16ms = 60fps
    reportInterval = 10_000, // Report every 10 seconds
    onReport,
  } = config

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    viewportResizes: 0,
    lastResizeTime: 0,
    averageResizeDuration: 0,
    layoutShifts: 0,
    cumulativeLayoutShift: 0,
    renderCount: 0,
    averageRenderTime: 0,
    slowRenders: 0,
    firstInputDelay: 0,
    interactionToNextPaint: [],
    imageLoadTime: [],
    scriptLoadTime: [],
    customMetrics: {},
  })

  const renderStartTime = useRef<number>(0)
  const resizeStartTime = useRef<number>(0)
  const renderTimes = useRef<number[]>([])
  const resizeDurations = useRef<number[]>([])

  const { viewport } = useResponsive()

  // Track viewport resizes
  useEffect(() => {
    const handleResizeStart = () => {
      resizeStartTime.current = performance.now()
    }

    const handleResizeEnd = () => {
      if (resizeStartTime.current) {
        const duration = performance.now() - resizeStartTime.current
        resizeDurations.current.push(duration)

        setMetrics((prev) => ({
          ...prev,
          viewportResizes: prev.viewportResizes + 1,
          lastResizeTime: duration,
          averageResizeDuration:
            resizeDurations.current.reduce((a, b) => a + b, 0) / resizeDurations.current.length,
        }))

        if (enableLogging) {
        }
      }
    }

    let resizeTimeout: NodeJS.Timeout

    const handleResize = () => {
      if (!resizeStartTime.current) {
        handleResizeStart()
      }

      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResizeEnd, 150)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [enableLogging])

  // Track layout shifts
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as string).hadRecentInput) {
              const shift = (entry as string).value || 0

              setMetrics((prev) => ({
                ...prev,
                layoutShifts: prev.layoutShifts + 1,
                cumulativeLayoutShift: prev.cumulativeLayoutShift + shift,
              }))

              if (enableLogging && shift > 0.1) {
              }
            }
          }
        })

        observer.observe({ entryTypes: ['layout-shift'] })

        return () => observer.disconnect()
      } catch (_error) {
        // Error handled silently
      }
    }
  }, [enableLogging])

  // Track First Input Delay
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'first-input') {
              const delay = (entry as string).processingStart - entry.startTime

              setMetrics((prev) => ({
                ...prev,
                firstInputDelay: delay,
              }))

              if (enableLogging) {
              }
            }
          }
        })

        observer.observe({ entryTypes: ['first-input'] })

        return () => observer.disconnect()
      } catch (_error) {
        // Error handled silently
      }
    }
  }, [enableLogging])

  // Track resource timing
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming
              const loadTime = resourceEntry.responseEnd - resourceEntry.startTime

              if (resourceEntry.initiatorType === 'img') {
                setMetrics((prev) => ({
                  ...prev,
                  imageLoadTime: [...prev.imageLoadTime, loadTime].slice(-50), // Keep last 50
                }))
              } else if (resourceEntry.initiatorType === 'script') {
                setMetrics((prev) => ({
                  ...prev,
                  scriptLoadTime: [...prev.scriptLoadTime, loadTime].slice(-50),
                }))
              }

              if (enableLogging && loadTime > 1000) {
              }
            }
          }
        })

        observer.observe({ entryTypes: ['resource'] })

        return () => observer.disconnect()
      } catch (_error) {
        // Error handled silently
      }
    }
  }, [enableLogging])

  // Track render performance
  const trackRender = useCallback(() => {
    renderStartTime.current = performance.now()
  }, [])

  const endRender = useCallback(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current
      renderTimes.current.push(renderTime)

      const averageRenderTime =
        renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length

      const isSlowRender = renderTime > slowRenderThreshold

      setMetrics((prev) => ({
        ...prev,
        renderCount: prev.renderCount + 1,
        averageRenderTime,
        slowRenders: prev.slowRenders + (isSlowRender ? 1 : 0),
      }))

      if (enableLogging && isSlowRender) {
      }

      renderStartTime.current = 0
    }
  }, [slowRenderThreshold, enableLogging])

  // Track custom metrics
  const trackMetric = useCallback((name: string, value: any) => {
    setMetrics((prev) => ({
      ...prev,
      customMetrics: {
        ...prev.customMetrics,
        [name]: value,
      },
    }))
  }, [])

  // Report metrics periodically
  useEffect(() => {
    if (onReport) {
      const interval = setInterval(() => {
        onReport(metrics)

        if (enableLogging) {
        }
      }, reportInterval)

      return () => clearInterval(interval)
    }
  }, [metrics, onReport, reportInterval, enableLogging])

  // Get Web Vitals
  const getWebVitals = useCallback(() => {
    const vitals = {
      FCP: 0, // First Contentful Paint
      LCP: 0, // Largest Contentful Paint
      FID: metrics.firstInputDelay,
      CLS: metrics.cumulativeLayoutShift,
      TTFB: 0, // Time to First Byte
    }

    if ('PerformanceObserver' in window && window.performance) {
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        vitals.FCP = fcpEntry.startTime
      }

      const navigationEntry = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        vitals.TTFB = navigationEntry.responseStart - navigationEntry.requestStart
      }
    }

    return vitals
  }, [metrics])

  // Performance score calculation
  const calculatePerformanceScore = useCallback(() => {
    const webVitals = getWebVitals()

    // Score based on Google's thresholds
    let score = 100

    // FCP scoring (good < 1.8s, needs improvement < 3s, poor >= 3s)
    if (webVitals.FCP > 3000) {
      score -= 25
    } else if (webVitals.FCP > 1800) {
      score -= 10
    }

    // FID scoring (good < 100ms, needs improvement < 300ms, poor >= 300ms)
    if (webVitals.FID > 300) {
      score -= 25
    } else if (webVitals.FID > 100) {
      score -= 10
    }

    // CLS scoring (good < 0.1, needs improvement < 0.25, poor >= 0.25)
    if (webVitals.CLS > 0.25) {
      score -= 25
    } else if (webVitals.CLS > 0.1) {
      score -= 10
    }

    // Custom metrics
    if (metrics.averageRenderTime > 16) {
      score -= 10
    }
    if (metrics.slowRenders > metrics.renderCount * 0.1) {
      score -= 10
    }

    return Math.max(0, score)
  }, [getWebVitals, metrics])

  return {
    metrics,
    trackRender,
    endRender,
    trackMetric,
    getWebVitals,
    calculatePerformanceScore,

    // Utility functions
    clearMetrics: () => {
      renderTimes.current = []
      resizeDurations.current = []
      setMetrics({
        viewportResizes: 0,
        lastResizeTime: 0,
        averageResizeDuration: 0,
        layoutShifts: 0,
        cumulativeLayoutShift: 0,
        renderCount: 0,
        averageRenderTime: 0,
        slowRenders: 0,
        firstInputDelay: 0,
        interactionToNextPaint: [],
        imageLoadTime: [],
        scriptLoadTime: [],
        customMetrics: {},
      })
    },
  }
}

// Component wrapper for performance tracking
type PerformanceTrackedProps = {
  children: React.ReactNode
  name: string
  enableLogging?: boolean
}

export function PerformanceTracked({
  children,
  name,
  enableLogging = false,
}: PerformanceTrackedProps) {
  const startTime = useRef<number>(0)

  useEffect(() => {
    startTime.current = performance.now()

    return () => {
      const _duration = performance.now() - startTime.current
      if (enableLogging) {
      }
    }
  }, [enableLogging])

  return <>{children}</>
}
