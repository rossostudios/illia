'use client'

import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type PullToRefreshProps = {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number
  disabled?: boolean
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)

  const controls = useAnimation()
  const y = useMotionValue(0)
  const pullProgress = useTransform(y, [0, threshold], [0, 1])
  const spinnerRotate = useTransform(y, [0, threshold], [0, 180])
  const spinnerScale = useTransform(y, [0, threshold * 0.5], [0, 1])

  useEffect(() => {
    if (!disabled && containerRef.current) {
      const element = containerRef.current

      const handleTouchStart = (e: TouchEvent) => {
        if (element.scrollTop === 0 && !isRefreshing) {
          startY.current = e.touches[0].clientY
          setIsPulling(true)
        }
      }

      const handleTouchMove = (e: TouchEvent) => {
        if (!isPulling || isRefreshing) {
          return
        }

        currentY.current = e.touches[0].clientY
        const diff = currentY.current - startY.current

        if (diff > 0 && element.scrollTop === 0) {
          e.preventDefault()
          const pullDistance = Math.min(diff * 0.5, threshold * 1.5)
          y.set(pullDistance)
        }
      }

      const handleTouchEnd = async () => {
        if (!isPulling || isRefreshing) {
          return
        }

        setIsPulling(false)
        const pullDistance = y.get()

        if (pullDistance >= threshold) {
          setIsRefreshing(true)
          await controls.start({ y: threshold })

          try {
            await onRefresh()
          } finally {
            setIsRefreshing(false)
            await controls.start({ y: 0 })
            y.set(0)
          }
        } else {
          await controls.start({ y: 0 })
          y.set(0)
        }
      }

      element.addEventListener('touchstart', handleTouchStart, { passive: true })
      element.addEventListener('touchmove', handleTouchMove, { passive: false })
      element.addEventListener('touchend', handleTouchEnd, { passive: true })

      return () => {
        element.removeEventListener('touchstart', handleTouchStart)
        element.removeEventListener('touchmove', handleTouchMove)
        element.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isPulling, isRefreshing, threshold, disabled, y, controls, onRefresh])

  return (
    <div
      className="relative h-full overflow-auto overscroll-y-contain"
      ref={containerRef}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Pull indicator */}
      <motion.div
        className="pointer-events-none absolute top-0 right-0 left-0 z-10 flex justify-center"
        style={{ y }}
      >
        <motion.div
          className="mt-4 rounded-full bg-white p-3 shadow-lg"
          style={{
            scale: spinnerScale,
            opacity: pullProgress,
          }}
        >
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : {}}
            style={{ rotate: isRefreshing ? undefined : spinnerRotate }}
            transition={
              isRefreshing ? { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' } : {}
            }
          >
            <RefreshCw
              className={`h-5 w-5 ${pullProgress.get() >= 1 ? 'text-teal-600' : 'text-gray-400'}`}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div animate={controls} className="min-h-full" ref={contentRef} style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}

// Hook for managing refresh state
export function usePullToRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refresh = async (callback: () => Promise<void>) => {
    if (isRefreshing) {
      return
    }

    setIsRefreshing(true)
    try {
      await callback()
    } finally {
      setIsRefreshing(false)
    }
  }

  return {
    isRefreshing,
    refresh,
  }
}
