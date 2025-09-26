import { type NextRequest, NextResponse } from 'next/server'
import { TIER_LIMITS, trackMeterUsage } from '@/lib/polar'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { meterType, quantity = 1 } = body

    // Get user's subscription tier from database
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (!subscription) {
      // Default to explorer tier if no active subscription
      const limits = TIER_LIMITS.explorer

      // Check if user has credits remaining
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('feature', meterType)
        .gte('created_at', new Date(new Date().setDate(1)).toISOString()) // Current month

      const currentUsage = usage?.reduce((sum, record) => sum + (record.usage || 0), 0) || 0
      const limit = limits[meterType as keyof typeof limits]

      if (currentUsage + quantity > limit) {
        return NextResponse.json(
          { error: 'Usage limit exceeded', currentUsage, limit },
          { status: 429 }
        )
      }
    }

    // Track the usage in database
    await supabase.from('usage_tracking').insert({
      user_id: user.id,
      feature: meterType,
      usage: quantity,
      created_at: new Date().toISOString(),
    })

    // Track with Polar (when API is available)
    const customerId = (subscription?.metadata as any)?.customer_id
    if (customerId) {
      await trackMeterUsage({
        customerId,
        meterType,
        quantity,
      })
    }

    return NextResponse.json({ success: true, meterType, quantity })
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to track usage' }, { status: 500 })
  }
}

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current month's usage
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', new Date(new Date().setDate(1)).toISOString())

    // Group by feature type
    const usageSummary = usage?.reduce(
      (acc, record) => {
        if (record.feature && record.usage !== null) {
          acc[record.feature] = (acc[record.feature] || 0) + record.usage
        }
        return acc
      },
      {} as Record<string, number>
    )

    // Get user's tier
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    const tier = subscription?.plan_id?.includes('local')
      ? 'local'
      : subscription?.plan_id?.includes('settler')
        ? 'settler'
        : 'explorer'

    const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS]

    return NextResponse.json({
      tier,
      usage: usageSummary,
      limits,
      subscription: subscription
        ? {
            id: subscription.subscription_id,
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end,
          }
        : null,
    })
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 })
  }
}
