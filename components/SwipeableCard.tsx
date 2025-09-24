'use client'

import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

type SwipeableCardProps = {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onTap?: () => void
  className?: string
  enableSwipe?: boolean
}

export default function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  className = '',
  enableSwipe = true,
}: SwipeableCardProps) {
  const [isPressed, setIsPressed] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateZ = useTransform(x, [-200, 200], [-30, 30])
  const scale = useMotionValue(1)
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const controls = useAnimation()

  const handleDragEnd = async (_event: any, info: any) => {
    const swipeThreshold = 100
    const swipeVelocityThreshold = 500

    if (
      Math.abs(info.offset.x) > swipeThreshold ||
      Math.abs(info.velocity.x) > swipeVelocityThreshold
    ) {
      if (info.offset.x > 0) {
        // Swiped right
        await controls.start({
          x: window.innerWidth,
          transition: { duration: 0.3 },
        })
        onSwipeRight?.()
      } else {
        // Swiped left
        await controls.start({
          x: -window.innerWidth,
          transition: { duration: 0.3 },
        })
        onSwipeLeft?.()
      }

      // Reset position for next card
      setTimeout(() => {
        x.set(0)
        y.set(0)
        controls.set({ x: 0, y: 0 })
      }, 300)
    } else {
      // Snap back to center
      controls.start({
        x: 0,
        y: 0,
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 500,
        },
      })
    }
  }

  const handleTapStart = () => {
    setIsPressed(true)
    scale.set(0.98)
  }

  const handleTapEnd = () => {
    setIsPressed(false)
    scale.set(1)
    onTap?.()
  }

  // Visual feedback for swipe direction
  const leftIndicatorOpacity = useTransform(x, [-100, 0], [1, 0])
  const rightIndicatorOpacity = useTransform(x, [0, 100], [0, 1])

  return (
    <motion.div
      animate={controls}
      className={`relative touch-manipulation ${className}`}
      drag={enableSwipe}
      dragConstraints={{ left: -200, right: 200, top: -50, bottom: 50 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      onTap={handleTapEnd}
      onTapStart={handleTapStart}
      ref={cardRef}
      style={{
        x,
        y,
        rotateZ: enableSwipe ? rotateZ : 0,
        scale,
        opacity,
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
      }}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* Visual swipe indicators */}
      {enableSwipe && (
        <>
          {/* Left swipe indicator (Reject/No) */}
          <motion.div
            className="pointer-events-none absolute top-4 right-4 rotate-12 select-none rounded-lg bg-red-500 px-4 py-2 font-bold text-white"
            style={{ opacity: leftIndicatorOpacity }}
          >
            NOPE
          </motion.div>

          {/* Right swipe indicator (Accept/Yes) */}
          <motion.div
            className="-rotate-12 pointer-events-none absolute top-4 left-4 select-none rounded-lg bg-green-500 px-4 py-2 font-bold text-white"
            style={{ opacity: rightIndicatorOpacity }}
          >
            LIKE
          </motion.div>
        </>
      )}

      {/* Card content */}
      <div
        className={`h-full w-full ${
          isPressed ? 'shadow-lg' : 'shadow-xl'
        } transition-shadow duration-200`}
      >
        {children}
      </div>

      {/* Touch feedback overlay */}
      {isPressed && <div className="pointer-events-none absolute inset-0 rounded-lg bg-black/5" />}
    </motion.div>
  )
}
