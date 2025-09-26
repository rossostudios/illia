'use client'

import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'
import { type ReactNode, useEffect, useState } from 'react'
import { useElementResize, useInView, useResponsive } from '@/hooks/use-responsive'

type ResponsiveCardProps = {
  title?: string
  subtitle?: string
  description?: string
  image?: {
    src: string
    alt: string
  }
  actions?: ReactNode
  children?: ReactNode
  variant?: 'default' | 'compact' | 'featured' | 'minimal'
  interactive?: boolean
  expandable?: boolean
  className?: string
  onClick?: () => void
}

export function ResponsiveCard({
  title,
  subtitle,
  description,
  image,
  actions,
  children,
  variant = 'default',
  interactive = false,
  expandable = false,
  className = '',
  onClick,
}: ResponsiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const responsive = useResponsive()
  const { viewport } = responsive
  const isMobile = viewport.isMobile
  const isTablet = viewport.isTablet
  const { ref: cardRef, isInView } = useInView({ threshold: 0.2 })
  const { ref: resizeRef, dimensions } = useElementResize<HTMLDivElement>()

  // Combine refs
  const setRefs = (el: HTMLDivElement | null) => {
    cardRef(el)
    resizeRef(el)
  }

  // Motion values for interactive effects
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  // Determine layout based on viewport and variant
  const getLayout = () => {
    if (variant === 'minimal') {
      return 'minimal'
    }
    if (variant === 'compact') {
      return 'compact'
    }
    if (variant === 'featured' && !isMobile) {
      return 'horizontal'
    }
    if (dimensions.width < 300) {
      return 'compact'
    }
    return 'vertical'
  }

  const layout = getLayout()

  // Animation variants
  const cardVariants: any = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: interactive ? 1.02 : 1,
      boxShadow: interactive ? '0 20px 40px rgba(0, 0, 0, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: interactive ? 0.98 : 1,
    },
  }

  const contentVariants = {
    collapsed: {
      height: 'auto',
    },
    expanded: {
      height: 'auto',
    },
  }

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || isMobile) {
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set((e.clientX - centerX) / 5)
    y.set((e.clientY - centerY) / 5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // Responsive image sizes
  const getImageSizes = () => {
    if (layout === 'horizontal') {
      return '(max-width: 768px) 40vw, 300px'
    }
    if (layout === 'compact') {
      return '(max-width: 640px) 100vw, 200px'
    }
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px'
  }

  // Responsive text sizes
  const getTitleSize = () => {
    if (layout === 'minimal') {
      return 'text-fluid-sm'
    }
    if (layout === 'compact') {
      return 'text-fluid-base'
    }
    if (variant === 'featured') {
      return 'text-fluid-2xl'
    }
    return 'text-fluid-lg'
  }

  return (
    <motion.article
      animate={isInView ? 'animate' : 'initial'}
      className={`responsive-card container-responsive ${variant === 'featured' ? 'col-span-2 row-span-2' : ''}
        ${layout === 'horizontal' ? 'flex flex-row' : 'flex flex-col'}
        ${interactive ? 'cursor-pointer' : ''}bg-white overflow-hidden rounded-lg shadow-lg dark:bg-gray-900 ${className}
      `}
      data-layout={layout}
      data-width={dimensions.width}
      initial="initial"
      onClick={() => {
        if (expandable) {
          setIsExpanded(!isExpanded)
        }
        onClick?.()
      }}
      onHoverEnd={() => setIsHovered(false)}
      onHoverStart={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={setRefs}
      style={{
        perspective: interactive ? 1000 : undefined,
        transformStyle: interactive ? 'preserve-3d' : undefined,
      }}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
    >
      {/* 3D Transform wrapper */}
      <motion.div
        className={`flex ${layout === 'horizontal' ? 'flex-row' : 'flex-col'}w-full h-full`}
        style={{
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Image Section */}
        {image && (
          <motion.div
            className={`relative overflow-hidden ${layout === 'horizontal' ? 'h-full w-1/3' : 'w-full'}
              ${layout === 'compact' ? 'h-32' : 'h-48 sm:h-56 md:h-64'}
            `}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              alt={image.alt}
              className="object-cover"
              fill
              priority={variant === 'featured'}
              sizes={getImageSizes()}
              src={image.src}
            />
            {interactive && isHovered && (
              <motion.div
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        )}

        {/* Content Section */}
        <div
          className={`flex flex-1 flex-col ${layout === 'compact' ? 'p-3' : 'p-4 sm:p-5 md:p-6'}
          `}
        >
          {/* Header */}
          {(title || subtitle) && (
            <div className="mb-3">
              {subtitle && (
                <p className="mb-1 text-fluid-xs text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  {subtitle}
                </p>
              )}
              {title && (
                <h3
                  className={`
                    ${getTitleSize()} font-semibold cq:text-lg text-gray-900 dark:text-white`}
                >
                  {title}
                </h3>
              )}
            </div>
          )}

          {/* Description */}
          <AnimatePresence>
            {(description || children) && (
              <motion.div
                animate={isExpanded ? 'expanded' : 'collapsed'}
                className={`mb-4 flex-1 ${!isExpanded && layout !== 'minimal' ? 'line-clamp-3' : ''}
                `}
                initial="collapsed"
                variants={contentVariants}
              >
                {description && (
                  <p className="mb-3 text-fluid-sm text-gray-600 dark:text-gray-300">
                    {description}
                  </p>
                )}
                {children}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand indicator */}
          {expandable && (description || children) && (
            <button className="mb-3 text-fluid-xs text-teal-600 hover:underline dark:text-teal-400" onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              type="button"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}

          {/* Actions */}
          {actions && (
            <motion.div
              animate={{ opacity: 1 }}
              className={`mt-auto flex gap-2 ${layout === 'compact' ? 'flex-col sm:flex-row' : 'flex-row'}cq:flex-row`}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              {actions}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Interactive overlay effects */}
      {interactive && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(
              circle at ${x.get()}px ${y.get()}px,
              rgba(20, 184, 166, 0.05),
              transparent 50%
            )`,
          }}
        />
      )}
    </motion.article>
  )
}

// Responsive Card Grid
type ResponsiveCardGridProps = {
  cards: Array<ResponsiveCardProps & { id: string | number }>
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number | string
  className?: string
}

export function ResponsiveCardGrid({
  cards,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 16,
  className = '',
}: ResponsiveCardGridProps) {
  const { viewport, getBreakpointValue } = useResponsive()
  const [visibleCards, setVisibleCards] = useState<Set<string | number>>(new Set())

  // Progressive loading
  useEffect(() => {
    const timer = setTimeout(() => {
      const newVisible = new Set(visibleCards)
      cards.slice(0, visibleCards.size + 4).forEach((card) => {
        newVisible.add(card.id)
      })
      setVisibleCards(newVisible)
    }, 100)

    return () => clearTimeout(timer)
  }, [visibleCards, cards])

  const gridColumns = getBreakpointValue(columns) || 1

  return (
    <div
      className={`grid gap-${gap} card-grid ${className}
      `}
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: typeof gap === 'number' ? `${gap}px` : gap,
      }}
    >
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            animate={{
              opacity: visibleCards.has(card.id) ? 1 : 0,
              y: visibleCards.has(card.id) ? 0 : 20,
            }}
            initial={{ opacity: 0, y: 20 }}
            key={card.id}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
            }}
          >
            <ResponsiveCard {...card} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
