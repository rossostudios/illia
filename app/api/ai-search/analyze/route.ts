import { type NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface SemanticSearchResult {
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

interface AISearchSuggestion {
  originalQuery: string
  interpretedIntent: string
  suggestedFilters: Record<string, any>
  alternativeQueries: string[]
  reasoning: string
  confidence: number
}

async function analyzeQuery(query: string): Promise<AISearchSuggestion> {
  try {
    const semanticAnalysis = await performSemanticAnalysis(query)

    return {
      originalQuery: query,
      interpretedIntent: semanticAnalysis.intent,
      suggestedFilters: convertEntitiesToFilters(semanticAnalysis.entities),
      alternativeQueries: generateAlternativeQueries(query, semanticAnalysis),
      reasoning: generateReasoning(semanticAnalysis),
      confidence: semanticAnalysis.confidence,
    }
  } catch (error) {
    console.error('AI analysis error:', error)
    // Fallback to basic analysis
    return fallbackAnalysis(query)
  }
}

async function performSemanticAnalysis(query: string): Promise<SemanticSearchResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }

  const prompt = `
Analyze this search query for a home service provider search platform in Colombia and Brazil.
Extract intent, entities, and provide structured data.

Query: "${query}"

Return a JSON object with this structure:
{
  "query": "${query}",
  "intent": "location" | "service" | "budget" | "quality" | "special_requirements" | "general",
  "entities": {
    "locations": ["Medellín", "Florianópolis", "El Poblado"],
    "services": ["cleaning", "cooking", "housekeeping"],
    "priceRange": {"min": 150, "max": 300},
    "languages": ["english", "spanish"],
    "specialties": ["eco-friendly", "pet-friendly"],
    "rating": 4.5
  },
  "confidence": 0.85
}

Consider:
- Locations: Colombian cities (Medellín, Bogotá, Cali, Cartagena) and Brazilian cities (Florianópolis, São Paulo, Rio)
- Services: cleaning, cooking, meal prep, laundry, organization, pet care, gardening
- Languages: english, spanish, portuguese, french, german, italian
- Specialties: eco-friendly, pet-friendly, vegan, kosher, organic, luxury, budget
- Price ranges: monthly rates in USD, typically 100-500
- Quality indicators: verified, rating thresholds, experience level

Be specific and accurate in your analysis.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert at analyzing search queries for home service providers. Return only valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.1,
    max_tokens: 500,
  })

  const response = completion.choices[0]?.message?.content
  if (!response) {
    throw new Error('No response from OpenAI')
  }

  try {
    const result = JSON.parse(response) as SemanticSearchResult
    return result
  } catch (_parseError) {
    console.error('Failed to parse AI response:', response)
    throw new Error('Invalid AI response format')
  }
}

function generateAlternativeQueries(
  _originalQuery: string,
  analysis: SemanticSearchResult
): string[] {
  const alternatives: string[] = []

  // Location-based alternatives
  if (analysis.entities.locations?.length) {
    const location = analysis.entities.locations[0]
    alternatives.push(`${location} cleaners`)
    alternatives.push(`${location} home help`)
  }

  // Service-based alternatives
  if (analysis.entities.services?.length) {
    const service = analysis.entities.services[0]
    alternatives.push(`${service} services near me`)
    alternatives.push(`professional ${service}`)
  }

  // Budget-based alternatives
  if (analysis.entities.priceRange) {
    const { min, max } = analysis.entities.priceRange
    alternatives.push(`affordable services under $${max}`)
    alternatives.push(`premium services over $${min}`)
  }

  // Language-based alternatives
  if (analysis.entities.languages?.includes('english')) {
    alternatives.push('English speaking providers')
    alternatives.push('bilingual helpers')
  }

  // Specialty-based alternatives
  if (analysis.entities.specialties?.length) {
    analysis.entities.specialties.forEach((specialty) => {
      alternatives.push(`${specialty} services`)
    })
  }

  // Quality-based alternatives
  if (analysis.entities.rating && analysis.entities.rating >= 4.5) {
    alternatives.push('top rated providers')
    alternatives.push('highly rated services')
  }

  // Remove duplicates and limit to 5
  return [...new Set(alternatives)].slice(0, 5)
}

function convertEntitiesToFilters(entities: SemanticSearchResult['entities']): Record<string, any> {
  const filters: Record<string, any> = {}

  if (entities.locations?.length) {
    const location = entities.locations[0].toLowerCase()
    if (location.includes('medellín') || location.includes('medellin')) {
      filters.city = 'medellin'
    } else if (location.includes('florianópolis') || location.includes('florianopolis')) {
      filters.city = 'florianopolis'
    }
  }

  if (entities.services?.length) {
    filters.services = entities.services
  }

  if (entities.priceRange) {
    filters.priceMin = entities.priceRange.min
    filters.priceMax = entities.priceRange.max
  }

  if (entities.languages?.length) {
    filters.languages = entities.languages
  }

  if (entities.specialties?.length) {
    filters.specialties = entities.specialties
  }

  if (entities.rating) {
    filters.rating = entities.rating
  }

  return filters
}

function generateReasoning(analysis: SemanticSearchResult): string {
  const reasons: string[] = []

  if (analysis.intent === 'location') {
    reasons.push(`Detected location search for ${analysis.entities.locations?.join(', ')}`)
  } else if (analysis.intent === 'service') {
    reasons.push(`Looking for ${analysis.entities.services?.join(' and ')} services`)
  } else if (analysis.intent === 'budget') {
    reasons.push(`Budget-conscious search with price range focus`)
  } else if (analysis.intent === 'quality') {
    reasons.push(`Quality-focused search with high standards`)
  }

  if (analysis.entities.languages?.includes('english')) {
    reasons.push('English language preference detected')
  }

  if (analysis.entities.specialties?.includes('eco-friendly')) {
    reasons.push('Environmental consciousness indicated')
  }

  return reasons.join('. ') || 'General search query analysis'
}

function fallbackAnalysis(query: string): AISearchSuggestion {
  const lowerQuery = query.toLowerCase()

  let intent = 'general'
  const filters: Record<string, any> = {}
  let alternatives: string[] = []
  let reasoning = 'Basic query analysis (AI unavailable)'
  let confidence = 0.5

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

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required and must be a string' }, { status: 400 })
    }

    const analysis = await analyzeQuery(query.trim())

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    console.error('AI search analysis error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'AI analysis temporarily unavailable',
        data: fallbackAnalysis(''),
      },
      { status: 500 }
    )
  }
}
