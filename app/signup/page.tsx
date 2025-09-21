'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the unified login page
    router.push('/login')
  }, [router])

  return null // Redirecting...
}