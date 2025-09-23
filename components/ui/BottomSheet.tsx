'use client'

import { AnimatePresence, motion, useAnimation, useDragControls } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  height?: 'auto' | 'full' | 'half' | number
  showHandle?: boolean
  closeOnOverlayClick?: boolean
  closeOnSwipeDown?: boolean
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
  showHandle = true,
  closeOnOverlayClick = true,
  closeOnSwipeDown = true,
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(false)
  const controls = useAnimation()
  const dragControls = useDragControls()
  const _constraintsRef = useRef(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      controls.start('visible')
      // Prevent body scroll when bottom sheet is open
      document.body.style.overflow = 'hidden'
    } else {
      controls.start('hidden')
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, controls])

  const handleDragEnd = (_: any, info: any) => {
    const shouldClose = info.velocity.y > 20 || info.offset.y > 100
    if (shouldClose && closeOnSwipeDown) {
      onClose()
    } else {
      controls.start('visible')
    }
  }

  const getHeightValue = () => {
    if (height === 'full') return '100vh'
    if (height === 'half') return '50vh'
    if (height === 'auto') return 'auto'
    return `${height}px`
  }

  const sheetContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial="hidden"
            animate={controls}
            exit="hidden"
            variants={{
              visible: { y: 0 },
              hidden: { y: '100%' },
            }}
            transition={{
              type: 'spring',
              damping: 40,
              stiffness: 400,
            }}
            drag={closeOnSwipeDown ? 'y' : false}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl"
            style={{
              maxHeight: getHeightValue(),
              height: height === 'auto' ? 'auto' : getHeightValue(),
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Bottom sheet'}
          >
            {/* Drag Handle */}
            {showHandle && (
              <div
                className="w-full py-3 cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => closeOnSwipeDown && dragControls.start(e)}
              >
                <div className="mx-auto w-12 h-1 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-4 pb-3 border-b">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            )}

            {/* Content */}
            <div
              className={`overflow-y-auto overscroll-contain ${
                height === 'auto' ? 'max-h-[80vh]' : ''
              }`}
            >
              <div className="px-4 py-4">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  // Only render in the browser
  if (!mounted) return null

  return createPortal(sheetContent, document.body)
}

// Hook for managing bottom sheet state
export function useBottomSheet() {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen((prev) => !prev)

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}
