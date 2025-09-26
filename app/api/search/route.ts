import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type ServiceFilters = {
  services?: string[]
  extras?: string[]
  city?: string
  budgetMin?: number
  budgetMax?: number
}

type ServiceMetadata = {
  filters?: ServiceFilters
  summary?: string
}

type SearchResult = {
  id: string
  type: 'provider' | 'location' | 'service'
  title: string
  description: string
  score: number
  metadata?: ServiceMetadata
}

type ProviderRecord = {
  id?: string
  services?: string[] | null
  location?: string | null
  city?: string | null
  name?: string | null
  bio?: string | null
  rating_avg?: number | null
  status?: string | null
  is_active?: boolean | null
  specialties?: string[] | null
}

const SERVICE_SUGGESTIONS = [
  {
    id: 'service-cleaning',
    keywords: ['clean', 'cleaning', 'deep clean', 'housekeeping', 'maid'],
    title: 'House Cleaning Pros',
    description: 'Verified cleaners for weekly, bi-weekly, or deep-clean requests',
  },
  {
    id: 'service-meal-prep',
    keywords: ['cook', 'chef', 'meal prep', 'cooking', 'meal'],
    title: 'Meal Prep & Cooking',
    description: 'Hire chefs for weekly cooking, meal planning, or speciality diets',
  },
  {
    id: 'service-organization',
    keywords: ['organize', 'organization', 'declutter', 'closet'],
    title: 'Home Organization',
    description: 'Professional organizers for closets, pantries, and move-in setups',
  },
  {
    id: 'service-laundry',
    keywords: ['laundry', 'wash', 'press', 'fold'],
    title: 'Laundry Support',
    description: 'Helpers to manage washing, ironing, and wardrobe care',
  },
  {
    id: 'service-pet-friendly',
    keywords: ['pet', 'dog', 'cat', 'pet-friendly'],
    title: 'Pet-Friendly Helpers',
    description: 'Keep pets happy with vetted sitters and pet-aware housekeepers',
  },
]

