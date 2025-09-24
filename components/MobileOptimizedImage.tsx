'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface MobileOptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  quality?: number
}

export default function MobileOptimizedImage({
  src,
  alt,
  width = 500,
  height = 300,
  priority = false,
  className = '',
  objectFit = 'cover',
  quality = 75,
}: MobileOptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [devicePixelRatio, setDevicePixelRatio] = useState(1)

  useEffect(() => {
    setDevicePixelRatio(window.devicePixelRatio || 1)
  }, [])

  // Adjust quality based on network conditions
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as string).connection
      if (connection) {
        const effectiveType = connection.effectiveType
        if (effectiveType === '2g' || effectiveType === 'slow-2g') {
          quality = 50
        } else if (effectiveType === '3g') {
          quality = 60
        }
      }
    }
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton loader */}
      {isLoading && (
        <motion.div
          animate={{
            background: [
              'linear-gradient(90deg, #e5e5e5 0%, #f0f0f0 50%, #e5e5e5 100%)',
              'linear-gradient(90deg, #f0f0f0 0%, #e5e5e5 50%, #f0f0f0 100%)',
            ],
          }}
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700"
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        />
      )}

      {/* Progressive image loading */}
      <Image
        alt={alt}
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoading(false)}
        placeholder="blur"
        priority={priority}
        quality={quality}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 70vw"
        src={src}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: objectFit as any,
        }}
        width={width}
      />
    </div>
  )
}

// Shimmer effect for placeholder
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="icon">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0f0f0" offset="20%" />
      <stop stop-color="#e0e0e0" offset="50%" />
      <stop stop-color="#f0f0f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0f0f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : btoa(str)
