'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { usePolar } from '@/hooks/usePolar'

interface PolarCheckoutButtonProps {
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
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
