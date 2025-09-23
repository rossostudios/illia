'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiGlobe,
  FiHome,
  FiMapPin,
  FiUser,
} from 'react-icons/fi'

type QuizData = {
  city: string
  services: string[]
  languages: string[]
  budget: string
  frequency: string
  preferences: string
  name?: string
  email?: string
  phone?: string
}

const CITIES = [
  { value: 'medellin', label: 'Medellín, Colombia', icon: '🇨🇴' },
  { value: 'florianopolis', label: 'Florianópolis, Brazil', icon: '🇧🇷' },
]

const SERVICES = [
  { value: 'cleaning', label: 'House Cleaning', icon: '🧹' },
  { value: 'cooking', label: 'Personal Chef', icon: '👨‍🍳' },
  { value: 'meal_prep', label: 'Meal Prep', icon: '🥗' },
  { value: 'childcare', label: 'Nanny/Childcare', icon: '👶' },
  { value: 'pet_care', label: 'Pet Care', icon: '🐕' },
  { value: 'handyman', label: 'Handyman/Repairs', icon: '🔧' },
  { value: 'gardening', label: 'Gardening', icon: '🌿' },
  { value: 'laundry', label: 'Laundry Service', icon: '👔' },
  { value: 'driver', label: 'Personal Driver', icon: '🚗' },
  { value: 'other', label: 'Other', icon: '📋' },
]

const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'portuguese', label: 'Portuguese' },
]

