'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ServiceFinderRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/explore')
  }, [router])

  return null
}