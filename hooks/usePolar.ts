'use client'

import { useCallback } from 'react'
import { POLAR_PRODUCTS } from '@/lib/polar'

// Client-side hook for Polar checkout functionality
export function usePolar() {
  const createCheckout = useCallback(async (productType: 'explorer' | 'settler' | 'local') => {
    const productId = POLAR_PRODUCTS[productType]
    if (!productId) {
      throw new Error(`Invalid product type: ${productType}`)
    }

    try {
      // Redirect to the checkout route with the product ID
      const checkoutUrl = `/api/checkout/${productType}`
      return {
        url: checkoutUrl,
        productId,
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      throw error
    }
  }, [])

  const getSubscription = useCallback(async () => {
    try {
      // Call our API to get subscription status
      const response = await fetch('/api/subscription')
      if (!response.ok) {
        return null
      }
      const data = await response.json()
      return data.subscription
    } catch (error) {
      console.error('Error fetching subscription:', error)
      return null
    }
  }, [])

  const cancelSubscription = useCallback(async (subscriptionId: string) => {
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      })
      return response.ok
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return false
    }
  }, [])

  return {
    createCheckout,
    getSubscription,
    cancelSubscription,
  }
}
