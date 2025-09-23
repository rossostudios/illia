'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { AISearchService, type AISearchSuggestion } from '@/lib/ai-search'
import { createClient } from '@/lib/supabase/client'

export interface SearchSuggestion {
  id: string
  text: string
  type: 'query' | 'filter' | 'location' | 'service' | 'provider'
  category?: string
  confidence: number
  metadata?: Record<string, any>
}

// Use the AISearchSuggestion from the AI service
export type AISuggestion = AISearchSuggestion

interface UseSearchSuggestionsOptions {
  enableAI?: boolean
  maxSuggestions?: number
  debounceMs?: number
}

export function useSearchSuggestions(options: UseSearchSuggestionsOptions = {}) {
  const { enableAI = true, maxSuggestions = 5, debounceMs = 200 } = options
  const { user } = useSession()

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null)
  const [loading, setLoading] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  // Generate suggestions based on query
  const generateSuggestions = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions([])
        setAiSuggestion(null)
        return
      }

      setLoading(true)

      try {
        const allSuggestions: SearchSuggestion[] = []

        // Location-based suggestions
        if (searchQuery.length >= 2) {
          const locationSuggestions = await generateLocationSuggestions(searchQuery)
          allSuggestions.push(...locationSuggestions)
        }

        // Service-based suggestions
        const serviceSuggestions = await generateServiceSuggestions(searchQuery)
        allSuggestions.push(...serviceSuggestions)

        // Provider name suggestions
        const providerSuggestions = await generateProviderSuggestions(searchQuery)
        allSuggestions.push(...providerSuggestions)

        // Popular query suggestions
        const popularSuggestions = await generatePopularQuerySuggestions(searchQuery)
        allSuggestions.push(...popularSuggestions)

        // Sort by confidence and limit
        const sortedSuggestions = allSuggestions
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, maxSuggestions)

        setSuggestions(sortedSuggestions)

        // AI-powered interpretation (if enabled)
        if (enableAI && searchQuery.length >= 3) {
          const aiResult = await generateAISuggestion(searchQuery)
          setAiSuggestion(aiResult)
        }
      } catch (error) {
        console.error('Error generating suggestions:', error)
        setSuggestions([])
        setAiSuggestion(null)
      } finally {
        setLoading(false)
      }
    },
    [enableAI, maxSuggestions]
  )

  // Debounced suggestion generation
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const timer = setTimeout(() => {
      generateSuggestions(query)
    }, debounceMs)

    setDebounceTimer(timer)

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [query, generateSuggestions, debounceMs, debounceTimer])

  // Track user interactions with suggestions
  const trackSuggestionClick = useCallback(
    async (suggestion: SearchSuggestion) => {
      if (!user) return

      try {
        const supabase = createClient()
        await supabase.from('search_analytics').insert({
          user_id: user.id,
          search_type: 'ai_suggestion',
          query: query,
          filters_used: { suggestion_type: suggestion.type, suggestion_id: suggestion.id },
          result_count: 1,
          time_to_results: 0,
          conversion_funnel: 'suggested',
        })
      } catch (error) {
        console.error('Failed to track suggestion click:', error)
      }
    },
    [user, query]
  )

  return {
    query,
    setQuery,
    suggestions,
    aiSuggestion,
    loading,
    trackSuggestionClick,
  }
}

// Helper functions for generating different types of suggestions
async function generateLocationSuggestions(query: string): Promise<SearchSuggestion[]> {
  try {
    const { data: locations } = await supabase
      .from('providers')
      .select('city, neighborhood')
      .ilike('city', `%${query}%`)
      .or(`neighborhood.ilike.%${query}%`)
      .limit(10)

    const uniqueLocations = new Set<string>()
    const suggestions: SearchSuggestion[] = []

    locations?.forEach((loc) => {
      if (loc.city && !uniqueLocations.has(`city-${loc.city}`)) {
        uniqueLocations.add(`city-${loc.city}`)
        suggestions.push({
          id: `city-${loc.city}`,
          text: loc.city,
          type: 'location',
          category: 'City',
          confidence: 0.9,
          metadata: { type: 'city', value: loc.city },
        })
      }

      if (loc.neighborhood && !uniqueLocations.has(`neighborhood-${loc.neighborhood}`)) {
        uniqueLocations.add(`neighborhood-${loc.neighborhood}`)
        suggestions.push({
          id: `neighborhood-${loc.neighborhood}`,
          text: `${loc.neighborhood}, ${loc.city}`,
          type: 'location',
          category: 'Neighborhood',
          confidence: 0.8,
          metadata: { type: 'neighborhood', value: loc.neighborhood, city: loc.city },
        })
      }
    })

    return suggestions
  } catch (error) {
    console.error('Error generating location suggestions:', error)
    return []
  }
}

async function generateServiceSuggestions(query: string): Promise<SearchSuggestion[]> {
  const services = [
    'House Cleaning',
    'Deep Cleaning',
    'Cooking',
    'Meal Prep',
    'Laundry',
    'Organization',
    'Pet Care',
    'Gardening',
    'Errands',
    'Child Care',
  ]

  return services
    .filter((service) => service.toLowerCase().includes(query.toLowerCase()))
    .map((service) => ({
      id: `service-${service.toLowerCase().replace(' ', '-')}`,
      text: service,
      type: 'service',
      category: 'Service',
      confidence: 0.85,
      metadata: { service: service },
    }))
}

async function generateProviderSuggestions(query: string): Promise<SearchSuggestion[]> {
  try {
    const { data: providers } = await supabase
      .from('providers')
      .select('id, name, city, neighborhood')
      .ilike('name', `%${query}%`)
      .eq('active', true)
      .limit(5)

    return (
      providers?.map((provider) => ({
        id: `provider-${provider.id}`,
        text: `${provider.name} in ${provider.neighborhood || provider.city}`,
        type: 'provider',
        category: 'Provider',
        confidence: 0.95,
        metadata: { providerId: provider.id, name: provider.name },
      })) || []
    )
  } catch (error) {
    console.error('Error generating provider suggestions:', error)
    return []
  }
}

async function generatePopularQuerySuggestions(query: string): Promise<SearchSuggestion[]> {
  // Popular queries based on search analytics
  const popularQueries = [
    'English speaking cleaner',
    'Pet friendly housekeeper',
    'Weekly cleaning service',
    'Meal prep chef',
    'Eco friendly cleaning',
  ]

  return popularQueries
    .filter((popular) => popular.toLowerCase().includes(query.toLowerCase()))
    .map((popular) => ({
      id: `popular-${popular.toLowerCase().replace(/\s+/g, '-')}`,
      text: popular,
      type: 'query',
      category: 'Popular',
      confidence: 0.7,
      metadata: { popular: true },
    }))
}

async function generateAISuggestion(query: string): Promise<AISuggestion | null> {
  try {
    return await AISearchService.getInstance().analyzeQuery(query)
  } catch (error) {
    console.error('Error generating AI suggestion:', error)
    return null
  }
}
