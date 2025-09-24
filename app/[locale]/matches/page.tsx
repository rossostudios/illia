'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiHeart, FiMail, FiMapPin, FiPhone, FiStar } from 'react-icons/fi'

type Match = {
  id: string
  name: string
  bio: string
  services: string[]
  languages: string[]
  specialties: string[]
  rate_monthly: number
  currency: string
  years_experience: number
  city: string
  rating_avg?: number
  reviews_count?: number
  photo_url?: string
  match_score: number
  match_explanation: string
  phone?: string | null
  email?: string | null
}

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

const SERVICE_EMOJIS: { [key: string]: string } = {
  cleaning: '🧹',
  cooking: '👨‍🍳',
  meal_prep: '🥗',
  childcare: '👶',
  pet_care: '🐕',
  handyman: '🔧',
  gardening: '🌿',
  laundry: '👔',
  driver: '🚗',
  other: '📋',
}

const LANGUAGE_FLAGS: { [key: string]: string } = {
  english: '🇺🇸',
  spanish: '🇪🇸',
  portuguese: '🇧🇷',
}

function formatCurrency(amount: number, currency: string): string {
  if (currency === 'COP') {
    return `$${amount.toLocaleString()} COP`
  }
  if (currency === 'BRL') {
    return `R$${amount.toLocaleString()}`
  }
  return `$${amount.toLocaleString()}`
}

function getScoreColor(score: number): string {
  if (score >= 90) {
    return 'text-green-600 bg-green-100'
  }
  if (score >= 80) {
    return 'text-blue-600 bg-blue-100'
  }
  if (score >= 70) {
    return 'text-yellow-600 bg-yellow-100'
  }
  return 'text-gray-600 bg-gray-100'
}

function getScoreLabel(score: number): string {
  if (score >= 90) {
    return 'Excellent Match'
  }
  if (score >= 80) {
    return 'Great Match'
  }
  if (score >= 70) {
    return 'Good Match'
  }
  return 'Potential Match'
}

