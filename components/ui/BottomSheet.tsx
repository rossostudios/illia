'use client'

import { AnimatePresence, motion, useAnimation, useDragControls } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type BottomSheetProps = {
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
    if (height === 'full') {
      return '100vh'
    }
    if (height === 'half') {
      return '50vh'
    }
    if (height === 'auto') {
      return 'auto'
    }
    return `${height}px`
  }

  const sheetContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/50"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Bottom Sheet */}
          <motion.div
            animate={controls}
            aria-label={title || 'Bottom sheet'}
            aria-modal="true"
            className="fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl bg-white shadow-xl"
            drag={closeOnSwipeDown ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragControls={dragControls}
            dragElastic={{ top: 0, bottom: 0.5 }}
            dragListener={false}
            exit="hidden"
            initial="hidden"
            onDragEnd={handleDragEnd}
            ref={sheetRef}
            role="dialog"
            style={{
              maxHeight: getHeightValue(),
              height: height === 'auto' ? 'auto' : getHeightValue(),
            }}
            transition={{
              type: 'spring',
              damping: 40,
              stiffness: 400,
            }}
            variants={{
              visible: { y: 0 },
              hidden: { y: '100%' },
            }}
          >
            {/* Drag Handle */}
            {showHandle && (
              <div
                className="w-full cursor-grab py-3 active:cursor-grabbing"
                onPointerDown={(e) => closeOnSwipeDown && dragControls.start(e)}
              >
                <div className="mx-auto h-1 w-12 rounded-full bg-gray-300" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between border-b px-4 pb-3">
                <h2 className="font-semibold text-gray-900 text-lg">{title}</h2>
                <button
                  aria-label="Close"
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onClick={onClose}
                  type="button"
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
  if (!mounted) {
    return null
  }

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
