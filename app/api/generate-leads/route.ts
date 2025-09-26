import { type NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type Lead = Database['public']['Tables']['illia_leads']['Insert']

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const serviceSupabase = await createServiceClient()

    // Get user session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { niche, location, zipCode } = await req.json()

    if (!(niche && location && zipCode)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check user tier for lead limits
    const { data: purchase } = await supabase
      .from('purchases')
      .select('product_id, metadata')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const tier = (purchase?.metadata as any)?.tier || 'basic'
    const leadLimit = tier === 'basic' ? 10 : tier === 'pro' ? 50 : 100

    // Generate mock leads (replace with actual lead generation logic)
    const mockLeads: Lead[] = []
    for (let i = 0; i < Math.min(leadLimit, 20); i++) {
      mockLeads.push({
        user_email: user.email,
        niche,
        zip_code: zipCode,
        name: `${niche} Business ${i + 1}`,
        email: `contact${i + 1}@${niche.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `(843) 555-${String(1000 + i).padStart(4, '0')}`,
        score: Math.floor(Math.random() * 30) + 70,
        notes: `Located in ${location}`,
        status: 'new',
      })
    }

    // Insert leads using service role client (bypasses RLS)
    const { data: insertedLeads, error: insertError } = await serviceSupabase
      .from('illia_leads')
      .insert(mockLeads)
      .select()

    if (insertError) {
      return NextResponse.json({ error: 'Failed to save leads' }, { status: 500 })
    }

    // Log the action
    const { error: logError } = await serviceSupabase.from('illia_leads_logs').insert({
      user_email: user.email,
      niche,
      zip_code: zipCode,
      count: mockLeads.length,
      status: 'success',
    })

    if (logError) {
    }

    return NextResponse.json({
      success: true,
      leads: insertedLeads,
      count: mockLeads.length,
      tier,
    })
  } catch (_error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
