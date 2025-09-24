'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { usePolar } from '@/hooks/use-polar'

type PolarCheckoutButtonProps = {
  productType: 'explorer' | 'settler' | 'local'
  className?: string
  children: React.ReactNode
}

export default function PolarCheckoutButton({
  productType,
  className = '',
  children,
}: PolarCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const { createCheckout } = usePolar()

  const handleCheckout = async () => {
    try {
      setLoading(true)

      // For free tier (explorer), redirect to the explorer checkout
      // Even though it's free, we still want to track signups
      const checkoutUrl = `/api/checkout/${productType}`

      // Redirect to the appropriate checkout route
      window.location.href = checkoutUrl
    } catch (_error) {
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className={`${className} ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
      disabled={loading}
      onClick={handleCheckout}
      type="button"
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
