'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Info, Trash2, X } from 'lucide-react'
import { createContext, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type ConfirmDialogType = 'danger' | 'warning' | 'info'

type ConfirmDialogOptions = {
  title: string
  description: string
  type?: ConfirmDialogType
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  icon?: React.ReactNode
}

type ConfirmDialogContextType = {
  confirm: (options: ConfirmDialogOptions) => void
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null)

export function useConfirm() {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmDialogProvider')
  }
  return context
}

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<ConfirmDialogOptions | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const confirm = (options: ConfirmDialogOptions) => {
    setDialog(options)
    setIsOpen(true)
  }

  const handleConfirm = async () => {
    if (dialog?.onConfirm) {
      await dialog.onConfirm()
    }
    setIsOpen(false)
    setTimeout(() => setDialog(null), 200)
  }

  const handleCancel = () => {
    if (dialog?.onCancel) {
      dialog.onCancel()
    }
    setIsOpen(false)
    setTimeout(() => setDialog(null), 200)
  }

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <ConfirmDialogModal
          {...dialog}
          isOpen={isOpen}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </ConfirmDialogContext.Provider>
  )
}

function ConfirmDialogModal({
  title,
  description,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  icon,
  isOpen,
}: ConfirmDialogOptions & { isOpen: boolean; onCancel: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  const icons = {
    danger: <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />,
    warning: <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
    info: <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
  }

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
    warning: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600',
    info: 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600',
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900"
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              onClick={onCancel}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              {icon || icons[type]}
            </div>

            {/* Content */}
            <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-white">{title}</h3>
            <p className="mb-6 text-gray-600 text-sm dark:text-gray-400">{description}</p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={loading}
                onClick={onCancel}
              >
                {cancelText}
              </button>
              <button
                className={`flex-1 rounded-lg px-4 py-2.5 font-medium text-sm text-white transition-colors disabled:opacity-50 ${buttonColors[type]}`}
                disabled={loading}
                onClick={handleConfirm}
              >
                {loading ? 'Loading...' : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
