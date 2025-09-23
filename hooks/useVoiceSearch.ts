'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { useToast } from '@/hooks/useToast'
import { createClient } from '@/lib/supabase/client'

export interface VoiceSearchResult {
  transcript: string
  confidence: number
  processedQuery: string
  searchResults: any[]
  duration: number
  language: string
}

interface UseVoiceSearchOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  maxDuration?: number // in seconds
  enableAnalytics?: boolean
}

export function useVoiceSearch(options: UseVoiceSearchOptions = {}) {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
    maxDuration = 30,
    enableAnalytics = true,
  } = options

  const { user } = useSession()
  const { showToast } = useToast()

  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [searchResult, setSearchResult] = useState<VoiceSearchResult | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()

      const recognition = recognitionRef.current
      recognition.lang = language
      recognition.continuous = continuous
      recognition.interimResults = interimResults
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
        startTimeRef.current = Date.now()
        setTranscript('')
        setInterimTranscript('')
        setConfidence(0)

        // Set timeout for max duration
        timeoutRef.current = setTimeout(() => {
          stopListening()
          showToast('Voice search timed out', 'warning')
        }, maxDuration * 1000)
      }

      recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        let highestConfidence = 0

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i]
          const resultTranscript = result[0].transcript
          const resultConfidence = result[0].confidence

          if (result.isFinal) {
            finalTranscript += resultTranscript
            highestConfidence = Math.max(highestConfidence, resultConfidence)
          } else {
            interimTranscript += resultTranscript
          }
        }

        setTranscript(finalTranscript)
        setInterimTranscript(interimTranscript)
        setConfidence(highestConfidence)

        // Auto-stop when we get a final result and it's not continuous
        if (finalTranscript && !continuous) {
          stopListening()
        }
      }

      recognition.onerror = (event) => {
        setError(event.error)
        setIsListening(false)

        let errorMessage = 'Voice recognition error'
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech was detected'
            break
          case 'audio-capture':
            errorMessage = 'Audio capture failed'
            break
          case 'not-allowed':
            errorMessage = 'Microphone permission denied'
            break
          case 'network':
            errorMessage = 'Network error occurred'
            break
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not allowed'
            break
        }

        showToast(errorMessage, 'error')
        console.error('Speech recognition error:', event.error)
      }

      recognition.onend = () => {
        setIsListening(false)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
    } else {
      setIsSupported(false)
      setError('Speech recognition not supported in this browser')
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [language, continuous, interimResults, maxDuration, showToast, stopListening])

  // Start voice search
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      showToast('Voice search not supported', 'error')
      return false
    }

    if (isListening) {
      return false
    }

    try {
      recognitionRef.current.start()
      return true
    } catch (err) {
      console.error('Error starting voice recognition:', err)
      showToast('Failed to start voice search', 'error')
      return false
    }
  }, [isSupported, isListening, showToast])

  // Stop voice search
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  // Process voice search result
  const processVoiceResult = useCallback(
    async (finalTranscript: string, confidence: number): Promise<VoiceSearchResult | null> => {
      if (!finalTranscript.trim()) return null

      try {
        const duration = (Date.now() - startTimeRef.current) / 1000

        // Process the transcript to extract search intent
        const processedQuery = await processVoiceTranscript(finalTranscript)

        // Perform search with processed query
        const searchResults = await performVoiceSearch(processedQuery)

        const result: VoiceSearchResult = {
          transcript: finalTranscript,
          confidence,
          processedQuery,
          searchResults,
          duration,
          language,
        }

        setSearchResult(result)

        // Save to analytics if enabled
        if (enableAnalytics && user) {
          const supabase = createClient()
          await supabase.from('voice_search_transcripts').insert({
            user_id: user.id,
            transcript: finalTranscript,
            confidence,
            processed_query: processedQuery,
            search_results: searchResults,
            duration_seconds: duration,
            language_code: language,
          })
        }

        return result
      } catch (err) {
        console.error('Error processing voice result:', err)
        showToast('Failed to process voice search', 'error')
        return null
      }
    },
    [language, enableAnalytics, user, showToast]
  )

  // Auto-process when transcript is complete
  useEffect(() => {
    if (transcript && !isListening && confidence > 0) {
      processVoiceResult(transcript, confidence)
    }
  }, [transcript, isListening, confidence, processVoiceResult])

  // Clear current session
  const clearVoiceSearch = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setConfidence(0)
    setSearchResult(null)
    setError(null)
  }, [])

  return {
    // State
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    confidence,
    error,
    searchResult,

    // Actions
    startListening,
    stopListening,
    clearVoiceSearch,

    // Computed
    fullTranscript: transcript + interimTranscript,
    hasResult: !!searchResult,
    canStart: isSupported && !isListening,
    canStop: isSupported && isListening,
  }
}

// Helper functions
async function processVoiceTranscript(transcript: string): Promise<string> {
  // Simple processing - in a real app, this would use AI/NLP
  let processed = transcript.toLowerCase().trim()

  // Remove filler words
  const fillers = ['um', 'uh', 'like', 'you know', 'so', 'well', 'actually']
  fillers.forEach((filler) => {
    processed = processed.replace(new RegExp(`\\b${filler}\\b`, 'gi'), '')
  })

  // Basic intent extraction
  const intentPatterns = {
    english: /english|ingles|bilingual/gi,
    pet: /pet|dog|cat|animal/gi,
    eco: /eco|green|organic|environment/gi,
    cheap: /cheap|affordable|budget|low cost/gi,
    cleaning: /clean|housekeeping|maid/gi,
    cooking: /cook|chef|meal|food/gi,
  }

  const intents: string[] = []
  Object.entries(intentPatterns).forEach(([intent, pattern]) => {
    if (pattern.test(processed)) {
      intents.push(intent)
    }
  })

  // If we found specific intents, restructure the query
  if (intents.length > 0) {
    const mainIntent = intents[0]
    processed = `${mainIntent} ${processed.replace(intentPatterns[mainIntent as keyof typeof intentPatterns], '').trim()}`
  }

  return processed.trim()
}

async function performVoiceSearch(processedQuery: string): Promise<any[]> {
  try {
    // This would integrate with your search API
    // For now, return mock results
    const mockResults = [
      {
        id: 'voice-result-1',
        name: 'Voice Search Result',
        type: 'voice_processed',
        query: processedQuery,
        timestamp: new Date().toISOString(),
      },
    ]

    return mockResults
  } catch (error) {
    console.error('Error performing voice search:', error)
    return []
  }
}

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  grammars: SpeechGrammarList
  interimResults: boolean
  lang: string
  maxAlternatives: number
  serviceURI: string

  start(): void
  stop(): void
  abort(): void

  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message: string
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly length: number
  readonly isFinal: boolean
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}
