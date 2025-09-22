'use client'

import { PolarProvider as BasePolarProvider } from '@polar-sh/nextjs'
import type { ReactNode } from 'react'

interface PolarProviderProps {
  children: ReactNode
}

export default function PolarProvider({ children }: PolarProviderProps) {
  return (
    <BasePolarProvider
      accessToken={process.env.NEXT_PUBLIC_POLAR_ACCESS_TOKEN}
      organizationId={process.env.NEXT_PUBLIC_POLAR_ORGANIZATION_ID || 'illia-club'}
    >
      {children}
    </BasePolarProvider>
  )
}
