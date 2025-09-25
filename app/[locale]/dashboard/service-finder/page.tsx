'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ServiceFinderRedirect() {
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale || 'en'

  useEffect(() => {
    // Redirect to the explore page with proper locale
    router.replace(`/${locale}/dashboard/explore`)
  }, [router, locale])

  return null
}