const BUDGETS = {
  medellin: [
    { value: '0-500000', label: 'Under 500,000 COP/month' },
    { value: '500000-800000', label: '500,000 - 800,000 COP/month' },
    { value: '800000-1200000', label: '800,000 - 1,200,000 COP/month' },
    { value: '1200000+', label: 'Over 1,200,000 COP/month' },
  ],
  florianopolis: [
    { value: '0-1500', label: 'Under R$1,500/month' },
    { value: '1500-2500', label: 'R$1,500 - R$2,500/month' },
    { value: '2500-4000', label: 'R$2,500 - R$4,000/month' },
    { value: '4000+', label: 'Over R$4,000/month' },
  ],
}

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: '2-3 times per week' },
  { value: 'biweekly', label: 'Once a week' },
  { value: 'monthly', label: '2-3 times per month' },
  { value: 'occasional', label: 'Occasionally' },
]

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<QuizData>({
    city: '',
    services: [],
    languages: [],
    budget: '',
    frequency: '',
    preferences: '',
  })

  const totalSteps = 7

  const updateData = (field: keyof QuizData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleService = (service: string) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const toggleLanguage = (language: string) => {
    setData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }))
  }

  const canContinue = () => {
    switch (step) {
      case 1:
        return data.city !== ''
      case 2:
        return data.services.length > 0
      case 3:
        return data.languages.length > 0
      case 4:
        return data.budget !== ''
      case 5:
        return data.frequency !== ''
      case 6:
        return data.preferences.trim() !== ''
      case 7:
        return data.name && data.email
      default:
        return false
    }
  }

  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!canContinue()) return

    setLoading(true)
    setError('')

    try {
      // Save preferences and get matches
      const response = await fetch('/api/quiz/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: data.city,
          services: data.services,
          languages: data.languages,
          budget: data.budget,
          frequency: data.frequency,
          preferences: {
            ...data,
            specificNeeds: data.preferences,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to save preferences (${response.status})`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to process your request')
      }

      if (!result.matches || result.matches.length === 0) {
        setError('No matches found. Try adjusting your preferences and searching again.')
        return
      }

      // Store matches and quiz data for the matches page
      sessionStorage.setItem('matches', JSON.stringify(result.matches))
      sessionStorage.setItem('quizData', JSON.stringify(data))

      router.push('/matches')
    } catch (error) {
      console.error('Error:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save preferences. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const progress = (step / totalSteps) * 100

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Match</h1>
            <span className="text-sm text-gray-500">
              Step {step} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-teal-600 to-teal-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-10">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <FiMapPin className="w-12 h-12 mx-auto mb-4 text-teal-600" />
                <h2 className="text-2xl font-bold mb-2">Where are you located?</h2>
                <p className="text-gray-600">We'll match you with providers in your city</p>
              </div>
              <div className="space-y-3">
                {CITIES.map((city) => (
                  <button
                    key={city.value}
                    onClick={() => updateData('city', city.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      data.city === city.value
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{city.icon}</span>
                        <span className="font-medium">{city.label}</span>
                      </div>
                      {data.city === city.value && (
                        <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <FiHome className="w-12 h-12 mx-auto mb-4 text-teal-600" />
                <h2 className="text-2xl font-bold mb-2">What services do you need?</h2>
                <p className="text-gray-600">Select all that apply</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SERVICES.map((service) => (
                  <button
                    key={service.value}
                    onClick={() => toggleService(service.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.services.includes(service.value)
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-2xl mb-2 block">{service.icon}</span>
                      <span className="text-sm font-medium">{service.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <FiGlobe className="w-12 h-12 mx-auto mb-4 text-teal-600" />
                <h2 className="text-2xl font-bold mb-2">Language preferences?</h2>
                <p className="text-gray-600">Select languages you're comfortable with</p>
              </div>
              <div className="space-y-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => toggleLanguage(lang.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      data.languages.includes(lang.value)
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{lang.label}</span>
                      {data.languages.includes(lang.value) && (
                        <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <FiDollarSign className="w-12 h-12 mx-auto mb-4 text-teal-600" />
                <h2 className="text-2xl font-bold mb-2">What's your budget?</h2>
                <p className="text-gray-600">Monthly service budget</p>
              </div>
              <div className="space-y-3">
                {(BUDGETS[data.city as keyof typeof BUDGETS] || BUDGETS.medellin).map((budget) => (
                  <button
                    key={budget.value}
                    onClick={() => updateData('budget', budget.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      data.budget === budget.value
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{budget.label}</span>
                      {data.budget === budget.value && (
                        <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <FiCalendar className="w-12 h-12 mx-auto mb-4 text-teal-600" />
                <h2 className="text-2xl font-bold mb-2">How often do you need help?</h2>
                <p className="text-gray-600">Service frequency</p>
              </div>
              <div className="space-y-3">
                {FREQUENCIES.map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => updateData('frequency', freq.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      data.frequency === freq.value
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{freq.label}</span>
                      {data.frequency === freq.value && (
                        <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center">
                <FiUser className="w-12 h-12 mx-auto mb-4 text-teal-600" />
                <h2 className="text-2xl font-bold mb-2">Any specific preferences?</h2>
                <p className="text-gray-600">Tell us more about what you're looking for</p>
              </div>
              <textarea
                value={data.preferences}
                onChange={(e) => updateData('preferences', e.target.value)}
                placeholder="E.g., I need someone pet-friendly, available on weekends, experience with eco-friendly products..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none resize-none"
                rows={6}
              />
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">✨</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Almost there!</h2>
                <p className="text-gray-600">We'll email you your matches</p>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={data.name || ''}
                  onChange={(e) => updateData('name', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={data.email || ''}
                  onChange={(e) => updateData('email', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp number (optional)"
                  value={data.phone || ''}
                  onChange={(e) => updateData('phone', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-red-600 text-sm">⚠️</span>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="mt-2 text-red-600 text-xs hover:text-red-800 transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={() => {
                  setStep(step - 1)
                  setError('')
                }}
                disabled={loading}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <FiChevronLeft />
                <span>Back</span>
              </button>
            )}

            {step < totalSteps ? (
              <button
                onClick={() => {
                  setStep(step + 1)
                  setError('')
                }}
                disabled={!canContinue() || loading}
                className={`ml-auto px-6 py-3 rounded-xl transition-all flex items-center space-x-2 ${
                  canContinue() && !loading
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-700 cursor-not-allowed'
                }`}
              >
                <span>Continue</span>
                <FiChevronRight />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canContinue() || loading}
                className={`ml-auto px-8 py-3 rounded-xl transition-all flex items-center space-x-2 ${
                  canContinue() && !loading
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-700 cursor-not-allowed'
                }`}
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{loading ? 'Finding matches...' : 'Get My Matches'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>🔒 Your information is secure and never shared without permission</p>
        </div>
      </div>
    </div>
  )
}
