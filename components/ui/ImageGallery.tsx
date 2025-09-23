'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface ImageGalleryProps {
  images: {
    src: string
    alt?: string
    caption?: string
  }[]
  className?: string
  aspectRatio?: 'square' | '16/9' | '4/3' | 'auto'
}

export function ImageGallery({ images, className = '', aspectRatio = 'auto' }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const aspectRatioClasses = {
    square: 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    auto: '',
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    setIsFullscreen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setIsFullscreen(false)
    setSelectedIndex(null)
    document.body.style.overflow = ''
  }

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid gap-2 ${className}`}>
        {images.length === 1 && (
          <button
            onClick={() => openLightbox(0)}
            className="relative overflow-hidden rounded-lg group"
          >
            <div className={`relative ${aspectRatioClasses[aspectRatio]}`}>
              <Image
                src={images[0].src}
                alt={images[0].alt || ''}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>
          </button>
        )}

        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="relative overflow-hidden rounded-lg group"
              >
                <div className={`relative ${aspectRatioClasses[aspectRatio]}`}>
                  <Image
                    src={image.src}
                    alt={image.alt || ''}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {images.length >= 3 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {images.slice(0, 5).map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className={`relative overflow-hidden rounded-lg group ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <div className={`relative ${aspectRatioClasses[aspectRatio]} h-full`}>
                  <Image
                    src={image.src}
                    alt={image.alt || ''}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes={index === 0 ? '66vw' : '33vw'}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                  {/* Show remaining count on last image */}
                  {index === 4 && images.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">+{images.length - 5}</span>
                    </div>
                  )}

                  {index !== 4 || images.length <= 5 ? (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="h-6 w-6 text-white drop-shadow-lg" />
                    </div>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isFullscreen && selectedIndex !== null && (
        <ImageLightbox
          images={images}
          selectedIndex={selectedIndex}
          onClose={closeLightbox}
          onNavigate={setSelectedIndex}
        />
      )}
    </>
  )
}

interface ImageLightboxProps {
  images: {
    src: string
    alt?: string
    caption?: string
  }[]
  selectedIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

function ImageLightbox({ images, selectedIndex, onClose, onNavigate }: ImageLightboxProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastTouch = useRef<{ x: number; y: number } | null>(null)
  const lastDistance = useRef<number | null>(null)

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      onNavigate(selectedIndex - 1)
      resetZoom()
    }
  }

  const handleNext = () => {
    if (selectedIndex < images.length - 1) {
      onNavigate(selectedIndex + 1)
      resetZoom()
    }
  }

  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 1))
    if (scale <= 1.5) {
      setPosition({ x: 0, y: 0 })
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrevious, onClose])

  // Touch handlers for pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      lastDistance.current = distance
    } else if (e.touches.length === 1) {
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      isDragging.current = true
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDistance.current) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const delta = distance - lastDistance.current
      setScale((prev) => Math.min(Math.max(prev + delta * 0.01, 1), 3))
      lastDistance.current = distance
    } else if (e.touches.length === 1 && isDragging.current && scale > 1) {
      const deltaX = e.touches[0].clientX - (lastTouch.current?.x || 0)
      const deltaY = e.touches[0].clientY - (lastTouch.current?.y || 0)
      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }))
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }

  const handleTouchEnd = () => {
    lastDistance.current = null
    lastTouch.current = null
    isDragging.current = false
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex flex-col"
        onClick={onClose}
      >
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-center gap-4">
            <span className="text-white text-sm">
              {selectedIndex + 1} / {images.length}
            </span>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomOut()
                }}
                disabled={scale <= 1}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors disabled:opacity-50"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomIn()
                }}
                disabled={scale >= 3}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors disabled:opacity-50"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Image */}
        <div
          className="flex-1 flex items-center justify-center relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            ref={imageRef}
            animate={{
              scale,
              x: position.x,
              y: position.y,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative max-w-full max-h-full"
            style={{ touchAction: 'none' }}
          >
            <Image
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt || ''}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </motion.div>

          {/* Navigation arrows */}
          {selectedIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
          )}

          {selectedIndex < images.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          )}
        </div>

        {/* Caption */}
        {images[selectedIndex].caption && (
          <div className="p-4 bg-gradient-to-t from-black/50 to-transparent">
            <p className="text-white text-center">{images[selectedIndex].caption}</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
