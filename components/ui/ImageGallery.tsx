'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type ImageGalleryProps = {
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

  useEffect(
    () => () => {
      document.body.style.overflow = ''
    },
    []
  )

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid gap-2 ${className}`}>
        {images.length === 1 && (
          <button className="group relative overflow-hidden rounded-lg" onClick={() => openLightbox(0)}
            type="button"
          >
            <div className={`relative ${aspectRatioClasses[aspectRatio]}`}>
              <Image
                alt={images[0].alt || ''}
                className="object-cover transition-transform group-hover:scale-105"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={images[0].src}
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>
          </button>
        )}

        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <button className="group relative overflow-hidden rounded-lg" key={index}
                onClick={() => openLightbox(index)}
                type="button"
              >
                <div className={`relative ${aspectRatioClasses[aspectRatio]}`}>
                  <Image
                    alt={image.alt || ''}
                    className="object-cover transition-transform group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    src={image.src}
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {images.length >= 3 && (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {images.slice(0, 5).map((image, index) => (
              <button className={`group relative overflow-hidden rounded-lg ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`} key={index}
                onClick={() => openLightbox(index)}
                type="button"
              >
                <div className={`relative ${aspectRatioClasses[aspectRatio]} h-full`}>
                  <Image
                    alt={image.alt || ''}
                    className="object-cover transition-transform group-hover:scale-105"
                    fill
                    sizes={index === 0 ? '66vw' : '33vw'}
                    src={image.src}
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

                  {/* Show remaining count on last image */}
                  {index === 4 && images.length > 5 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="font-bold text-2xl text-white">+{images.length - 5}</span>
                    </div>
                  )}

                  {index !== 4 || images.length <= 5 ? (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
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
          onClose={closeLightbox}
          onNavigate={setSelectedIndex}
          selectedIndex={selectedIndex}
        />
      )}
    </>
  )
}

type ImageLightboxProps = {
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
      if (e.key === 'Escape') {
        onClose()
      }
      if (e.key === 'ArrowLeft') {
        handlePrevious()
      }
      if (e.key === 'ArrowRight') {
        handleNext()
      }
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
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex flex-col bg-black"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-4">
          <button aria-label="Close" className="rounded-full bg-black/30 p-2 transition-colors hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }
            type="button"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-white">
              {selectedIndex + 1} / {images.length}
            </span>

            <div className="flex gap-2">
              <button aria-label="Zoom out" className="rounded-full bg-black/30 p-2 transition-colors hover:bg-black/50 disabled:opacity-50"
                disabled={scale <= 1}
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomOut()
                }
                
              >
                <ZoomOut className="h-5 w-5 text-white" />
              </button>
              <button aria-label="Zoom in" className="rounded-full bg-black/30 p-2 transition-colors hover:bg-black/50 disabled:opacity-50"
                disabled={scale >= 3}
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomIn()
                }}
                
              >
                <ZoomIn className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Image */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
        >
          <motion.div
            animate={{
              scale,
              x: position.x,
              y: position.y,
            }}
            className="relative max-h-full max-w-full"
            ref={imageRef}
            style={{ touchAction: 'none' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Image
              alt={images[selectedIndex].alt || ''}
              className="max-h-full max-w-full object-contain"
              height={800}
              priority
              src={images[selectedIndex].src}
              width={1200}
            />
          </motion.div>

          {/* Navigation arrows */}
          {selectedIndex > 0 && (
            <button aria-label="Previous image" className="absolute left-4 rounded-full bg-black/30 p-2 transition-colors hover:bg-black/50"
              onClick={handlePrevious}
              
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
          )}

          {selectedIndex < images.length - 1 && (
            <button aria-label="Next image" className="absolute right-4 rounded-full bg-black/30 p-2 transition-colors hover:bg-black/50"
              onClick={handleNext}
              
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          )}
        </div>

        {/* Caption */}
        {images[selectedIndex].caption && (
          <div className="bg-gradient-to-t from-black/50 to-transparent p-4">
            <p className="text-center text-white">{images[selectedIndex].caption}</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
