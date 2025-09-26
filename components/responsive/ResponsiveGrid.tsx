'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { type CSSProperties, forwardRef, type ReactNode } from 'react'
import { type Breakpoint, useElementResize, useResponsive } from '@/hooks/use-responsive'

// Type definitions for responsive values
type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>

type ResponsiveGridProps = {
  children: ReactNode
  columns?: ResponsiveValue<number | string>
  rows?: ResponsiveValue<number | string>
  gap?: ResponsiveValue<number | string>
  padding?: ResponsiveValue<number | string>
  minChildWidth?: number | string
  autoFit?: boolean
  autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense'
  alignItems?: ResponsiveValue<CSSProperties['alignItems']>
  justifyItems?: ResponsiveValue<CSSProperties['justifyItems']>
  className?: string
  animate?: boolean
  stagger?: number
}

export const ResponsiveGrid = forwardRef<HTMLDivElement, ResponsiveGridProps>(
  (
    {
      children,
      columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 },
      rows,
      gap = { xs: 8, sm: 12, md: 16, lg: 20 },
      padding = { xs: 16, md: 24, lg: 32 },
      minChildWidth,
      autoFit = false,
      autoFlow = 'row',
      alignItems = 'start',
      justifyItems = 'stretch',
      className = '',
      animate = false,
      stagger = 0.05,
    },
    ref
  ) => {
    const { viewport, getBreakpointValue } = useResponsive()
    const { ref: gridRef, dimensions } = useElementResize<HTMLDivElement>()

    // Helper function to get responsive value
    const getResponsiveValue = <T,>(value: ResponsiveValue<T>): T | undefined => {
      if (typeof value === 'object' && value !== null) {
        return getBreakpointValue(value as Partial<Record<Breakpoint, T>>)
      }
      return value as T
    }

    // Calculate grid template columns
    const getGridColumns = () => {
      if (autoFit && minChildWidth) {
        const minWidth = typeof minChildWidth === 'string' ? minChildWidth : `${minChildWidth}px`
        return `repeat(auto-fit, minmax(${minWidth}, 1fr))`
      }

      const cols = getResponsiveValue(columns)
      if (typeof cols === 'number') {
        return `repeat(${cols}, 1fr)`
      }
      return cols || '1fr'
    }

    // Calculate grid template rows
    const getGridRows = () => {
      if (!rows) {
        return
      }

      const rowValue = getResponsiveValue(rows)
      if (typeof rowValue === 'number') {
        return `repeat(${rowValue}, 1fr)`
      }
      return rowValue
    }

    // Build grid styles
    const gridStyles: CSSProperties = {
      display: 'grid',
      gridTemplateColumns: getGridColumns(),
      gridTemplateRows: getGridRows(),
      gap: getResponsiveValue(gap),
      padding: getResponsiveValue(padding),
      gridAutoFlow: autoFlow,
      alignItems: getResponsiveValue(alignItems),
      justifyItems: getResponsiveValue(justifyItems),
      width: '100%',
    }

    // Animation variants for children
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: stagger,
          delayChildren: 0.1,
        },
      },
    }

    const itemVariants: any = {
      hidden: { opacity: 0, y: 20, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 12,
        },
      },
    }

    const GridContainer = animate ? motion.div : 'div'

    return (
      <GridContainer
        animate={animate ? 'visible' : undefined}
        className={`responsive-grid ${className}`}
        data-columns={getResponsiveValue(columns)}
        data-viewport={viewport.breakpoint}
        initial={animate ? 'hidden' : undefined}
        ref={(node) => {
          gridRef(node)
          if (ref) {
            if (typeof ref === 'function') {
              ref(node)
            } else {
              ref.current = node
            }
          }
        }}
        style={gridStyles}
        variants={animate ? containerVariants : undefined}
      >
        {animate ? (
          <AnimatePresence>
            {Array.isArray(children)
              ? children.map((child, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    {child}
                  </motion.div>
                ))
              : children}
          </AnimatePresence>
        ) : (
          children
        )}
      </GridContainer>
    )
  }
)

ResponsiveGrid.displayName = 'ResponsiveGrid'

