'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/hooks/useSession'
import { X, Loader2, Sparkles, MapPin, Info, ChevronDown, User } from 'lucide-react'
import { CHARLESTON_PERSONAS, getPersonaById } from '@/lib/charleston-personas'

interface GenerateLeadsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const POPULAR_NICHES = [
  { value: 'plumbers', label: 'Plumbers', icon: '🔧' },
  { value: 'hvac', label: 'HVAC Services', icon: '❄️' },
  { value: 'electricians', label: 'Electricians', icon: '⚡' },
  { value: 'roofers', label: 'Roofers', icon: '🏠' },
  { value: 'cafes', label: 'Cafes & Coffee', icon: '☕' },
  { value: 'restaurants', label: 'Restaurants', icon: '🍽️' },
  { value: 'real-estate', label: 'Real Estate', icon: '🏡' },
  { value: 'auto-repair', label: 'Auto Repair', icon: '🚗' },
  { value: 'landscaping', label: 'Landscaping', icon: '🌳' },
  { value: 'cleaning', label: 'Cleaning Services', icon: '🧹' },
]

const CHARLESTON_ZIPS = [
  '29401', '29403', '29405', '29407', '29409',
  '29412', '29414', '29418', '29420', '29424'
]

export default function GenerateLeadsModal({ isOpen, onClose, onSuccess }: GenerateLeadsModalProps) {
  const { user } = useSession()

  const [niche, setNiche] = useState('plumbers')
  const [customNiche, setCustomNiche] = useState('')
  const [isCustomNiche, setIsCustomNiche] = useState(false)
  const [location, setLocation] = useState('Charleston, SC')
  const [zipCode, setZipCode] = useState('29401')
  const [radius, setRadius] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [zipError, setZipError] = useState<string | null>(null)
  const [showNicheDropdown, setShowNicheDropdown] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const [showPersonaSelector, setShowPersonaSelector] = useState(false)
  const [localDataOnly, setLocalDataOnly] = useState(false)

  useEffect(() => {
    if (selectedPersona) {
      const persona = getPersonaById(selectedPersona)
      if (persona) {
        setNiche(persona.niche)
        setZipCode(persona.zipCode)
        setRadius(persona.radius)
        setIsCustomNiche(false)
      }
    }
  }, [selectedPersona])

  if (!isOpen) return null

  const validateZip = (zip: string) => {
    const cleaned = zip.replace(/\D/g, '')
    if (cleaned.length !== 5) {
      setZipError('ZIP code must be 5 digits')
      return false
    }
    if (!CHARLESTON_ZIPS.includes(cleaned) && cleaned.substr(0, 3) !== '294') {
      setZipError('For best results, use a Charleston area ZIP (294xx)')
    } else {
      setZipError(null)
    }
    return true
  }

  const handleZipChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 5)
    setZipCode(cleaned)
    if (cleaned.length === 5) {
      validateZip(cleaned)
    } else {
      setZipError(null)
    }
  }

  const handleGenerate = async () => {
    if (!user?.email) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche: isCustomNiche ? customNiche : niche,
          location,
          zipCode,
          radius,
          localDataOnly,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate leads')
      }

      onSuccess()
      onClose()
    } catch (error) {
      setError((error as Error).message || 'Failed to generate leads')
    } finally {
      setLoading(false)
    }
  }

  const selectedNiche = isCustomNiche
    ? customNiche
    : POPULAR_NICHES.find(n => n.value === niche)?.label || niche

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg">
              <Sparkles className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quick Generate Leads</h2>
              <p className="text-sm text-gray-600">Get ready-to-call leads from Charleston ZIPs</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start">
              <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Persona Quick Start */}
          <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Quick Start with Persona</p>
                  <p className="text-xs text-gray-600 mt-0.5">Pre-configured settings for Charleston businesses</p>
                </div>
              </div>
              <button
                onClick={() => setShowPersonaSelector(!showPersonaSelector)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {showPersonaSelector ? 'Hide' : 'Browse'}
              </button>
            </div>

            {showPersonaSelector && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {CHARLESTON_PERSONAS.slice(0, 4).map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => {
                      setSelectedPersona(persona.id)
                      setShowPersonaSelector(false)
                    }}
                    className={`p-2 text-left rounded-lg border transition-all ${
                      selectedPersona === persona.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{persona.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{persona.title}</p>
                        <p className="text-xs text-gray-500 truncate">{persona.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedPersona && !showPersonaSelector && (
              <div className="mt-2 p-2 bg-white rounded border border-indigo-200">
                <p className="text-xs text-gray-700">
                  <span className="font-medium">Active: </span>
                  {getPersonaById(selectedPersona)?.title}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Niche Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Niche
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNicheDropdown(!showNicheDropdown)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-left flex items-center justify-between"
                  disabled={loading}
                >
                  <span className="flex items-center">
                    {!isCustomNiche && (
                      <span className="mr-2">
                        {POPULAR_NICHES.find(n => n.value === niche)?.icon}
                      </span>
                    )}
                    {selectedNiche}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showNicheDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showNicheDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {POPULAR_NICHES.map((nicheOption) => (
                      <button
                        key={nicheOption.value}
                        onClick={() => {
                          setNiche(nicheOption.value)
                          setIsCustomNiche(false)
                          setShowNicheDropdown(false)
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-teal-50 flex items-center transition-colors"
                      >
                        <span className="mr-3 text-lg">{nicheOption.icon}</span>
                        <span className="text-gray-700">{nicheOption.label}</span>
                      </button>
                    ))}
                    <div className="border-t border-gray-200 p-3">
                      <input
                        type="text"
                        value={customNiche}
                        onChange={(e) => {
                          setCustomNiche(e.target.value)
                          setIsCustomNiche(true)
                        }}
                        onFocus={() => setIsCustomNiche(true)}
                        placeholder="Or type custom niche..."
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location & ZIP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-3.5 w-3.5 mr-1" />
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => handleZipChange(e.target.value)}
                  onBlur={() => zipCode.length === 5 && validateZip(zipCode)}
                  placeholder="29401"
                  maxLength={5}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    zipError ? 'border-orange-400' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {zipError && (
                  <p className="mt-1 text-xs text-orange-600">{zipError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Radius (miles)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    min="1"
                    max="25"
                    className="w-full"
                    disabled={loading}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1mi</span>
                    <span className="font-medium text-teal-600">{radius}mi</span>
                    <span>25mi</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Charleston, SC"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                disabled={loading}
              />
            </div>

            {/* Privacy Settings */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="localDataOnly"
                    checked={localDataOnly}
                    onChange={(e) => setLocalDataOnly(e.target.checked)}
                    className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                    disabled={loading}
                  />
                  <label htmlFor="localDataOnly" className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Local Data Only</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      CCPA
                    </span>
                  </label>
                </div>
              </div>
              {localDataOnly && (
                <p className="text-xs text-gray-600 mt-2 ml-6">
                  Only processes data from Charleston area (294xx ZIPs). No external enrichment.
                </p>
              )}
            </div>

            {/* Tip Box */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-gray-700 font-medium mb-1">Charleston Growth Tip</p>
                  <p className="text-gray-600">
                    Focus on <strong>29401</strong> (Downtown) & <strong>29403</strong> (Upper King)
                    for high tourist traffic. Summer HVAC & plumbing see 30% more demand.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center font-medium shadow-lg"
              disabled={loading || (!niche && !customNiche) || !location || !zipCode}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Leads
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}