'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastProps = {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const colors = {
  success:
    'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
  error:
    'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
  warning:
    'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
}

const iconColors = {
  success: 'text-green-500 dark:text-green-400',
  error: 'text-red-500 dark:text-red-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  info: 'text-blue-500 dark:text-blue-400',
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const Icon = icons[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      aria-live="polite"
      className={`flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg ${colors[type]} pointer-events-auto`}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      layout
      role="alert"
    >
      <Icon aria-hidden="true" className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColors[type]}`} />
      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
      </div>
      <button
        aria-label="Close notification"
        className="inline-flex flex-shrink-0 rounded-md p-1.5 transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-900 dark:hover:bg-white/5"
        onClick={() => onClose(id)}
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

type ToastContainerProps = {
  toasts: ToastProps[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="pointer-events-none fixed right-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <AnimatePresence mode="sync">
        <div className="flex flex-col gap-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={onClose} />
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}