// Masonry Grid Component
type MasonryGridProps = {
  children: ReactNode
  columns?: ResponsiveValue<number>
  gap?: ResponsiveValue<number>
  className?: string
}

export function MasonryGrid({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 16,
  className = '',
}: MasonryGridProps) {
  const { getBreakpointValue } = useResponsive()

  const columnCount =
    getBreakpointValue(typeof columns === 'object' ? columns : { xs: columns }) || 1

  const gapValue = getBreakpointValue(typeof gap === 'object' ? gap : { xs: gap }) || 16

  // Distribute children across columns
  const childArray = Array.isArray(children) ? children : [children]
  const columnArrays: ReactNode[][] = Array.from({ length: columnCount }, () => [])

  childArray.forEach((child, index) => {
    const columnIndex = index % columnCount
    columnArrays[columnIndex].push(child)
  })

  return (
    <div
      className={`masonry-grid ${className}`}
      style={{
        display: 'flex',
        gap: `${gapValue}px`,
      }}
    >
      {columnArrays.map((column, colIndex) => (
        <div
          key={colIndex}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: `${gapValue}px`,
          }}
        >
          {column.map((item, itemIndex) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              key={itemIndex}
              transition={{
                delay: (colIndex * columnCount + itemIndex) * 0.05,
                duration: 0.3,
              }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Responsive Flex Container
type ResponsiveFlexProps = {
  children: ReactNode
  direction?: ResponsiveValue<CSSProperties['flexDirection']>
  wrap?: ResponsiveValue<CSSProperties['flexWrap']>
  gap?: ResponsiveValue<number | string>
  alignItems?: ResponsiveValue<CSSProperties['alignItems']>
  justifyContent?: ResponsiveValue<CSSProperties['justifyContent']>
  padding?: ResponsiveValue<number | string>
  className?: string
}

export const ResponsiveFlex = forwardRef<HTMLDivElement, ResponsiveFlexProps>(
  (
    {
      children,
      direction = { xs: 'column', md: 'row' },
      wrap = 'wrap',
      gap = { xs: 8, md: 16 },
      alignItems = 'flex-start',
      justifyContent = 'flex-start',
      padding = 0,
      className = '',
    },
    ref
  ) => {
    const { getBreakpointValue } = useResponsive()

    const getResponsiveValue = <T,>(value: ResponsiveValue<T>): T | undefined => {
      if (typeof value === 'object' && value !== null) {
        return getBreakpointValue(value as Partial<Record<Breakpoint, T>>)
      }
      return value as T
    }

    const flexStyles: CSSProperties = {
      display: 'flex',
      flexDirection: getResponsiveValue(direction),
      flexWrap: getResponsiveValue(wrap),
      gap: getResponsiveValue(gap),
      alignItems: getResponsiveValue(alignItems),
      justifyContent: getResponsiveValue(justifyContent),
      padding: getResponsiveValue(padding),
      width: '100%',
    }

    return (
      <div className={`responsive-flex ${className}`} ref={ref} style={flexStyles}>
        {children}
      </div>
    )
  }
)

ResponsiveFlex.displayName = 'ResponsiveFlex'

// Container with responsive max-width
type ResponsiveContainerProps = {
  children: ReactNode
  maxWidth?: ResponsiveValue<number | string>
  padding?: ResponsiveValue<number | string>
  centered?: boolean
  className?: string
}

export function ResponsiveContainer({
  children,
  maxWidth = { xs: '100%', sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
  padding = { xs: 16, sm: 24, md: 32, lg: 40 },
  centered = true,
  className = '',
}: ResponsiveContainerProps) {
  const { getBreakpointValue } = useResponsive()

  const getResponsiveValue = <T,>(value: ResponsiveValue<T>): T | undefined => {
    if (typeof value === 'object' && value !== null) {
      return getBreakpointValue(value as Partial<Record<Breakpoint, T>>)
    }
    return value as T
  }

  const containerStyles: CSSProperties = {
    maxWidth: getResponsiveValue(maxWidth),
    padding: getResponsiveValue(padding),
    width: '100%',
    margin: centered ? '0 auto' : undefined,
  }

  return (
    <div className={`responsive-container ${className}`} style={containerStyles}>
      {children}
    </div>
  )
}
