'use client'

import { ConfirmDialogProvider } from '@/components/ui/ConfirmDialog'
import { SonnerToaster } from '@/components/ui/SonnerSetup'
import { ThemeProvider } from '@/hooks/use-theme'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ConfirmDialogProvider>
        {children}
        <SonnerToaster />
      </ConfirmDialogProvider>
    </ThemeProvider>
  )
}
