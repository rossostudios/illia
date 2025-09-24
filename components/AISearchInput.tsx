'use client'

import { Loader2, Search, Sparkles, TrendingUp, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { type AISuggestion, useSearchSuggestions } from '@/hooks/use-search-suggestions'

type AiSearchInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit?: (query: string, aiSuggestion?: AISuggestion) => void
  placeholder?: string
  className?: string
  showSuggestions?: boolean
  showAISuggestions?: boolean
}

export function AISearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search for home help services...',
  className = '',
  showSuggestions = true,
  showAISuggestions = true,
}: AiSearchInputProps) {
  const [_isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showDropdown, setShowDropdown] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const {
    suggestions,
    aiSuggestion,
    loading: aiLoading,
    setQuery,
  } = useSearchSuggestions({
    enableAI: showAISuggestions,
    maxSuggestions: 6,
  })

  // Update AI search when value changes
  useEffect(() => {
    setQuery(value)
  }, [value, setQuery])

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      onChange(newValue)
      setSelectedIndex(-1)
      setShowDropdown(newValue.length > 0)
    },
    [onChange]
  )

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    (suggestionText: string) => {
      onChange(suggestionText)
      setShowDropdown(false)
      setSelectedIndex(-1)
      onSubmit?.(suggestionText, aiSuggestion || undefined)
    },
    [onChange, onSubmit, aiSuggestion]
  )

  // Handle AI suggestion application
  const handleAiSuggestionApply = useCallback(() => {
    if (aiSuggestion) {
      onSubmit?.(value, aiSuggestion)
    }
  }, [aiSuggestion, value, onSubmit])

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown || suggestions.length === 0) {
        if (e.key === 'Enter' && value.trim()) {
          onSubmit?.(value, aiSuggestion || undefined)
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSuggestionSelect(suggestions[selectedIndex].text)
          } else if (value.trim()) {
            onSubmit?.(value, aiSuggestion || undefined)
          }
          break
        case 'Escape':
          setShowDropdown(false)
          setSelectedIndex(-1)
          inputRef.current?.blur()
          break
      }
    },
    [
      showDropdown,
      suggestions,
      selectedIndex,
      value,
      aiSuggestion,
      handleSuggestionSelect,
      onSubmit,
    ]
  )

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (value.trim()) {
        onSubmit?.(value, aiSuggestion || undefined)
      }
    },
    [value, aiSuggestion, onSubmit]
  )

  // Clear input
  const handleClear = useCallback(() => {
    onChange('')
    setShowDropdown(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }, [onChange])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const allSuggestions = [
    ...suggestions,
    // Add AI-generated alternative queries if available
    ...(aiSuggestion?.alternativeQueries.slice(0, 3).map((query) => ({
      id: `ai-${query}`,
      text: query,
      type: 'query' as const,
      category: 'AI Suggested',
      confidence: 0.8,
      metadata: { ai: true },
    })) || []),
  ].slice(0, 8) // Limit total suggestions

  return (
    <div className={`relative ${className}`}>
      <form className="relative" onSubmit={handleSubmit}>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            {aiLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-teal-500" />
            ) : (
              <Search className="h-5 w-5 text-gray-400" />
            )}
          </div>

          <input
            className="w-full rounded-xl border border-gray-300 bg-white py-4 pr-12 pl-12 text-gray-900 placeholder-gray-500 shadow-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
            onBlur={() => setIsFocused(false)}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true)
              if (value) {
                setShowDropdown(true)
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            ref={inputRef}
            type="text"
            value={value}
          />

          {value && (
            <Button
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
              onClick={handleClear}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* AI Suggestion Banner */}
        {showAISuggestions && aiSuggestion && value.length > 2 && (
          <div className="mt-3 rounded-lg border border-teal-200 bg-gradient-to-r from-teal-50 to-blue-50 p-4 dark:border-teal-800 dark:from-teal-900/20 dark:to-blue-900/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50">
                  <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium text-sm text-teal-900 dark:text-teal-100">
                    AI Search Assistant
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-teal-200 px-2 py-0.5 text-teal-800 text-xs dark:bg-teal-800 dark:text-teal-200">
                    <TrendingUp className="h-3 w-3" />
                    {Math.round(aiSuggestion.confidence * 100)}% confident
                  </div>
                </div>
                <p className="mb-2 text-sm text-teal-700 dark:text-teal-300">
                  {aiSuggestion.reasoning}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-teal-600 text-white hover:bg-teal-700"
                    onClick={handleAiSuggestionApply}
                    size="sm"
                  >
                    Apply AI Filters
                  </Button>
                  {aiSuggestion.alternativeQueries.length > 0 && (
                    <div className="flex gap-1 overflow-x-auto">
                      {aiSuggestion.alternativeQueries.slice(0, 2).map((query, index) => (
                        <button className="whitespace-nowrap rounded-full bg-teal-100 px-3 py-1 text-teal-700 text-xs transition-colors hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50"
                          key={index}
                          onClick={() => handleSuggestionSelect(query)}
                          type="button"
                        >
                          "{query}"
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && showDropdown && allSuggestions.length > 0 && (
        <div
          className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
          ref={dropdownRef}
        >
          {allSuggestions.map((suggestion, index) => (
            <button className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none dark:focus:bg-gray-700 dark:hover:bg-gray-800 ${
                index === selectedIndex ? 'bg-teal-50 dark:bg-teal-900/20' : ''
              }`}
              key={suggestion.id}
              onClick={() => handleSuggestionSelect(suggestion.text)}
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {suggestion.metadata?.ai ? (
                    <Sparkles className="h-4 w-4 text-teal-500" />
                  ) : suggestion.type === 'location' ? (
                    <Search className="h-4 w-4 text-blue-500" />
                  ) : suggestion.type === 'service' ? (
                    <Search className="h-4 w-4 text-green-500" />
                  ) : (
                    <Search className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-gray-900 text-sm dark:text-white">
                    {suggestion.text}
                  </div>
                  {suggestion.category && (
                    <div
                      className={`mt-0.5 text-xs ${
                        suggestion.metadata?.ai
                          ? 'text-teal-600 dark:text-teal-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {suggestion.category}
                    </div>
                  )}
                </div>
                {suggestion.confidence > 0.8 && (
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-green-100 px-2 py-0.5 text-green-700 text-xs dark:bg-green-900/30 dark:text-green-300">
                      High match
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
