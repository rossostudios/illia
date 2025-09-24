export type AISearchSuggestion = {
  originalQuery: string
  interpretedIntent: string
  suggestedFilters: Record<string, any>
  alternativeQueries: string[]
  reasoning: string
  confidence: number
}

export type SemanticSearchResult = {
  query: string
  intent: 'location' | 'service' | 'budget' | 'quality' | 'special_requirements' | 'general'
  entities: {
    locations?: string[]
    services?: string[]
    priceRange?: { min: number; max: number }
    languages?: string[]
    specialties?: string[]
    rating?: number
  }
  confidence: number
}

export class AISearchService {
  private static instance: AISearchService

  public static getInstance(): AISearchService {
    if (!AISearchService.instance) {
      AISearchService.instance = new AISearchService()
    }
    return AISearchService.instance
  }

  /**
   * Analyze a search query using server-side API
   */
  async analyzeQuery(query: string): Promise<AISearchSuggestion> {
    try {
      const response = await fetch('/api/ai-search/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data.data
    } catch (_error) {
      // Fallback to basic analysis
      return this.fallbackAnalysis(query)
    }
  }

  /**
   * Get autocomplete suggestions from server-side API
   */
  async getAutocompleteSuggestions(partialQuery: string): Promise<string[]> {
    if (partialQuery.length < 2) {
      return []
    }

    try {
      const response = await fetch(
        `/api/ai-search/autocomplete?q=${encodeURIComponent(partialQuery)}`
      )

      if (!response.ok) {
        throw new Error(`Autocomplete API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data.data || []
    } catch (_error) {
      // Error handled silently
    }

    // Fallback suggestions
    const fallbacks = [
      `${partialQuery} in Medellín`,
      `${partialQuery} in Florianópolis`,
      `${partialQuery} English speaking`,
      `${partialQuery} eco friendly`,
      `${partialQuery} verified`,
    ]

    return fallbacks.filter((suggestion) =>
      suggestion.toLowerCase().includes(partialQuery.toLowerCase())
    )
  }

  /**
   * Fallback analysis when AI is unavailable
   */
  private fallbackAnalysis(query: string): AISearchSuggestion {
    const lowerQuery = query.toLowerCase()

    let intent = 'general'
    const filters: Record<string, any> = {}
    let alternatives: string[] = []
    let reasoning = 'Basic query analysis (AI unavailable)'
    let confidence = 0.5

    // Simple keyword matching
    if (lowerQuery.includes('english') || lowerQuery.includes('ingles')) {
      intent = 'language_specific'
      filters.languages = ['english']
      alternatives = ['English speaking providers', 'Bilingual helpers']
      reasoning = 'Detected language preference for English'
      confidence = 0.9
    } else if (
      lowerQuery.includes('pet') ||
      lowerQuery.includes('dog') ||
      lowerQuery.includes('cat')
    ) {
      intent = 'special_requirements'
      filters.specialties = ['pet-friendly']
      alternatives = ['Pet friendly services', 'Animal lovers']
      reasoning = 'Detected pet-related requirements'
      confidence = 0.85
    } else if (
      lowerQuery.includes('eco') ||
      lowerQuery.includes('green') ||
      lowerQuery.includes('organic')
    ) {
      intent = 'special_requirements'
      filters.specialties = ['eco-friendly']
      alternatives = ['Eco friendly services', 'Green cleaning']
      reasoning = 'Detected environmental preferences'
      confidence = 0.8
    } else if (
      lowerQuery.includes('cheap') ||
      lowerQuery.includes('affordable') ||
      lowerQuery.includes('budget')
    ) {
      intent = 'budget'
      filters.priceMax = 200
      alternatives = ['Affordable services', 'Budget options']
      reasoning = 'Detected budget-conscious search'
      confidence = 0.75
    } else if (lowerQuery.includes('medell') || lowerQuery.includes('medellin')) {
      intent = 'location'
      filters.city = 'medellin'
      alternatives = ['Medellín providers', 'Services in Medellín']
      reasoning = 'Location search for Medellín'
      confidence = 0.95
    } else if (lowerQuery.includes('florian') || lowerQuery.includes('floripa')) {
      intent = 'location'
      filters.city = 'florianopolis'
      alternatives = ['Florianópolis providers', 'Services in Florianópolis']
      reasoning = 'Location search for Florianópolis'
      confidence = 0.95
    }

    return {
      originalQuery: query,
      interpretedIntent: intent,
      suggestedFilters: filters,
      alternativeQueries: alternatives,
      reasoning,
      confidence,
    }
  }
}
