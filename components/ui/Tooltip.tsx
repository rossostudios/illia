'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode, useState } from 'react'

type TooltipProps = {
  content: string
  children: ReactNode
  position?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
  className?: string
}

export function Tooltip({
  content,
  children,
  position = 'right',
  delay = 500,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    const newTimer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    setTimer(newTimer)
  }

  const handleMouseLeave = () => {
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
    setIsVisible(false)
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2'
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2'
      default:
        return 'left-full top-1/2 -translate-y-1/2 ml-2'
    }
  }

  const getArrowStyles = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100 border-x-transparent border-b-transparent'
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100 border-y-transparent border-l-transparent'
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100 border-x-transparent border-t-transparent'
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100 border-y-transparent border-r-transparent'
      default:
        return 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100 border-y-transparent border-l-transparent'
    }
  }

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute z-50 ${getPositionStyles()} pointer-events-none`}
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="relative">
              <div className="rounded-md bg-gray-900 px-2 py-1 text-white text-xs shadow-lg dark:bg-gray-100 dark:text-gray-900">
                {content}
              </div>
              <div
                className={`absolute h-0 w-0 border-4 ${getArrowStyles()}`}
                style={{ borderStyle: 'solid' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type TooltipProviderProps = {
  children: ReactNode
  content: string
  position?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
}

// Wrapper component that can be used inline without affecting layout
export function TooltipWrapper({
  children,
  content,
  position = 'right',
  delay = 500,
}: TooltipProviderProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    const newTimer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    setTimer(newTimer)
  }

  const handleMouseLeave = () => {
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
    setIsVisible(false)
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-3'
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-3'
      default:
        return 'left-full top-1/2 -translate-y-1/2 ml-3'
    }
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute z-[100] ${getPositionStyles()} pointer-events-none whitespace-nowrap`}
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="rounded-md bg-gray-900 px-3 py-1.5 font-medium text-sm text-white shadow-lg dark:bg-gray-100 dark:text-gray-900">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
