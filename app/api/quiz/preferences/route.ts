import { type NextRequest, NextResponse } from 'next/server'
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
    const { city, services, languages, budget, frequency, preferences } = body

    // Parse budget to get min and max
    let budgetMin = null
    let budgetMax = null
    if (budget) {
      const budgetParts = budget.split('-')
      if (budgetParts[0] && budgetParts[0] !== '0') {
        budgetMin = parseInt(budgetParts[0])
      }
      if (budgetParts[1] && !budgetParts[1].includes('+')) {
        budgetMax = parseInt(budgetParts[1])
      }
    }

    // Upsert user preferences
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        city,
        services,
        languages,
        budget_min: budgetMin,
        budget_max: budgetMax,
        frequency,
        preferences: { ...preferences, budget },
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving preferences:', error)
      return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
    }

    // Find matching providers based on preferences
    let query = supabase.from('providers').select('*').eq('city', city).eq('active', true)

    // Filter by services (at least one match)
    if (services && services.length > 0) {
      query = query.overlaps('services', services)
    }

    // Filter by languages (at least one match)
    if (languages && languages.length > 0) {
      query = query.overlaps('languages', languages)
    }

    // Filter by budget
    if (budgetMax) {
      query = query.lte('rate_monthly', budgetMax)
    }

    // Get top 5 matches
    query = query.limit(5)

    const { data: providers, error: providersError } = await query

    if (providersError) {
      console.error('Error fetching providers:', providersError)
    }

    // Save matches to database
    if (providers && providers.length > 0) {
      const matches = providers.map((provider) => ({
        user_id: user.id,
        provider_id: provider.id,
        match_score: calculateMatchScore(provider, { city, services, languages, budget }),
      }))

      await supabase.from('matches').upsert(matches)
    }

    return NextResponse.json({
      success: true,
      preferences: data,
      matches: providers || [],
    })
  } catch (error) {
    console.error('Quiz preferences error:', error)
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }
}

// Simple match scoring algorithm
function calculateMatchScore(provider: any, preferences: any): number {
  let score = 50 // Base score

  // Service match (up to 20 points)
  const serviceMatches = provider.services.filter((s: string) =>
    preferences.services.includes(s)
  ).length
  score += Math.min(20, serviceMatches * 10)

  // Language match (up to 15 points)
  const languageMatches = provider.languages.filter((l: string) =>
    preferences.languages.includes(l)
  ).length
  score += Math.min(15, languageMatches * 15)

  // Verified provider bonus
  if (provider.verified) score += 10

  // Rating bonus
  if (provider.rating) {
    score += Math.floor(provider.rating * 2)
  }

  return Math.min(100, score)
}
