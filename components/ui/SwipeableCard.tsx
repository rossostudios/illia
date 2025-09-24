'use client'

import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useState } from 'react'

type SwipeableCardProps = {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  className?: string
  disabled?: boolean
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  className = '',
  disabled = false,
}: SwipeableCardProps) {
  const controls = useAnimation()
  const motionValue = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)

  const rotateValue = useTransform(motionValue, [-200, 200], [-15, 15])
  const opacityLeft = useTransform(motionValue, [-200, -threshold, 0], [1, 1, 0])
  const opacityRight = useTransform(motionValue, [0, threshold, 200], [0, 1, 1])
  const scale = useTransform(motionValue, [-200, 0, 200], [1.05, 1, 1.05])

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false)
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (disabled) {
      controls.start({ x: 0, rotate: 0 })
    } else if (offset > threshold || velocity > 500) {
      // Swiped right
      controls.start({ x: 300, opacity: 0 })
      onSwipeRight?.()
    } else if (offset < -threshold || velocity < -500) {
      // Swiped left
      controls.start({ x: -300, opacity: 0 })
      onSwipeLeft?.()
    } else {
      // Return to center
      controls.start({ x: 0, rotate: 0 })
    }
  }

  return (
    <div className="relative">
      {/* Swipe indicators */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ opacity: opacityLeft }}
      >
        <div className="rounded-full bg-red-500 p-4 text-white shadow-lg">
          <X className="h-8 w-8" />
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ opacity: opacityRight }}
      >
        <div className="rounded-full bg-green-500 p-4 text-white shadow-lg">
          <Check className="h-8 w-8" />
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        animate={controls}
        className={`cursor-grab active:cursor-grabbing ${
          isDragging ? 'select-none' : ''
        } ${className}`}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        onDragStart={() => setIsDragging(true)}
        style={{
          x: motionValue,
          rotate: rotateValue,
          scale,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Swipeable card stack for multiple cards
type SwipeableStackProps = {
  cards: React.ReactNode[]
  onSwipeLeft?: (index: number) => void
  onSwipeRight?: (index: number) => void
  onFinish?: () => void
}

export function SwipeableStack({
  cards,
  onSwipeLeft,
  onSwipeRight,
  onFinish,
}: SwipeableStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipedCards, setSwipedCards] = useState<number[]>([])

  const handleSwipeLeft = () => {
    onSwipeLeft?.(currentIndex)
    setSwipedCards([...swipedCards, currentIndex])

    if (currentIndex < cards.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300)
    } else {
      onFinish?.()
    }
  }

  const handleSwipeRight = () => {
    onSwipeRight?.(currentIndex)
    setSwipedCards([...swipedCards, currentIndex])

    if (currentIndex < cards.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300)
    } else {
      onFinish?.()
    }
  }

  return (
    <div className="relative h-full">
      {cards.map((card, index) => {
        const isVisible = index >= currentIndex && index < currentIndex + 3
        const isCurrent = index === currentIndex
        const offset = index - currentIndex

        if (!isVisible || swipedCards.includes(index)) {
          return null
        }

        return (
          <motion.div
            animate={{
              scale: 1 - offset * 0.05,
              y: offset * 10,
              opacity: offset < 3 ? 1 : 0,
            }}
            className="absolute inset-0"
            initial={{ scale: 1 - offset * 0.05, y: offset * 10 }}
            key={index}
            style={{
              zIndex: cards.length - index,
            }}
          >
            {isCurrent ? (
              <SwipeableCard onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight}>
                {card}
              </SwipeableCard>
            ) : (
              <div className="pointer-events-none opacity-90">{card}</div>
            )}
          </motion.div>
        )
      })}

      {currentIndex >= cards.length && (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No more cards</p>
        </div>
      )}
    </div>
  )
}
