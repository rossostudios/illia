'use client'

import { Toaster } from 'sonner'
import { useTheme } from '@/hooks/use-theme'

export function SonnerToaster() {
  const { theme } = useTheme()

  return (
    <Toaster
      closeButton
      expand={false}
      position="top-right"
      richColors
      theme={theme as 'light' | 'dark' | 'system'}
      toastOptions={{
        duration: 5000,
        style: {
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#f3f4f6' : '#111827',
          border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
        },
        className: 'sonner-toast',
        descriptionClassName: 'sonner-description',
        actionButtonStyle: {
          backgroundColor: '#14b8a6',
          color: '#ffffff',
        },
        cancelButtonStyle: {
          backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
          color: theme === 'dark' ? '#f3f4f6' : '#111827',
        },
      }}
    />
  )
}
