import { Webhooks } from '@polar-sh/nextjs'
import { createClient } from '@/lib/supabase/server'

// Use the Polar Webhooks handler for proper signature verification and event handling
export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  // General payload handler
  onPayload: async (_payload) => {},

  // Handle successful order payment
  onOrderPaid: async (payload) => {
    const supabase = await createClient()
    const orderData = payload.data
    const { metadata } = orderData

    if (metadata?.userId) {
      // Update user's subscription status in database
      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: String(metadata.userId),
          subscription_id: String(orderData.subscriptionId),
          product_id: String(orderData.productId),
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: orderData.subscription?.currentPeriodEnd?.toISOString() || null,
          metadata: orderData as any,
          updated_at: new Date().toISOString(),
        })
        .select()
    }
  },

  // Handle new subscription creation
  onSubscriptionCreated: async (payload) => {
    const supabase = await createClient()
    const subscriptionData = payload.data
    const subMetadata = subscriptionData.metadata

    if (subMetadata?.userId) {
      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: String(subMetadata.userId),
          subscription_id: String(subscriptionData.id),
          product_id: String(subscriptionData.productId),
          status: String(subscriptionData.status),
          current_period_start: subscriptionData.currentPeriodStart?.toISOString() || null,
          current_period_end: subscriptionData.currentPeriodEnd?.toISOString() || null,
          metadata: subscriptionData as any,
          updated_at: new Date().toISOString(),
        })
        .select()
    }
  },

  // Handle subscription updates (upgrades, downgrades)
  onSubscriptionUpdated: async (payload) => {
    const supabase = await createClient()
    const updatedSub = payload.data

    await supabase
      .from('user_subscriptions')
      .update({
        status: String(updatedSub.status),
        product_id: String(updatedSub.productId),
        current_period_start: updatedSub.currentPeriodStart?.toISOString() || null,
        current_period_end: updatedSub.currentPeriodEnd?.toISOString() || null,
        metadata: updatedSub as any,
        updated_at: new Date().toISOString(),
      })
      .eq('subscription_id', updatedSub.id)
  },

  // Handle subscription revocation
  onSubscriptionRevoked: async (payload) => {
    const supabase = await createClient()
    const cancelledSub = payload.data

    await supabase
      .from('user_subscriptions')
      .update({
        status: 'revoked',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('subscription_id', cancelledSub.id)
  },

  // Handle subscription cancellation
  onSubscriptionCanceled: async (payload) => {
    const supabase = await createClient()
    const cancelledSub = payload.data

    await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('subscription_id', cancelledSub.id)
  },

  // Handle checkout events if needed
  onCheckoutCreated: async (_payload) => {},

  onCheckoutUpdated: async (_payload) => {},
})
