import type { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200'

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
    none: '',
  }

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  }

  const computedStyle = {
    width: width || (variant === 'circular' ? '40px' : '100%'),
    height: height || (variant === 'text' ? '1em' : variant === 'circular' ? '40px' : '20px'),
    ...style,
  }

  return (
    <div
      aria-hidden="true"
      className={`${baseClasses} ${animationClasses[animation]} ${variantClasses[variant]} ${className}`}
      style={computedStyle}
      {...props}
    />
  )
}

// Preset skeleton components for common use cases
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          height="1em"
          key={index}
          variant="text"
          width={index === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-start gap-4">
        <Skeleton height={48} variant="circular" width={48} />
        <div className="flex-1 space-y-2">
          <Skeleton height="1.25em" variant="text" width="40%" />
          <Skeleton variant="text" width="60%" />
          <div className="mt-2 flex items-center gap-4">
            <Skeleton variant="text" width={80} />
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" width={70} />
          </div>
        </div>
        <Skeleton height={36} variant="rounded" width={100} />
      </div>
    </div>
  )
}

export function SkeletonList({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}
