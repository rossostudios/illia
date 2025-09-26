import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a provider
    const { data: provider } = await supabase
      .from('service_providers')
      .select('id')
      .eq('user_id', user.id)
      .single() as { data: { id: string } | null; error: any }

    // Build query based on user type and filters
    let query = supabase.from('bookings').select('*')

    // Filter by user type
    if (provider) {
      query = query.eq('provider_id', provider.id)
    } else {
      query = query.eq('user_id', user.id)
    }

    // Apply filters
    const status = searchParams.get('status')
    if (status) {
      query = query.eq('status', status)
    }

    const fromDate = searchParams.get('from')
    if (fromDate) {
      query = query.gte('booking_date', fromDate)
    }

    const toDate = searchParams.get('to')
    if (toDate) {
      query = query.lte('booking_date', toDate)
    }

    // Sort by date and time
    query = query
      .order('booking_date', { ascending: searchParams.get('order') !== 'desc' })
      .order('start_time', { ascending: true })

    const { data: bookings, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      bookings: bookings || [],
      isProvider: !!provider,
    })
  } catch (_error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      provider_id,
      service_type,
      booking_date,
      start_time,
      end_time,
      duration_minutes,
      hourly_rate,
      total_amount,
      is_recurring,
      recurring_pattern,
      special_instructions,
      location_details,
    } = body

    // Validate required fields
    if (!(provider_id && service_type && booking_date && start_time && end_time)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check availability
    const { data: availabilityCheck } = await (supabase as any).rpc('check_booking_availability', {
      p_provider_id: provider_id,
      p_date: booking_date,
      p_start_time: start_time,
      p_end_time: end_time,
    })

    if (!availabilityCheck) {
      return NextResponse.json({ error: 'Time slot is not available' }, { status: 409 })
    }

    // Create the booking
    const { data: booking, error: bookingError } = await (supabase as any)
      .from('bookings')
      .insert({
        user_id: user.id,
        provider_id,
        service_type,
        booking_date,
        start_time,
        end_time,
        duration_minutes,
        hourly_rate,
        total_amount,
        currency: 'USD',
        status: 'pending',
        is_recurring,
        recurring_pattern,
        special_instructions,
        location_details,
      })
      .select()
      .single()

    if (bookingError) {
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    // Create recurring bookings if requested
    if (is_recurring && recurring_pattern) {
      const { data: recurringBookings, error: recurringError } = await (supabase as any).rpc(
        'create_recurring_bookings',
        {
          p_booking_id: booking.id,
          p_pattern: recurring_pattern,
        }
      )

      if (recurringError) {
        // Don't fail the main booking if recurring creation fails
      } else {
        booking.recurring_bookings = recurringBookings
      }
    }

    // Create initial reminders (will be triggered on confirmation)
    await (supabase as any).from('booking_reminders').insert([
      {
        booking_id: booking.id,
        reminder_type: 'confirmation',
        scheduled_for: new Date().toISOString(),
      },
    ])

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking created successfully',
    })
  } catch (_error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    // Get the booking to check ownership
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('user_id, provider_id')
      .eq('id', id)
      .single() as { data: { user_id: string; provider_id: string } | null; error: any }

    if (fetchError || !existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user is the owner or provider
    const { data: provider } = await supabase
      .from('service_providers')
      .select('id')
      .eq('user_id', user.id)
      .single() as { data: { id: string } | null; error: any }

    const isOwner = existingBooking.user_id === user.id
    const isProvider = provider?.id === existingBooking.provider_id

    if (!(isOwner || isProvider)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Restrict which fields can be updated based on role
    const allowedUpdates: Record<string, any> = {}

    if (isOwner) {
      // Users can update these fields
      const userFields = ['special_instructions', 'location_details']
      userFields.forEach((field) => {
        if (field in updates) {
          allowedUpdates[field] = updates[field]
        }
      })
    }

    if (isProvider) {
      // Providers can update status
      if ('status' in updates) {
        allowedUpdates.status = updates.status
        if (updates.status === 'confirmed') {
          allowedUpdates.confirmed_at = new Date().toISOString()
        }
        if (updates.status === 'completed') {
          allowedUpdates.completed_at = new Date().toISOString()
        }
      }
    }

    // Update the booking
    const { data: updatedBooking, error: updateError } = await (supabase as any)
      .from('bookings')
      .update({
        ...allowedUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking updated successfully',
    })
  } catch (_error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    // Get the booking to check ownership
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('user_id, provider_id, total_amount, booking_date, start_time, cancellation_policy')
      .eq('id', id)
      .single() as { data: any | null; error: any }

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user is the owner
    if (booking.user_id !== user.id) {
      // Check if user is the provider
      const { data: provider } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .single() as { data: { id: string } | null; error: any }

      if (!provider || provider.id !== booking.provider_id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Calculate cancellation fee
    const { data: cancellationFee } = await (supabase as any).rpc('calculate_cancellation_fee', {
      p_booking_id: id,
    })

    // Update booking status to cancelled
    const { error: updateError } = await (supabase as any)
      .from('bookings')
      .update({
        status: 'cancelled',
        cancelled_by: user.id,
        cancelled_at: new Date().toISOString(),
        cancellation_fee: cancellationFee || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
    }

    // Cancel reminders
    await supabase
      .from('booking_reminders')
      .update({ status: 'cancelled' })
      .eq('booking_id', id)
      .eq('status', 'pending')

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
      cancellation_fee: cancellationFee || 0,
    })
  } catch (_error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
