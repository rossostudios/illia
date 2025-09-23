'use client'

import { Loader2, Search, Sparkles, TrendingUp, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { type AISuggestion, useSearchSuggestions } from '@/hooks/useSearchSuggestions'

interface AISearchInputProps {
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
}: AISearchInputProps) {
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
  const handleAISuggestionApply = useCallback(() => {
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
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {aiLoading ? (
              <Loader2 className="h-5 w-5 text-teal-500 animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-gray-400" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true)
              if (value) setShowDropdown(true)
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
          />

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* AI Suggestion Banner */}
        {showAISuggestions && aiSuggestion && value.length > 2 && (
          <div className="mt-3 p-4 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-teal-900 dark:text-teal-100">
                    AI Search Assistant
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200 text-xs rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    {Math.round(aiSuggestion.confidence * 100)}% confident
                  </div>
                </div>
                <p className="text-sm text-teal-700 dark:text-teal-300 mb-2">
                  {aiSuggestion.reasoning}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAISuggestionApply}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Apply AI Filters
                  </Button>
                  {aiSuggestion.alternativeQueries.length > 0 && (
                    <div className="flex gap-1 overflow-x-auto">
                      {aiSuggestion.alternativeQueries.slice(0, 2).map((query, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionSelect(query)}
                          className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs rounded-full hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors whitespace-nowrap"
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
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {allSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionSelect(suggestion.text)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none transition-colors ${
                index === selectedIndex ? 'bg-teal-50 dark:bg-teal-900/20' : ''
              }`}
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
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {suggestion.text}
                  </div>
                  {suggestion.category && (
                    <div
                      className={`text-xs mt-0.5 ${
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
                    <div className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
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
