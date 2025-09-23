import { type NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateAutocompleteSuggestions(partialQuery: string): Promise<string[]> {
  if (partialQuery.length < 2) return []

  try {
    // Use AI to generate completions
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Generate 5 search suggestions for a home service provider platform. Focus on common searches in Colombia and Brazil. Return only a JSON array of strings.',
        },
        {
          role: 'user',
          content: `Complete this search query: "${partialQuery}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    })

    const response = completion.choices[0]?.message?.content
    if (response) {
      try {
        const suggestions = JSON.parse(response) as string[]
        return suggestions.slice(0, 5)
      } catch {
        // Fallback: split by newlines
        return response
          .split('\n')
          .filter((s) => s.trim())
          .slice(0, 5)
      }
    }
  } catch (error) {
    console.error('AI autocomplete error:', error)
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const suggestions = await generateAutocompleteSuggestions(query.trim())

    return NextResponse.json({
      success: true,
      data: suggestions,
    })
  } catch (error) {
    console.error('AI autocomplete error:', error)

    // Return fallback suggestions
    const query = new URL(request.url).searchParams.get('q') || ''
    return NextResponse.json(
      {
        success: false,
        error: 'Autocomplete temporarily unavailable',
        data: [
          `${query} in Medellín`,
          `${query} in Florianópolis`,
          `${query} English speaking`,
          `${query} eco friendly`,
        ].filter((s) => s.includes(query)),
      },
      { status: 500 }
    )
  }
}
