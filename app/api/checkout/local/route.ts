import { Checkout } from '@polar-sh/nextjs'

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/membership?success=true&tier=local&checkout_id={CHECKOUT_ID}`,
  server: 'production', // Use 'sandbox' for testing
  includeCheckoutId: true,
})
