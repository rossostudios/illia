'use client'

import { useCallback, useRef, useState } from 'react'

type VirtualListProps<T> = {
  items: T[]
  height: number // Container height
  itemHeight: number | ((index: number) => number) // Item height (fixed or dynamic)
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number // Number of items to render outside visible area
  className?: string
  onScroll?: (scrollTop: number) => void
  onEndReached?: () => void
  endReachedThreshold?: number
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  className = '',
  onScroll,
  onEndReached,
  endReachedThreshold = 100,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  // Calculate item positions
  const getItemHeight = useCallback(
    (index: number) => (typeof itemHeight === 'function' ? itemHeight(index) : itemHeight),
    [itemHeight]
  )

  // Calculate total height
  const totalHeight = items.reduce((acc, _, index) => acc + getItemHeight(index), 0)

  // Calculate visible range
  const getVisibleRange = useCallback(() => {
    let accumulatedHeight = 0
    let startIndex = 0
    let endIndex = items.length - 1

    // Find start index
    for (let i = 0; i < items.length; i++) {
      const currentItemHeight = getItemHeight(i)
      if (accumulatedHeight + currentItemHeight > scrollTop) {
        startIndex = Math.max(0, i - overscan)
        break
      }
      accumulatedHeight += currentItemHeight
    }

    // Find end index
    accumulatedHeight = 0
    for (let i = startIndex; i < items.length; i++) {
      if (accumulatedHeight > scrollTop + height) {
        endIndex = Math.min(items.length - 1, i + overscan)
        break
      }
      accumulatedHeight += getItemHeight(i)
    }

    return { startIndex, endIndex }
  }, [items.length, scrollTop, height, overscan, getItemHeight])

  const { startIndex, endIndex } = getVisibleRange()

  // Calculate offset for visible items
  const getItemOffset = useCallback(
    (index: number) => {
      let offset = 0
      for (let i = 0; i < index; i++) {
        offset += getItemHeight(i)
      }
      return offset
    },
    [getItemHeight]
  )

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop
      setScrollTop(newScrollTop)
      onScroll?.(newScrollTop)

      // Detect end reached
      if (onEndReached && totalHeight - (newScrollTop + height) < endReachedThreshold) {
        onEndReached()
      }

      // Optimize scrolling performance
      if (!isScrolling.current) {
        isScrolling.current = true
      }

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false
      }, 150)
    },
    [height, totalHeight, endReachedThreshold, onScroll, onEndReached]
  )

  // Render visible items
  const visibleItems = []
  for (let i = startIndex; i <= endIndex; i++) {
    const item = items[i]
    if (item !== undefined) {
      visibleItems.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: getItemHeight(i),
            transform: `translateY(${getItemOffset(i)}px)`,
          }}
        >
          {renderItem(item, i)}
        </div>
      )
    }
  }

  return (
    <div
      className={`overflow-auto ${className}`}
      onScroll={handleScroll}
      ref={scrollElementRef}
      style={{ height }}
    >
      <div
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        {visibleItems}
      </div>
    </div>
  )
}

// Hook for managing virtual list state
export function useVirtualList<T>(items: T[]) {
  const [visibleItems, setVisibleItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = useCallback(
    async (loadFn: () => Promise<T[]>) => {
      if (isLoading) {
        return
      }

      setIsLoading(true)
      try {
        const newItems = await loadFn()
        setVisibleItems((prev) => [...prev, ...newItems])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading]
  )

  return {
    visibleItems: visibleItems.length > 0 ? visibleItems : items,
    isLoading,
    loadMore,
  }
}
