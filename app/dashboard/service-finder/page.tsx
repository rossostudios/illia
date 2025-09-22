'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ServiceFinderRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/explore')
  }, [router])

  return null
}
