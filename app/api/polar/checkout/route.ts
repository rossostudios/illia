import { type NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, POLAR_PRODUCTS } from '@/lib/polar'
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
    const { productType, returnUrl } = body

    // Map product type to Polar product ID
    const productId = POLAR_PRODUCTS[productType as keyof typeof POLAR_PRODUCTS]
    if (!productId) {
      return NextResponse.json({ error: 'Invalid product type' }, { status: 400 })
    }

    // Create success URL with proper domain
    const successUrl = `${returnUrl}?checkout_id={CHECKOUT_ID}&success=true`

    // Create checkout session
    const session = await createCheckoutSession({
      productId,
      successUrl,
      customerEmail: user.email,
      metadata: {
        userId: user.id,
        userEmail: user.email,
        productType,
      },
    })

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
