'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import type { ToastProps } from '@/components/ui/Toast'
import { ToastContainer } from '@/components/ui/Toast'

type ToastContextValue = {
  toast: (options: Omit<ToastProps, 'id' | 'onClose'>) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (options: Omit<ToastProps, 'id' | 'onClose'>) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastProps = {
        ...options,
        id,
        onClose: removeToast,
      }
      setToasts((prev) => [...prev, newToast])
    },
    [removeToast]
  )

  const toast = useCallback(
    (options: Omit<ToastProps, 'id' | 'onClose'>) => {
      addToast(options)
    },
    [addToast]
  )

  const success = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'success', title, message })
    },
    [addToast]
  )

  const error = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'error', title, message })
    },
    [addToast]
  )

  const warning = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'warning', title, message })
    },
    [addToast]
  )

  const info = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'info', title, message })
    },
    [addToast]
  )

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <ToastContainer onClose={removeToast} toasts={toasts} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