export default function MatchesPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)

  useEffect(() => {
    const storedMatches = sessionStorage.getItem('matches')
    const storedQuizData = sessionStorage.getItem('quizData')

    if (!(storedMatches && storedQuizData)) {
      router.push('/quiz')
      return
    }

    try {
      const parsedMatches = JSON.parse(storedMatches)
      const parsedQuizData = JSON.parse(storedQuizData)

      setMatches(parsedMatches)
      setQuizData(parsedQuizData)
    } catch (_error) {
      router.push('/quiz')
      return
    }

    setLoading(false)
  }, [router])

  const handleContactProvider = (match: Match) => {
    const message = `Hi ${match.name}! I found your profile on Illia.club and I'm interested in your ${match.services.join(', ')} services. ${quizData?.preferences ? `Here are my specific needs: ${quizData.preferences}` : ''} Would you be available for a brief chat?`

    if (match.phone) {
      window.open(`https://wa.me/${match.phone}?text=${encodeURIComponent(message)}`, '_blank')
    } else {
      window.open(
        `mailto:${match.email || 'contact@illia.club'}?subject=Service Inquiry from Illia.club&body=${encodeURIComponent(message)}`
      )
    }
  }

  const handleSaveMatch = (matchId: string) => {
    setSelectedMatch(selectedMatch === matchId ? null : matchId)
  }

  const retakeQuiz = () => {
    sessionStorage.removeItem('matches')
    sessionStorage.removeItem('quizData')
    router.push('/quiz')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          <p className="text-gray-600">Loading your matches...</p>
        </div>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
              <span className="text-4xl">😔</span>
            </div>
            <h1 className="mb-4 font-bold text-3xl">No Matches Found</h1>
            <p className="mx-auto mb-8 max-w-md text-gray-600">
              We couldn't find any providers matching your specific criteria. Try adjusting your
              preferences and take the quiz again.
            </p>
            <button
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-white transition-all hover:shadow-lg"
              onClick={retakeQuiz}
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-bold text-4xl">Your Perfect Matches! 🎉</h1>
          <p className="text-gray-600 text-lg">
            We found {matches.length} amazing provider{matches.length !== 1 ? 's' : ''} for you in{' '}
            {quizData?.city}
          </p>
          <button
            className="mt-4 text-purple-600 transition-colors hover:text-purple-800"
            onClick={retakeQuiz}
          >
            Want different results? Retake quiz →
          </button>
        </div>

        {quizData && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 font-semibold text-xl">Your Preferences</h2>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div>
                <span className="font-medium text-gray-500">Services:</span>
                <div className="mt-1">
                  {quizData.services.map((service) => (
                    <span className="mr-2 inline-flex items-center space-x-1" key={service}>
                      <span>{SERVICE_EMOJIS[service] || '📋'}</span>
                      <span className="capitalize">{service.replace('_', ' ')}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Languages:</span>
                <div className="mt-1">
                  {quizData.languages.map((lang) => (
                    <span className="mr-2 inline-flex items-center space-x-1" key={lang}>
                      <span>{LANGUAGE_FLAGS[lang] || '🌍'}</span>
                      <span className="capitalize">{lang}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Budget:</span>
                <p className="mt-1">{quizData.budget}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {matches.map((match, _index) => (
            <div
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              key={match.id}
            >
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 font-bold text-white text-xl">
                      {match.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl">{match.name}</h3>
                      <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <FiMapPin className="h-4 w-4" />
                        <span className="capitalize">{match.city}</span>
                        {match.years_experience && (
                          <>
                            <span>•</span>
                            <span>{match.years_experience} years exp</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex rounded-full px-3 py-1 font-medium text-sm ${getScoreColor(match.match_score)}`}
                    >
                      {match.match_score}% match
                    </div>
                    <p className="mt-1 text-gray-500 text-xs">{getScoreLabel(match.match_score)}</p>
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 text-gray-600 text-sm">{match.bio}</p>

                <div className="mb-4">
                  <p className="mb-2 font-medium text-purple-700 text-sm">Why this match:</p>
                  <p className="rounded-lg bg-purple-50 p-3 text-gray-600 text-sm">
                    {match.match_explanation}
                  </p>
                </div>

                <div className="mb-6 space-y-3">
                  <div>
                    <span className="font-medium text-gray-500 text-sm">Services:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {match.services.map((service) => (
                        <span
                          className="inline-flex items-center space-x-1 rounded-full bg-blue-100 px-2 py-1 text-blue-800 text-xs"
                          key={service}
                        >
                          <span>{SERVICE_EMOJIS[service] || '📋'}</span>
                          <span className="capitalize">{service.replace('_', ' ')}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-500 text-sm">Languages:</span>
                      <div className="mt-1 flex space-x-1">
                        {match.languages.map((lang) => (
                          <span className="text-sm" key={lang}>
                            {LANGUAGE_FLAGS[lang] || '🌍'} {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500 text-sm">Rate:</span>
                      <p className="mt-1 font-semibold text-gray-900 text-sm">
                        {formatCurrency(match.rate_monthly, match.currency)}/month
                      </p>
                    </div>
                  </div>

                  {match.specialties && match.specialties.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-500 text-sm">Specialties:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {match.specialties.map((specialty) => (
                          <span
                            className="rounded-full bg-green-100 px-2 py-1 text-green-800 text-xs"
                            key={specialty}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(match.rating_avg || match.reviews_count) && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-sm">{match.rating_avg || 5.0}</span>
                      </div>
                      {match.reviews_count && (
                        <span className="text-gray-500 text-sm">
                          ({match.reviews_count} reviews)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-white transition-all hover:shadow-lg"
                    onClick={() => handleContactProvider(match)}
                  >
                    <FiMail className="h-4 w-4" />
                    <span>Contact Now</span>
                  </button>
                  <button
                    className={`rounded-xl border-2 px-4 py-3 transition-all ${
                      selectedMatch === match.id
                        ? 'border-red-400 bg-red-50 text-red-600'
                        : 'border-gray-200 text-gray-600 hover:border-purple-300'
                    }`}
                    onClick={() => handleSaveMatch(match.id)}
                  >
                    <FiHeart
                      className={`h-5 w-5 ${selectedMatch === match.id ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-4 font-bold text-2xl">What's Next?</h2>
            <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
              <div>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <FiMail className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 font-semibold">1. Contact Providers</h3>
                <p className="text-gray-600 text-sm">
                  Reach out to your top matches via WhatsApp or email
                </p>
              </div>
              <div>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <FiPhone className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 font-semibold">2. Schedule Meetings</h3>
                <p className="text-gray-600 text-sm">
                  Set up video calls or in-person meetings to discuss details
                </p>
              </div>
              <div>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <FiStar className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 font-semibold">3. Start Service</h3>
                <p className="text-gray-600 text-sm">
                  Begin working with your chosen provider and leave reviews
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-purple-50 p-4">
              <p className="text-purple-800 text-sm">
                <strong>💡 Pro tip:</strong> Contact multiple providers to compare rates and
                availability. Most providers offer free consultations!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="mb-4 text-gray-500 text-sm">
            Need help finding the right provider? We're here to help!
          </p>
          <button
            className="text-purple-600 transition-colors hover:text-purple-800"
            onClick={() =>
              window.open('mailto:support@illia.club?subject=Help with provider matching')
            }
          >
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  )
}
