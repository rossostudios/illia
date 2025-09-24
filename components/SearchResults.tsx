'use client'

import { FileText, MapPin, Stethoscope, X } from 'lucide-react'
import Link from 'next/link'
import { type ReactNode, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type SearchResult = {
  id: string
  type: 'provider' | 'service' | 'location' | string
  title: string
  description: string
  score: number
  metadata?: {
    filters?: {
      services?: string[]
      extras?: string[]
      city?: string
      budgetMin?: number
      budgetMax?: number
    }
    summary?: string
  }
}

type SearchResultsProps = {
  query: string
  isOpen: boolean
  onClose: () => void
  locale: string
}

export default function SearchResults({ query, isOpen, onClose, locale }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!(query.trim() && isOpen)) {
      setResults([])
      return
    }

    const searchDebounce = setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)

        if (!response.ok) {
          throw new Error('Search failed')
        }

        const data = await response.json()
        setResults(data.results || [])
      } catch (_err) {
        setError('Failed to fetch search results')
      } finally {
        setLoading(false)
      }
    }, 300) // Debounce search

    return () => clearTimeout(searchDebounce)
  }, [query, isOpen])

  if (!isOpen) {
    return null
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'provider':
        return <Stethoscope className="h-5 w-5 text-teal-600 dark:text-teal-400" />
      case 'service':
        return <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case 'location':
        return <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      default:
        return null
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'provider':
        return 'Provider'
      case 'service':
        return 'Service'
      case 'location':
        return 'Location'
      default:
        return type
    }
  }

  const getLink = (result: SearchResult) => {
    switch (result.type) {
      case 'provider':
        return `/${locale}/dashboard/providers/${result.id}`
      case 'service':
        return buildServiceLink(result, locale)
      case 'location':
        return `/${locale}/dashboard/locations/${result.id}`
      default:
        return `/${locale}/dashboard`
    }
  }

  let content: ReactNode = null

  if (loading) {
    content = (
      <div className="space-y-2 p-2">
        {[1, 2, 3].map((i) => (
          <div className="animate-pulse" key={i}>
            <div className="flex items-start gap-3 rounded-lg p-3">
              <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  } else if (error) {
    content = <div className="p-4 text-center text-red-600 dark:text-red-400">{error}</div>
  } else if (results.length > 0) {
    content = (
      <div className="space-y-1">
        {results.map((result) => (
          <Link
            className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:focus:bg-gray-800 dark:hover:bg-gray-800"
            href={getLink(result)}
            key={result.id}
            onClick={() => {
              if (result.type === 'service') {
                trackServiceFallbackClick(result, query, results.length).catch(() => {
                  /* ignore analytics failure */
                })
              }
              onClose()
            }}
          >
            <div className="mt-0.5">{getIcon(result.type)}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 text-sm dark:text-gray-100">
                  {result.title}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600 text-xs dark:bg-gray-800 dark:text-gray-400">
                  {getTypeLabel(result.type)}
                </span>
              </div>
              <p className="mt-0.5 text-gray-600 text-sm dark:text-gray-400">
                {result.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    )
  } else if (query.trim()) {
    content = (
      <div className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
        <p className="mt-2 text-gray-400 text-sm dark:text-gray-500">
          Try searching for providers, services, or locations
        </p>
      </div>
    )
  }

  return (
    <div className="absolute top-full right-0 left-0 mt-2 max-h-[60vh] overflow-auto rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
      {/* Search header */}
      <div className="sticky top-0 flex items-center justify-between border-gray-200 border-b bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
          {loading ? 'Searching...' : `Results for "${query}"`}
        </span>
        <button
          aria-label="Close search results"
          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Search content */}
      <div className="p-2">{content}</div>
    </div>
  )
}

function buildServiceLink(result: SearchResult, locale: string) {
  const params = new URLSearchParams()
  params.set('search', result.title)
  params.set('suggestionId', result.id)

  if (result.metadata?.summary) {
    params.set('presetSummary', result.metadata.summary)
  }

  const filters = result.metadata?.filters
  if (filters?.services?.length) {
    params.set('presetServices', filters.services.join(','))
  }
  if (filters?.extras?.length) {
    params.set('presetExtras', filters.extras.join(','))
  }
  if (filters?.city) {
    params.set('presetCity', filters.city)
  }
  if (typeof filters?.budgetMin === 'number') {
    params.set('presetBudgetMin', String(filters.budgetMin))
  }
  if (typeof filters?.budgetMax === 'number') {
    params.set('presetBudgetMax', String(filters.budgetMax))
  }

  return `/${locale}/dashboard/explore?${params.toString()}`
}

async function trackServiceFallbackClick(result: SearchResult, query?: string, resultsCount = 0) {
  if (!(result.type === 'service' && result.id.includes('fallback'))) {
    return
  }

  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const payload: Record<string, unknown> = {}
    payload.user_id = user?.id ?? null
    payload.search_type = 'service_fallback'
    payload.query = query ?? null
    payload.result_count = resultsCount
    payload.time_to_results = 0
    payload.clicked_result_id = result.id
    payload.conversion_funnel = 'fallback'

    const filtersUsed: Record<string, unknown> = {}
    filtersUsed.suggestion_id = result.id
    filtersUsed.suggestion_title = result.title
    filtersUsed.preset_filters = result.metadata?.filters ?? null

    payload.filters_used = filtersUsed

    await supabase.from('search_analytics').insert(payload)
  } catch (_error) {
    // Non-blocking analytics failure
  }
}