const SERVICE_PRESET_DETAILS: Record<string, { filters?: ServiceFilters; summary: string }> = {
  'service-cleaning': {
    filters: {
      services: ['cleaning', 'deep-clean'],
      budgetMin: 150,
      budgetMax: 320,
    },
    summary: 'Fresh cleaning matches ready to book.',
  },
  'service-meal-prep': {
    filters: {
      services: ['meal-prep', 'cooking'],
      extras: ['Vegan cooking'],
      budgetMin: 250,
      budgetMax: 400,
    },
    summary: 'Meal prep chefs tailored to your tastes.',
  },
  'service-organization': {
    filters: {
      services: ['organization'],
      budgetMin: 180,
      budgetMax: 320,
    },
    summary: 'Organization experts to reset your space.',
  },
  'service-laundry': {
    filters: {
      services: ['laundry'],
      budgetMin: 120,
      budgetMax: 220,
    },
    summary: 'Laundry support for wash, press, and fold.',
  },
  'service-pet-friendly': {
    filters: {
      services: ['cleaning'],
      extras: ['Pet-friendly'],
      budgetMin: 200,
      budgetMax: 350,
    },
    summary: 'Pet-loving helpers comfortable with furry friends.',
  },
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')?.trim()

    if (!query) {
      return NextResponse.json({ results: [], query: '' })
    }

    const normalizedQuery = query.toLowerCase()
    const compactQuery = normalizedQuery.replace(/[^a-z0-9]/g, '')
    const likeQuery = `%${escapeLike(query)}%`

    const supabase = await createClient()
    const providerQuery = await supabase
      .from('service_providers')
      .select('id, name, bio, city, location, services, specialties, rating_avg, status, is_active')
      .eq('is_active', true)
      .or(
        `name.ilike.${likeQuery},bio.ilike.${likeQuery},city.ilike.${likeQuery},location.ilike.${likeQuery}`
      )
      .limit(20)

    const { data: providers, error } = providerQuery

    if (error) {
      return NextResponse.json({ error: 'Search failed', message: error.message }, { status: 500 })
    }

    const results: SearchResult[] = []
    const locationSet = new Set<string>()
    const serviceSet = new Set<string>()

    let providerResultCount = 0

    for (const provider of providers || []) {
      // Provider result
      results.push({
        id: provider.id || `provider-${Date.now()}`,
        type: 'provider',
        title: provider.name || 'Unknown Provider',
        description: formatProviderDescription(provider),
        score: calculateProviderScore(provider, normalizedQuery),
      })
      providerResultCount += 1

      // Location result when query matches a city/neighborhood
      const cityMatch = provider.city?.toLowerCase().includes(normalizedQuery)
      const locationMatch = provider.location?.toLowerCase().includes(normalizedQuery)

      if (cityMatch || locationMatch) {
        const locationId = `location-${provider.city}-${provider.location || ''}`
        if (!locationSet.has(locationId)) {
          locationSet.add(locationId)
          results.push({
            id: locationId,
            type: 'location',
            title: locationMatch
              ? `${capitalize(provider.location || '')}, ${capitalize(provider.city || '')}`
              : capitalize(provider.city || ''),
            description: locationMatch
              ? `Location in ${capitalize(provider.city || '')}`
              : 'City match',
            score: 60,
          })
        }
      }
    }

    const serviceMatches = matchServiceSuggestions(
      normalizedQuery,
      compactQuery,
      providerResultCount
    )
    serviceMatches.forEach((service) => {
      const baseId = service.id.split('-fallback')[0]
      if (serviceSet.has(baseId)) {
        return
      }
      serviceSet.add(baseId)
      results.push(service)
    })

    // Sort by score descending then limit
    const sortedResults = results.sort((a, b) => b.score - a.score).slice(0, 10)

    return NextResponse.json({
      results: sortedResults,
      query,
      count: sortedResults.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Search failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function escapeLike(value: string) {
  return value.replace(/[%_]/g, (match) => `\\${match}`)
}

function formatProviderDescription(provider: ProviderRecord) {
  const services = Array.isArray(provider.services) ? provider.services : []
  const primaryServices = services.slice(0, 2).map(capitalize).join(' • ')
  const locationParts = [provider.location, provider.city]
    .filter(Boolean)
    .map((part) => capitalize(String(part)))
    .join(', ')

  const serviceText = primaryServices ? `${primaryServices}` : 'Home services'
  const locationText = locationParts ? ` • ${locationParts}` : ''

  return `${serviceText}${locationText}`
}

function calculateProviderScore(provider: ProviderRecord, query: string) {
  let score = 50

  if (provider.rating_avg) {
    score += Math.min(20, provider.rating_avg * 5)
  }

  if (provider.is_active) {
    score += 10
  }

  const services = Array.isArray(provider.services) ? provider.services.join(' ').toLowerCase() : ''
  const specialties = Array.isArray(provider.specialties)
    ? provider.specialties.join(' ').toLowerCase()
    : ''
  const bio = (provider.bio || '').toLowerCase()

  if (
    services.includes(query) ||
    specialties.includes(query) ||
    bio.includes(query) ||
    (provider.name?.toLowerCase() || '').includes(query)
  ) {
    score += 15
  }

  return Math.min(score, 100)
}

function capitalize(value: string) {
  if (!value) {
    return ''
  }
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function matchServiceSuggestions(
  normalizedQuery: string,
  compactQuery: string,
  providerResultCount: number
): SearchResult[] {
  if (!normalizedQuery) {
    return []
  }

  const matches: SearchResult[] = []

  SERVICE_SUGGESTIONS.forEach((service) => {
    const hit = service.keywords.some((keyword) => {
      const normalizedKeyword = keyword.toLowerCase()
      const compactKeyword = normalizedKeyword.replace(/[^a-z0-9]/g, '')
      return normalizedQuery.includes(normalizedKeyword) || compactQuery.includes(compactKeyword)
    })

    if (hit) {
      matches.push(createServiceSearchResult(service))
    }
  })

  // Fallback: if no explicit match, suggest a couple of popular services when provider results are light
  if (matches.length === 0 && providerResultCount < 5) {
    return SERVICE_SUGGESTIONS.slice(0, 2).map((service, index) =>
      createServiceSearchResult(service, {
        idOverride: `${service.id}-fallback-${index}`,
        score: 35 - index * 2,
      })
    )
  }

  return matches
}

function createServiceSearchResult(
  service: (typeof SERVICE_SUGGESTIONS)[number],
  options: { idOverride?: string; score?: number } = {}
): SearchResult {
  const preset = SERVICE_PRESET_DETAILS[service.id]
  const metadata: ServiceMetadata | undefined = preset
    ? {
        ...(preset.filters ? { filters: preset.filters } : {}),
        summary: preset.summary,
      }
    : undefined

  return {
    id: options.idOverride ?? service.id,
    type: 'service',
    title: service.title,
    description: service.description,
    score: options.score ?? 55,
    metadata,
  }
}
