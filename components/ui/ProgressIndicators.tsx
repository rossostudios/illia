'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

// Linear Progress Bar
type ProgressBarProps = {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  color?: 'teal' | 'blue' | 'green' | 'amber' | 'red'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  color = 'teal',
  size = 'md',
  animated = true,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const colors = {
    teal: 'bg-teal-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  }

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between">
          {label && <span className="text-gray-700 text-sm dark:text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="text-gray-600 text-sm dark:text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${sizes[size]}`}
      >
        <motion.div
          animate={{ width: `${percentage}%` }}
          className={`h-full ${colors[color]} ${animated ? 'transition-all duration-300' : ''}`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// Circular Progress
type CircularProgressProps = {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  showValue?: boolean
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#14b8a6',
  showValue = true,
  className = '',
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg className="-rotate-90" height={size} width={size}>
        <circle
          className="text-gray-200 dark:text-gray-700"
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          animate={{ strokeDashoffset: offset }}
          cx={size / 2}
          cy={size / 2}
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          r={radius}
          stroke={color}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          style={{
            strokeDasharray: circumference,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-semibold text-2xl text-gray-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}

// Step Progress Indicator
type StepProgressProps = {
  steps: Array<{
    label: string
    description?: string
  }>
  currentStep: number
  orientation?: 'horizontal' | 'vertical'
  showLabels?: boolean
  className?: string
}

export function StepProgress({
  steps,
  currentStep,
  orientation = 'horizontal',
  showLabels = true,
  className = '',
}: StepProgressProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div className={`${isHorizontal ? 'flex items-center' : 'flex flex-col'} ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <div
            className={`${isHorizontal ? 'flex flex-1 items-center' : 'flex items-start'}`}
            key={index}
          >
            {/* Step indicator */}
            <div
              className={`relative flex ${isHorizontal ? 'flex-col items-center' : 'items-start'}`}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  transition: { duration: 0.2 },
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? 'border-teal-500 bg-teal-500 text-white'
                    : isActive
                      ? 'border-teal-500 bg-white text-teal-500 dark:bg-gray-900'
                      : 'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-500'
                }`}
                initial={false}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="font-semibold text-sm">{index + 1}</span>
                )}
              </motion.div>

              {/* Label */}
              {showLabels && (
                <div className={`${isHorizontal ? 'mt-2 text-center' : 'ml-3'}`}>
                  <p
                    className={`font-medium text-sm ${
                      isActive
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
                      {step.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={`${
                  isHorizontal ? 'mx-2 h-0.5 flex-1' : 'mt-2 ml-5 h-full min-h-[40px] w-0.5'
                } ${isCompleted ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Loading Dots
export function LoadingDots({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          className="h-2 w-2 rounded-full bg-teal-600 dark:bg-teal-400"
          key={index}
          transition={{
            duration: 0.6,
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  )
}

// Pulse Animation for Loading States
export function PulseLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        className="h-12 w-12 rounded-full bg-teal-500"
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1.8],
          opacity: [0.7, 0.3, 0],
        }}
        className="absolute inset-0 h-12 w-12 rounded-full bg-teal-500"
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeOut',
        }}
      />
    </div>
  )
}
