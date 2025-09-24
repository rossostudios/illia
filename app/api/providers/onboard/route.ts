import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const body = await request.json()

    // Extract and validate data
    const {
      name,
      email,
      phone,
      whatsapp_number,
      bio,
      photo_url,
      city,
      services,
      languages,
      specialties,
      rate_hourly,
      rate_weekly,
      rate_monthly,
      currency,
      years_experience,
    } = body

    // Validation
    if (!(name && email && bio && city && services?.length && languages?.length)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if provider already exists
    const { data: existingProvider } = await supabase
      .from('service_providers')
      .select('id')
      .eq('email', email)
      .single()

    if (existingProvider) {
      return NextResponse.json(
        { error: 'A provider with this email already exists' },
        { status: 409 }
      )
    }

    // Insert new provider
    const { data: provider, error } = await supabase
      .from('service_providers')
      .insert({
        name,
        email,
        phone: phone || null,
        whatsapp: whatsapp_number || null,
        bio,
        photo_url: photo_url || null,
        city,
        neighborhood: null, // Can be added later
        services,
        languages,
        specialties: specialties || [],
        years_experience: years_experience || null,
        rate_hourly: rate_hourly || null,
        rate_monthly: rate_monthly || null,
        rate_description: null,
        availability: 'Flexible', // Default
        documents_verified: false,
        background_check: false,
        status: 'pending', // Will be reviewed by admin
        featured: false,
        rating_avg: null,
        reviews_count: 0,
        active: false, // Will be activated after review
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create provider profile' }, { status: 500 })
    }

    // TODO: Send welcome email to provider
    // TODO: Notify admin for review

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      provider: {
        id: provider.id,
        name: provider.name,
        status: provider.status,
      },
    })
  } catch (_error) {
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 })
  }
}

// GET endpoint to check if email is already registered
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 })
    }

    const { data: provider } = await supabase
      .from('service_providers')
      .select('id, status')
      .eq('email', email)
      .single()

    return NextResponse.json({
      exists: !!provider,
      status: provider?.status || null,
    })
  } catch (_error) {
    return NextResponse.json({ exists: false, status: null })
  }
}
