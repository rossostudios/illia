'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'placeholder'> {
  fallbackSrc?: string
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2' | 'auto'
  lazy?: boolean
}

// Generate blur placeholder (you'd typically generate these at build time)
const shimmer = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="icon">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#f3f4f6" offset="20%" />
        <stop stop-color="#e5e7eb" offset="50%" />
        <stop stop-color="#f3f4f6" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#f3f4f6" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

const dataUrl = (w: number, h: number) => `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/placeholder.jpg',
  aspectRatio = 'auto',
  lazy = true,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [isInView, setIsInView] = useState(!lazy)
  const imageRef = useRef<HTMLDivElement>(null)

  const aspectRatioClasses = {
    square: 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    auto: '',
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!(lazy && imageRef.current)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    )

    observer.observe(imageRef.current)

    return () => {
      observer.disconnect()
    }
  }, [lazy])

  const handleError = () => {
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div
      className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`}
      ref={imageRef}
    >
      {isInView ? (
        <>
          <Image
            {...props}
            alt={alt}
            blurDataURL={dataUrl(700, 475)}
            className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}
              ${props.className || ''}
            `}
            fill={!(props.width || props.height)}
            onError={handleError}
            onLoad={handleLoad}
            placeholder="blur"
            sizes={props.sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
            src={imageSrc}
          />
          {isLoading && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
        </>
      ) : (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
    </div>
  )
}

// Progressive image component that loads low quality first
export function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  className = '',
  ...props
}: OptimizedImageProps & { lowQualitySrc?: string }) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src)
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false)

  useEffect(() => {
    if (!lowQualitySrc) {
      return
    }

    const img = new window.Image()
    img.src = src as string
    img.onload = () => {
      setCurrentSrc(src)
      setIsHighQualityLoaded(true)
    }
  }, [src, lowQualitySrc])

  return (
    <div className={`relative ${className}`}>
      <OptimizedImage
        {...props}
        alt={alt}
        className={`transition-all duration-500 ${!isHighQualityLoaded && lowQualitySrc ? 'scale-105 blur-sm' : ''}
        `}
        src={currentSrc}
      />
    </div>
  )
}
