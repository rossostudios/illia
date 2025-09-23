import { Polar } from '@polar-sh/sdk'

// Initialize Polar client for server-side operations
export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || '',
  server: 'production', // Use production server
})

// Organization ID for your Polar account
export const POLAR_ORGANIZATION_ID = process.env.NEXT_PUBLIC_POLAR_ORGANIZATION_ID || 'illia-club'

// Product IDs for different subscription tiers
export const POLAR_PRODUCTS = {
  // Explorer tier - Basic access for nomads exploring services
  explorer: process.env.NEXT_PUBLIC_POLAR_PRODUCT_EXPLORER || '',
  // Settler tier - For nomads who have settled and need regular services
  settler: process.env.NEXT_PUBLIC_POLAR_PRODUCT_SETTLER || '',
  // Local tier - Full access with priority matching
  local: process.env.NEXT_PUBLIC_POLAR_PRODUCT_LOCAL || '',
}

// Meter configurations for usage tracking
export const POLAR_METERS = {
  matchRequests: 'match_requests',
  apiCalls: 'api_calls',
  conciergeRequests: 'concierge_requests',
}

// Monthly meter limits by tier
export const TIER_LIMITS = {
  explorer: {
    matchRequests: 3,
    apiCalls: 100,
    conciergeRequests: 0,
  },
  settler: {
    matchRequests: 20,
    apiCalls: 500,
    conciergeRequests: 0,
  },
  local: {
    matchRequests: 9999, // Effectively unlimited
    apiCalls: 9999,
    conciergeRequests: 10,
  },
}

export interface PolarCheckoutSession {
  id: string
  url: string
  clientSecret: string
  successUrl: string
  expiresAt: Date
}

export interface PolarSubscription {
  id: string
  status: string
  productId: string
  customerId: string
  amount: number
  currency: string
  recurringInterval: 'month' | 'year'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

/**
 * Create a checkout session for a product
 */
export async function createCheckoutSession({
  productId,
  successUrl,
  customerEmail,
  metadata = {},
}: {
  productId: string
  successUrl: string
  customerEmail?: string
  metadata?: Record<string, any>
}) {
  try {
    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl,
      customerEmail,
      metadata,
      allowDiscountCodes: true,
      requireBillingAddress: false,
    })

    return {
      id: checkout.id,
      url: checkout.url,
      clientSecret: checkout.clientSecret,
      successUrl: checkout.successUrl,
      expiresAt: checkout.expiresAt,
    } as PolarCheckoutSession
  } catch (error) {
    console.error('Error creating Polar checkout session:', error)
    throw error
  }
}

/**
 * Get customer's active subscriptions
 */
export async function getCustomerSubscriptions(_customerEmail: string) {
  try {
    const result = await polar.subscriptions.list({
      organizationId: POLAR_ORGANIZATION_ID,
      // You might need to filter by customer email through metadata or customer lookup
    })

    // Extract subscriptions from the result
    const subscriptions = result.result || []

    return subscriptions
  } catch (error) {
    console.error('Error fetching customer subscriptions:', error)
    throw error
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await polar.subscriptions.revoke({
      id: subscriptionId,
    })
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

/**
 * Update subscription (e.g., change plan)
 */
export async function updateSubscription(
  subscriptionId: string,
  _updates: {
    productPriceId?: string
    metadata?: Record<string, any>
  }
) {
  try {
    const subscription = await polar.subscriptions.update({
      id: subscriptionId,
      subscriptionUpdate: {} as any, // Use any for now since the API may not support these fields
    })
    return subscription
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}

/**
 * Create a customer portal session for subscription management
 */
export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  // Polar handles customer portal differently - typically through their hosted pages
  // You would redirect users to Polar's customer portal URL
  const portalUrl = `https://polar.sh/dashboard/purchases`
  return portalUrl
}

/**
 * Track meter usage for a customer
 */
export async function trackMeterUsage({
  customerId,
  meterType,
  quantity = 1,
}: {
  customerId: string
  meterType: keyof typeof POLAR_METERS
  quantity?: number
}) {
  try {
    // In a real implementation, you would call Polar's meter API
    // This is a placeholder for the meter tracking logic
    console.log(`Tracking ${quantity} ${meterType} for customer ${customerId}`)

    // You would typically make an API call like:
    // await polar.meters.create({
    //   customerId,
    //   meterId: POLAR_METERS[meterType],
    //   quantity,
    //   timestamp: new Date().toISOString(),
    // })

    return { success: true, meterType, quantity }
  } catch (error) {
    console.error('Error tracking meter usage:', error)
    throw error
  }
}

/**
 * Get remaining meter credits for a customer
 */
export async function getRemainingCredits(
  _customerId: string,
  subscriptionTier: 'explorer' | 'settler' | 'local'
) {
  try {
    // In production, fetch actual usage from Polar
    // This is a placeholder showing the structure
    const limits = TIER_LIMITS[subscriptionTier]

    // Mock current usage (replace with actual API call)
    const currentUsage = {
      matchRequests: 0,
      apiCalls: 0,
      conciergeRequests: 0,
    }

    return {
      matchRequests: {
        used: currentUsage.matchRequests,
        limit: limits.matchRequests,
        remaining: limits.matchRequests - currentUsage.matchRequests,
      },
      apiCalls: {
        used: currentUsage.apiCalls,
        limit: limits.apiCalls,
        remaining: limits.apiCalls - currentUsage.apiCalls,
      },
      conciergeRequests: {
        used: currentUsage.conciergeRequests,
        limit: limits.conciergeRequests,
        remaining: limits.conciergeRequests - currentUsage.conciergeRequests,
      },
    }
  } catch (error) {
    console.error('Error fetching remaining credits:', error)
    throw error
  }
}
