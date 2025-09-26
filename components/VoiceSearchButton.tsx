'use client'

import { AlertCircle, Mic, MicOff, Volume2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useVoiceSearch } from '@/hooks/use-voice-search'

type VoiceSearchButtonProps = {
  onResult?: (transcript: string, processedQuery: string) => void
  onError?: (error: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'outline' | 'ghost'
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
  useEffect(
    () => () => {
      if (transcriptTimeoutRef.current) {
        clearTimeout(transcriptTimeoutRef.current)
      }
    },
    []
  )

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
        className={`${className} ${buttonSize[size]} cursor-not-allowed p-0 opacity-50`}
        disabled
        title="Voice search not supported in this browser"
        variant="ghost"
      >
        <MicOff className={`${iconSize[size]}`} />
      </Button>
    )
  }

  return (
    <>
      <div className="relative">
        <Button
          className={`${className} ${buttonSize[size]} relative p-0 ${
            isListening ? 'animate-pulse bg-red-500 text-white hover:bg-red-600' : ''
          }`}
          onClick={handleClick}
          title={isListening ? 'Stop voice search' : 'Start voice search'}
          variant={variant}
        >
          {isListening ? (
            <div className="relative">
              <Mic className={`${iconSize[size]} animate-pulse`} />
              {/* Recording indicator */}
              <div className="-top-1 -right-1 absolute h-2 w-2 animate-ping rounded-full bg-red-500" />
              <div className="-top-1 -right-1 absolute h-2 w-2 rounded-full bg-red-500" />
            </div>
          ) : (
            <Mic className={iconSize[size]} />
          )}
        </Button>

        {/* Listening indicator */}
        {isListening && (
          <div className="-top-2 -right-2 absolute flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
          </div>
        )}
      </div>

      {/* Transcript Modal */}
      {showTranscriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
            <Button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={handleCloseTranscript}
            >
              <AlertCircle className="h-5 w-5" />
            </Button>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Volume2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                  Voice Search Complete
                </h3>
                <p className="text-gray-600 text-sm dark:text-gray-400">
                  Confidence: {Math.round((confidence || 0) * 100)}%
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  You said:
                </label>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
                  <p className="text-gray-900 italic dark:text-white">"{lastTranscript}"</p>
                </div>
              </div>

              {lastProcessedQuery !== lastTranscript && (
                <div>
                  <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                    Processed as:
                  </label>
                  <div className="rounded-lg border border-teal-200 bg-teal-50 p-3 dark:border-teal-800 dark:bg-teal-900/20">
                    <p className="font-medium text-teal-900 dark:text-teal-100">
                      "{lastProcessedQuery}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                className="flex-1"
                onClick={() => {
                  clearVoiceSearch()
                  handleCloseTranscript()
                }}
                variant="outline"
              >
                Clear
              </Button>
              <Button className="flex-1" onClick={handleCloseTranscript}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed right-4 bottom-4 z-50 max-w-sm rounded-lg bg-red-500 px-4 py-3 text-white shadow-lg">
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
type VoiceSearchInputProps = {
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
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type="text"
          value={value}
        />
        <VoiceSearchButton
          className="flex-shrink-0"
          language={language}
          onResult={handleVoiceResult}
          size="md"
          variant="outline"
        />
      </div>
    </div>
  )
}
