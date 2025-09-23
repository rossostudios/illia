// use context7
import { type NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// GPT-5 model name (use gpt-4-turbo until GPT-5 is available)
const MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceClient()

    // Get request body
    const body = await request.json()
    const { city, services, budget, preferences, languages, frequency, name, email, phone } = body

    // Validate input
    if (!city || !services || services.length === 0) {
      return NextResponse.json({ error: 'City and services are required' }, { status: 400 })
    }

    // Fetch all verified providers from the selected city
    const { data: providers, error: providersError } = await supabase
      .from('service_providers')
      .select('*')
      .eq('city', city)
      .eq('status', 'verified')
      .overlaps('services', services)

    if (providersError) {
      console.error('Error fetching providers:', providersError)
      return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
    }

    if (!providers || providers.length === 0) {
      return NextResponse.json(
        { message: 'No providers found matching your criteria' },
        { status: 200 }
      )
    }

    // Prepare provider data for GPT-5
    const providerSummaries = providers.map((p: any) => ({
      id: p.id,
      name: p.name,
      bio: p.bio.substring(0, 200), // Limit bio length
      services: p.services,
      languages: p.languages,
      specialties: p.specialties,
      rate_monthly: p.rate_monthly,
      years_experience: p.years_experience,
      rating: p.rating_avg || 0,
      reviews_count: p.reviews_count || 0,
      featured: p.featured,
    }))

    // Create the GPT-5 prompt
    const systemPrompt = `You are an AI matching system for Illia.club, a platform connecting expats with local service providers in Latin America.
    Your task is to analyze user preferences and match them with the best service providers.
    Score each provider from 0-100 based on how well they match the user's needs.
    Consider: services offered, languages spoken, experience, ratings, specialties, and rates.
    Featured providers should get a slight boost (+5 points).
    Return ONLY valid JSON in this format:
    {
      "matches": [
        {
          "id": "provider-uuid",
          "score": 95,
          "explanation": "Brief explanation why this is a good match"
        }
      ]
    }
    Return the top 5 matches, sorted by score (highest first).`

    const userPrompt = `User preferences:
    - City: ${city}
    - Services needed: ${services.join(', ')}
    - Languages required: ${languages?.join(', ') || 'Any'}
    - Budget: ${budget || 'Flexible'}
    - Additional preferences: ${preferences || 'None specified'}

    Available providers:
    ${JSON.stringify(providerSummaries, null, 2)}

    Match these providers to the user's needs and return the top 5 matches.`

    // Call GPT-5/GPT-4-turbo for matching
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' }, // Ensure JSON response
    })

    const responseContent = completion.choices[0].message.content
    if (!responseContent) {
      throw new Error('No response from AI')
    }

    const aiMatches = JSON.parse(responseContent)

    // Save lead and matches to database if we have contact info
    let userId: string | null = null

    if (email && name) {
      console.log('💾 Saving lead to database...')

      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .upsert(
          {
            email,
            name,
            phone,
            city,
            services,
            languages,
            budget,
            frequency,
            preferences,
            quiz_completed_at: new Date().toISOString(),
            status: 'new',
          },
          {
            onConflict: 'email',
          }
        )
        .select()
        .single()

      if (leadError) {
        console.error('❌ Lead save error:', leadError)
      } else {
        console.log('✅ Lead saved')
        userId = lead?.id

        // Save matches to database
        const matchesToSave = aiMatches.matches.slice(0, 5).map((match: any) => ({
          user_id: userId!,
          provider_id: match.id,
          score: Math.min(100, Math.max(0, match.score)),
          explanation: match.explanation,
          ai_model: MODEL,
        }))

        const { data: savedMatches, error: saveError } = await supabase
          .from('matches')
          .upsert(matchesToSave, {
            onConflict: 'user_id,provider_id',
            ignoreDuplicates: false,
          })
          .select()

        if (saveError) {
          console.error('Error saving matches:', saveError)
        }
      }
    }

    // Fetch full provider details for the matches
    const matchedProviderIds = aiMatches.matches.map((m: any) => m.id)
    const { data: fullProviders, error: fullProvidersError } = await supabase
      .from('service_providers')
      .select('*')
      .in('id', matchedProviderIds)

    if (fullProvidersError) {
      console.error('Error fetching full providers:', fullProvidersError)
      return NextResponse.json({ error: 'Failed to fetch provider details' }, { status: 500 })
    }

    // Combine AI scores with provider data
    const enrichedMatches = aiMatches.matches.map((match: any) => {
      const provider = fullProviders?.find((p: any) => p.id === match.id)
      return {
        ...provider,
        match_score: match.score,
        match_explanation: match.explanation,
      }
    })

    // Track API usage
    console.log(`[Matches API] ${enrichedMatches.length} matches found for quiz user`)

    return NextResponse.json({
      success: true,
      matches: enrichedMatches,
      total_providers_analyzed: providers.length,
      model_used: MODEL,
      user_id: userId,
    })
  } catch (error: any) {
    console.error('[Matches API Error]:', error)

    // Handle specific errors
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    if (error.message?.includes('JSON')) {
      return NextResponse.json(
        { error: 'Failed to process AI response. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: 'An error occurred while finding matches' }, { status: 500 })
  }
}

// GET endpoint to fetch existing matches
export async function GET(_request: NextRequest) {
  try {
    const supabase = createClient()

    // Get user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's matches with provider details
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select(`
        *,
        service_providers (*)
      `)
      .eq('user_id', user.id)
      .order('score', { ascending: false })
      .limit(10)

    if (matchesError) {
      console.error('Error fetching matches:', matchesError)
      return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      matches: matches || [],
    })
  } catch (error) {
    console.error('[Matches GET Error]:', error)
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}
