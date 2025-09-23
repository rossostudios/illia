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
  } else if (currency === 'BRL') {
    return `R$${amount.toLocaleString()}`
  } else {
    return `$${amount.toLocaleString()}`
  }
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600 bg-green-100'
  if (score >= 80) return 'text-blue-600 bg-blue-100'
  if (score >= 70) return 'text-yellow-600 bg-yellow-100'
  return 'text-gray-600 bg-gray-100'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent Match'
  if (score >= 80) return 'Great Match'
  if (score >= 70) return 'Good Match'
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

    if (!storedMatches || !storedQuizData) {
      router.push('/quiz')
      return
    }

    try {
      const parsedMatches = JSON.parse(storedMatches)
      const parsedQuizData = JSON.parse(storedQuizData)

      setMatches(parsedMatches)
      setQuizData(parsedQuizData)
    } catch (error) {
      console.error('Error parsing stored data:', error)
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading your matches...</p>
        </div>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">😔</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">No Matches Found</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any providers matching your specific criteria. Try adjusting your
              preferences and take the quiz again.
            </p>
            <button
              onClick={retakeQuiz}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Your Perfect Matches! 🎉</h1>
          <p className="text-gray-600 text-lg">
            We found {matches.length} amazing provider{matches.length !== 1 ? 's' : ''} for you in{' '}
            {quizData?.city}
          </p>
          <button
            onClick={retakeQuiz}
            className="mt-4 text-purple-600 hover:text-purple-800 transition-colors"
          >
            Want different results? Retake quiz →
          </button>
        </div>

        {quizData && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Services:</span>
                <div className="mt-1">
                  {quizData.services.map((service) => (
                    <span key={service} className="inline-flex items-center space-x-1 mr-2">
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
                    <span key={lang} className="inline-flex items-center space-x-1 mr-2">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map((match, _index) => (
            <div
              key={match.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {match.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{match.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FiMapPin className="w-4 h-4" />
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
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(match.match_score)}`}
                    >
                      {match.match_score}% match
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{getScoreLabel(match.match_score)}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{match.bio}</p>

                <div className="mb-4">
                  <p className="text-sm font-medium text-purple-700 mb-2">Why this match:</p>
                  <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                    {match.match_explanation}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Services:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {match.services.map((service) => (
                        <span
                          key={service}
                          className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          <span>{SERVICE_EMOJIS[service] || '📋'}</span>
                          <span className="capitalize">{service.replace('_', ' ')}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Languages:</span>
                      <div className="flex space-x-1 mt-1">
                        {match.languages.map((lang) => (
                          <span key={lang} className="text-sm">
                            {LANGUAGE_FLAGS[lang] || '🌍'} {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Rate:</span>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatCurrency(match.rate_monthly, match.currency)}/month
                      </p>
                    </div>
                  </div>

                  {match.specialties && match.specialties.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Specialties:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {match.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
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
                        <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{match.rating_avg || 5.0}</span>
                      </div>
                      {match.reviews_count && (
                        <span className="text-sm text-gray-500">
                          ({match.reviews_count} reviews)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleContactProvider(match)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <FiMail className="w-4 h-4" />
                    <span>Contact Now</span>
                  </button>
                  <button
                    onClick={() => handleSaveMatch(match.id)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${
                      selectedMatch === match.id
                        ? 'border-red-400 bg-red-50 text-red-600'
                        : 'border-gray-200 hover:border-purple-300 text-gray-600'
                    }`}
                  >
                    <FiHeart
                      className={`w-5 h-5 ${selectedMatch === match.id ? 'fill-current' : ''}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiMail className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Contact Providers</h3>
                <p className="text-sm text-gray-600">
                  Reach out to your top matches via WhatsApp or email
                </p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiPhone className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Schedule Meetings</h3>
                <p className="text-sm text-gray-600">
                  Set up video calls or in-person meetings to discuss details
                </p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiStar className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Start Service</h3>
                <p className="text-sm text-gray-600">
                  Begin working with your chosen provider and leave reviews
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-800">
                <strong>💡 Pro tip:</strong> Contact multiple providers to compare rates and
                availability. Most providers offer free consultations!
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm mb-4">
            Need help finding the right provider? We're here to help!
          </p>
          <button
            onClick={() =>
              window.open('mailto:support@illia.club?subject=Help with provider matching')
            }
            className="text-purple-600 hover:text-purple-800 transition-colors"
          >
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  )
}
