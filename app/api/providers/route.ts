import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    // Get query parameters
    const city = searchParams.get('city') || 'medellin'
    const services = searchParams.get('services')?.split(',').filter(Boolean) || []
    const languages = searchParams.get('languages')?.split(',').filter(Boolean) || []
    const budgetMax = searchParams.get('budget_max')
      ? parseInt(searchParams.get('budget_max')!, 10)
      : null
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 20

    // Build query
    let query = supabase
      .from('providers')
      .select('*')
      .eq('city', city)
      .eq('active', true)
      .order('rating', { ascending: false })
      .limit(limit)

    // Filter by services if provided
    if (services.length > 0) {
      query = query.overlaps('services', services)
    }

    // Filter by languages if provided
    if (languages.length > 0) {
      // Map common language names to database codes
      const langMap: Record<string, string> = {
        english: 'en',
        spanish: 'es',
        portuguese: 'pt',
      }
      const mappedLanguages = languages.map((lang) => langMap[lang.toLowerCase()] || lang)
      query = query.overlaps('languages', mappedLanguages)
    }

    // Filter by budget if provided
    if (budgetMax) {
      // budgetMax comes as dollar amount * 100 (cents), convert to local currency
      query = query.lte('rate_monthly', budgetMax)
    }

    const { data: providers, error } = await query

    if (error) {
      console.error('Error fetching providers:', error)
      return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
    }

    // Format providers for frontend
    const formattedProviders = (providers || []).map((provider) => ({
      id: provider.id,
      name: provider.name,
      bio:
        provider.bio ||
        `Professional ${provider.services?.join(' and ') || 'service provider'} in ${provider.city}.`,
      photo: provider.photo_url || `https://i.pravatar.cc/150?u=${provider.id}`,
      score: calculateScore(provider, { services, languages }),
      rate: formatRate(provider.rate_monthly, city),
      location: provider.neighborhood || city,
      verified: provider.verified || false,
      specialties: provider.specialties || [],
      availability: provider.availability || 'Flexible',
      email: provider.email,
      phone: provider.phone,
      whatsapp: provider.whatsapp,
      services: provider.services,
      languages: provider.languages,
    }))

    return NextResponse.json({
      success: true,
      providers: formattedProviders,
      total: formattedProviders.length,
    })
  } catch (error) {
    console.error('Providers API error:', error)
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
  }
}

// Calculate a simple score based on matches
function calculateScore(provider: any, criteria: any): number {
  let score = 70 // Base score

  // Service match bonus
  if (criteria.services?.length > 0 && provider.services?.length > 0) {
    const matches = provider.services.filter((s: string) => criteria.services.includes(s)).length
    score += Math.min(15, matches * 5)
  }

  // Language match bonus
  if (criteria.languages?.length > 0 && provider.languages?.length > 0) {
    const matches = provider.languages.filter((l: string) => criteria.languages.includes(l)).length
    score += Math.min(10, matches * 5)
  }

  // Verified bonus
  if (provider.verified) score += 5

  // Rating bonus
  if (provider.rating) {
    score += Math.floor(provider.rating * 2)
  }

  return Math.min(100, score)
}

// Format rate based on city currency
function formatRate(rate: number | null, city: string): string {
  if (!rate) return 'Contact for rates'

  // Assuming rate is stored in local currency units
  if (city === 'medellin') {
    // Format as COP
    return `${rate.toLocaleString()} COP/month`
  } else if (city === 'florianopolis') {
    // Format as BRL
    return `R$${rate}/month`
  }

  // Default to USD-like format
  return `$${rate}/month`
}
