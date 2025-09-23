'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseLazyLoadOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  onIntersect?: () => void
}

export function useLazyLoad<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  onIntersect,
}: UseLazyLoadOptions = {}) {
  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)
  const elementRef = useRef<T>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!elementRef.current || (triggerOnce && hasBeenInView)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inView = entry.isIntersecting

          setIsInView(inView)

          if (inView) {
            setHasBeenInView(true)
            onIntersect?.()

            if (triggerOnce) {
              disconnect()
            }
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observerRef.current = observer
    observer.observe(elementRef.current)

    return () => {
      disconnect()
    }
  }, [threshold, rootMargin, triggerOnce, hasBeenInView, onIntersect, disconnect])

  return {
    ref: elementRef,
    isInView,
    hasBeenInView,
  }
}

// Hook for lazy loading images
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const [isLoading, setIsLoading] = useState(true)
  const { ref, isInView } = useLazyLoad({ triggerOnce: true })

  useEffect(() => {
    if (isInView && src) {
      const img = new Image()
      img.src = src
      img.onload = () => {
        setImageSrc(src)
        setIsLoading(false)
      }
      img.onerror = () => {
        setIsLoading(false)
      }
    }
  }, [isInView, src])

  return {
    ref,
    imageSrc,
    isLoading,
  }
}

// Hook for infinite scroll
export function useInfiniteScroll(
  loadMore: () => void | Promise<void>,
  options: {
    threshold?: number
    rootMargin?: string
    hasMore?: boolean
    isLoading?: boolean
  } = {}
) {
  const { threshold = 0.1, rootMargin = '100px', hasMore = true, isLoading = false } = options
  const [isFetching, setIsFetching] = useState(false)
  const { ref } = useLazyLoad({
    threshold,
    rootMargin,
    triggerOnce: false,
    onIntersect: async () => {
      if (!hasMore || isLoading || isFetching) return

      setIsFetching(true)
      try {
        await loadMore()
      } finally {
        setIsFetching(false)
      }
    },
  })

  return {
    ref,
    isFetching,
  }
}
