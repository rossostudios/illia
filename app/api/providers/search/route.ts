import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Extract query parameters
  const search = searchParams.get('search') || ''
  const city = searchParams.get('city') || ''
  const service = searchParams.get('service') || ''
  const location = searchParams.get('location') || ''
  const minRating = Number.parseFloat(searchParams.get('minRating') || '0')
  const verified = searchParams.get('verified') === 'true'
  const limit = Number.parseInt(searchParams.get('limit') || '20', 10)
  const offset = Number.parseInt(searchParams.get('offset') || '0', 10)

  const supabase = await createServiceClient()

  try {
    let query = supabase
      .from('service_providers')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('rating_avg', { ascending: false })

    // Apply filters
    if (search) {
      // Search in name, bio, and services
      query = query.or(`name.ilike.%${search}%,bio.ilike.%${search}%`)
    }

    if (city) {
      query = query.eq('city', city)
    }

    if (service && service !== 'All Services') {
      // Search for service in the services array
      query = query.contains('services', [service])
    }

    if (location && location !== 'All Areas') {
      query = query.ilike('location', `%${location}%`)
    }

    if (minRating > 0) {
      query = query.gte('rating_avg', minRating)
    }

    if (verified) {
      query = query.eq('status', 'verified')
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
    }

    // Transform data to match frontend expectations with all required fields
    const providers = (data || []).map((provider) => ({
      ...provider,
      verified: provider.status === 'verified',
      rating: provider.rating_avg || 0,
      reviewCount: provider.reviews_count || 0,
      // Ensure all frontend-expected fields are present
      avatar_url: provider.avatar_url || provider.photo_url || null,
      is_active: provider.is_active ?? true,
      completed_jobs: provider.completed_jobs || 0,
      badges: provider.badges || [],
      location: provider.location || provider.neighborhood || '',
      response_time_hours: provider.response_time_hours || 24,
      acceptance_rate: provider.acceptance_rate || 100,
      cancellation_rate: provider.cancellation_rate || 0,
    }))

    return NextResponse.json({
      providers,
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, providerId } = body

    if (!(userId && providerId)) {
      return NextResponse.json({ error: 'User ID and Provider ID are required' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // Check if match already exists
    const { data: existingMatch } = await supabase
      .from('matches')
      .select('id')
      .eq('user_id', userId)
      .eq('provider_id', providerId)
      .single()

    if (existingMatch) {
      return NextResponse.json({ error: 'Match already exists' }, { status: 400 })
    }

    // Create new match
    const { data, error } = await supabase
      .from('matches')
      .insert({
        user_id: userId,
        provider_id: providerId,
        status: 'pending',
        match_score: 0.85, // Calculate this based on compatibility
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating match:', error)
      return NextResponse.json({ error: 'Failed to create match' }, { status: 500 })
    }

    return NextResponse.json({ match: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
