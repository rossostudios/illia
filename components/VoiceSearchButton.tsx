'use client'

import { AlertCircle, Mic, MicOff, Volume2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useVoiceSearch } from '@/hooks/useVoiceSearch'

interface VoiceSearchButtonProps {
  onResult?: (transcript: string, processedQuery: string) => void
  onError?: (error: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  language?: string
  showTranscript?: boolean
}

export function VoiceSearchButton({
  onResult,
  onError,
  className = '',
  size = 'md',
  variant = 'outline',
  language = 'en-US',
  showTranscript = true,
}: VoiceSearchButtonProps) {
  const [showTranscriptModal, setShowTranscriptModal] = useState(false)
  const [lastTranscript, setLastTranscript] = useState('')
  const [lastProcessedQuery, setLastProcessedQuery] = useState('')

  const transcriptTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    confidence,
    error,
    searchResult,
    startListening,
    stopListening,
    clearVoiceSearch,
  } = useVoiceSearch({
    language,
    enableAnalytics: true,
  })

  // Handle voice search results
  useEffect(() => {
    if (searchResult) {
      setLastTranscript(searchResult.transcript)
      setLastProcessedQuery(searchResult.processedQuery)

      if (showTranscript) {
        setShowTranscriptModal(true)

        // Auto-hide transcript after 5 seconds
        if (transcriptTimeoutRef.current) {
          clearTimeout(transcriptTimeoutRef.current)
        }
        transcriptTimeoutRef.current = setTimeout(() => {
          setShowTranscriptModal(false)
        }, 5000)
      }

      onResult?.(searchResult.transcript, searchResult.processedQuery)
    }
  }, [searchResult, showTranscript, onResult])

  // Handle errors
  useEffect(() => {
    if (error) {
      onError?.(error)
    }
  }, [error, onError])

  // Handle button click
  const handleClick = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      const success = startListening()
      if (!success) {
        onError?.('Failed to start voice recognition')
      }
    }
  }, [isListening, startListening, stopListening, onError])

  // Handle transcript modal close
  const handleCloseTranscript = useCallback(() => {
    setShowTranscriptModal(false)
    if (transcriptTimeoutRef.current) {
      clearTimeout(transcriptTimeoutRef.current)
      transcriptTimeoutRef.current = null
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transcriptTimeoutRef.current) {
        clearTimeout(transcriptTimeoutRef.current)
      }
    }
  }, [])

  const buttonSize = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14',
  }

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  if (!isSupported) {
    return (
      <Button
        variant="ghost"
        disabled
        className={`${className} ${buttonSize[size]} p-0 opacity-50 cursor-not-allowed`}
        title="Voice search not supported in this browser"
      >
        <MicOff className={`${iconSize[size]}`} />
      </Button>
    )
  }

  return (
    <>
      <div className="relative">
        <Button
          variant={variant}
          onClick={handleClick}
          className={`${className} ${buttonSize[size]} p-0 relative ${
            isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : ''
          }`}
          title={isListening ? 'Stop voice search' : 'Start voice search'}
        >
          {isListening ? (
            <div className="relative">
              <Mic className={`${iconSize[size]} animate-pulse`} />
              {/* Recording indicator */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </div>
          ) : (
            <Mic className={iconSize[size]} />
          )}
        </Button>

        {/* Listening indicator */}
        {isListening && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Transcript Modal */}
      {showTranscriptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={handleCloseTranscript}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <AlertCircle className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Volume2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Voice Search Complete
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Confidence: {Math.round((confidence || 0) * 100)}%
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  You said:
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <p className="text-gray-900 dark:text-white italic">"{lastTranscript}"</p>
                </div>
              </div>

              {lastProcessedQuery !== lastTranscript && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Processed as:
                  </label>
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                    <p className="text-teal-900 dark:text-teal-100 font-medium">
                      "{lastProcessedQuery}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  clearVoiceSearch()
                  handleCloseTranscript()
                }}
                variant="outline"
                className="flex-1"
              >
                Clear
              </Button>
              <Button onClick={handleCloseTranscript} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </>
  )
}

// Voice search input component that combines text and voice
interface VoiceSearchInputProps {
  value: string
  onChange: (value: string) => void
  onVoiceResult?: (transcript: string, processedQuery: string) => void
  placeholder?: string
  className?: string
  language?: string
}

export function VoiceSearchInput({
  value,
  onChange,
  onVoiceResult,
  placeholder = 'Search with voice or text...',
  className = '',
  language = 'en-US',
}: VoiceSearchInputProps) {
  const handleVoiceResult = useCallback(
    (transcript: string, processedQuery: string) => {
      onChange(processedQuery)
      onVoiceResult?.(transcript, processedQuery)
    },
    [onChange, onVoiceResult]
  )

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <VoiceSearchButton
          onResult={handleVoiceResult}
          language={language}
          size="md"
          variant="outline"
          className="flex-shrink-0"
        />
      </div>
    </div>
  )
}
