// Changelog: Renamed to Explore; wizard stepper with visuals; fixed cramped layout to full-width card + right tips panel; added progress/results animation.

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  Home,
  Utensils,
  Sparkles,
  DollarSign,
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
  Check,
  Globe,
  Heart,
  Star,
  Loader2
} from 'lucide-react'

const SERVICES = [
  { id: 'cleaning', label: 'House Cleaning', icon: Home, color: 'teal' },
  { id: 'cooking', label: 'Cooking', icon: Utensils, color: 'sunset' },
  { id: 'deep-clean', label: 'Deep Clean', icon: Sparkles, color: 'teal' },
  { id: 'meal-prep', label: 'Meal Prep', icon: Utensils, color: 'sunset' },
  { id: 'laundry', label: 'Laundry', icon: Home, color: 'teal' },
  { id: 'organization', label: 'Organization', icon: Home, color: 'sunset' }
]

const MOCK_MATCHES = [
  {
    id: 1,
    name: 'Maria Rodriguez',
    bio: 'Professional cleaner with 10 years of experience. Specializes in eco-friendly products.',
    photo: 'https://i.pravatar.cc/150?img=1',
    score: 92,
    rate: '$200/month',
    location: 'El Poblado',
    verified: true,
    specialties: ['English speaker', 'Pet-friendly', 'Eco-friendly'],
    availability: 'Mon-Fri mornings'
  },
  {
    id: 2,
    name: 'Carlos Martinez',
    bio: 'Expert in Colombian cuisine and meal prep. Can accommodate dietary restrictions.',
    photo: 'https://i.pravatar.cc/150?img=8',
    score: 88,
    rate: '$250/month',
    location: 'Laureles',
    verified: true,
    specialties: ['Vegan options', 'Meal planning', 'Colombian cuisine'],
    availability: 'Flexible schedule'
  },
  {
    id: 3,
    name: 'Ana Silva',
    bio: 'Reliable house cleaner and organizer. Great with pets and children.',
    photo: 'https://i.pravatar.cc/150?img=5',
    score: 85,
    rate: '$180/month',
    location: 'Envigado',
    verified: false,
    specialties: ['Organization', 'Deep cleaning', 'Pet-friendly'],
    availability: 'Weekends available'
  }
]

export default function ExplorePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCity, setSelectedCity] = useState('medellin')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [frequency, setFrequency] = useState('weekly')
  const [budget, setBudget] = useState([150, 300])
  const [extras, setExtras] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [matches, setMatches] = useState<any[]>([])
  const [showTooltip, setShowTooltip] = useState(false)

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleExtraToggle = (extra: string) => {
    setExtras(prev =>
      prev.includes(extra)
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    )
  }

  const handleFindMatches = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setMatches(MOCK_MATCHES)
      setIsLoading(false)
    }, 1500)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true // City is always selected
      case 2:
        return selectedServices.length > 0
      case 3:
        return true // Details are optional
      default:
        return false
    }
  }

  const getTips = () => {
    if (currentStep === 1) {
      return selectedCity === 'medellin'
        ? "El Poblado and Laureles are the most popular expat neighborhoods with the highest concentration of English-speaking helpers."
        : "Lagoa and Campeche have great options for beach-loving expats. Most helpers here speak some English."
    }
    if (currentStep === 2) {
      return selectedServices.length > 0
        ? `Great choice! Bundling ${selectedServices.length} services usually saves 15-20% compared to booking separately.`
        : "Pro tip: Combining cleaning + cooking is the most popular package among expats (saves ~$50/month)."
    }
    if (currentStep === 3) {
      return frequency === 'weekly'
        ? `Weekly service in ${selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'} averages $${budget[0]}-$${budget[1]}/month. Most expats start here.`
        : "Bi-weekly service is perfect for minimalists. Consider adding a monthly deep clean for best results."
    }
    return null
  }

  const getPreview = () => {
    const serviceCount = selectedServices.length
    if (serviceCount === 0) return null

    const cityName = selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'
    return `Based on ${serviceCount} service${serviceCount > 1 ? 's' : ''} in ${cityName}: ~12 matches available`
  }

  return (
    <div className="min-h-screen bg-warmth-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start gap-2">
            <h1 className="text-4xl font-bold text-teal-600">Explore</h1>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="p-1 hover:bg-teal-50 rounded-full transition-colors"
              >
                <Info className="h-5 w-5 text-teal-500" />
              </button>
              {showTooltip && (
                <div className="absolute left-0 top-8 w-64 p-3 bg-white rounded-lg shadow-lg border border-teal-100 z-10">
                  <p className="text-sm text-gray-600">
                    Our interactive tool lets you explore home help options. Answer a few questions for AI-matched recommendations—free previews, Premium for intros.
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600 mt-2">Discover & test matches for your expat setup</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Wizard Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                          currentStep >= step
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {currentStep > step ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <span className="font-medium">{step}</span>
                        )}
                      </div>
                      {step < 3 && (
                        <div
                          className={`h-1 w-20 lg:w-32 transition-colors ${
                            currentStep > step ? 'bg-teal-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-600">
                  {currentStep === 1 && 'Select Your City'}
                  {currentStep === 2 && 'Choose Services'}
                  {currentStep === 3 && 'Add Details'}
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[300px]">
                {/* Step 1: City Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Where are you based?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedCity('medellin')}
                        className={`p-6 rounded-lg border-2 transition-all ${
                          selectedCity === 'medellin'
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <MapPin className="h-8 w-8 mb-2 text-teal-600 mx-auto" />
                        <h3 className="font-semibold text-lg">Medellín</h3>
                        <p className="text-sm text-gray-600 mt-1">El Poblado, Laureles, Envigado</p>
                      </button>
                      <button
                        onClick={() => setSelectedCity('florianopolis')}
                        className={`p-6 rounded-lg border-2 transition-all ${
                          selectedCity === 'florianopolis'
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Globe className="h-8 w-8 mb-2 text-teal-600 mx-auto" />
                        <h3 className="font-semibold text-lg">Florianópolis</h3>
                        <p className="text-sm text-gray-600 mt-1">Lagoa, Campeche, Centro</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Service Selection */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">What services do you need?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {SERVICES.map((service) => {
                        const Icon = service.icon
                        const isSelected = selectedServices.includes(service.id)
                        return (
                          <button
                            key={service.id}
                            onClick={() => handleServiceToggle(service.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? service.color === 'sunset'
                                  ? 'border-sunset-500 bg-sunset-50'
                                  : 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className={`h-6 w-6 mb-2 mx-auto ${
                              isSelected
                                ? service.color === 'sunset' ? 'text-sunset-600' : 'text-teal-600'
                                : 'text-gray-500'
                            }`} />
                            <p className={`text-sm font-medium ${
                              isSelected ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {service.label}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Step 3: Details */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Customize your preferences</h2>

                    {/* Frequency */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Service Frequency
                      </label>
                      <div className="flex gap-3">
                        {['weekly', 'bi-weekly', 'monthly'].map((freq) => (
                          <button
                            key={freq}
                            onClick={() => setFrequency(freq)}
                            className={`px-4 py-2 rounded-lg border-2 capitalize transition-all ${
                              frequency === freq
                                ? 'border-teal-500 bg-teal-50 text-teal-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget Range */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Monthly Budget: ${budget[0]} - ${budget[1]}
                      </label>
                      <div className="px-3">
                        <input
                          type="range"
                          min="100"
                          max="500"
                          value={budget[1]}
                          onChange={(e) => setBudget([budget[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                        />
                      </div>
                    </div>

                    {/* Extras */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Special Requirements
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['English speaker', 'Pet-friendly', 'Vegan cooking', 'Eco-friendly'].map((extra) => (
                          <button
                            key={extra}
                            onClick={() => handleExtraToggle(extra)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              extras.includes(extra)
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {extra}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    currentStep === 1
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                      canProceed()
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFindMatches}
                    disabled={!canProceed() || isLoading}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                      canProceed() && !isLoading
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Finding Matches...
                      </>
                    ) : (
                      <>
                        Find Matches
                        <Sparkles className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tips Panel (Desktop) */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5 text-sunset-500" />
                Pro Tips
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {getTips()}
              </p>

              {getPreview() && (
                <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm font-medium text-teal-700">{getPreview()}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Popular in {selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'}:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cleaning + Cooking</span>
                    <span className="text-teal-600 font-medium">68%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Weekly service</span>
                    <span className="text-teal-600 font-medium">71%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">English speaker</span>
                    <span className="text-teal-600 font-medium">45%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {matches.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Matches</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match, index) => (
                <div
                  key={match.id}
                  className="bg-white rounded-xl shadow-md p-6 opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={match.photo}
                      alt={match.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{match.name}</h3>
                        {match.verified && (
                          <Check className="h-4 w-4 text-teal-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{match.location}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-sunset-500 fill-sunset-500" />
                        <span className="text-sm font-medium">{match.rate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-sunset-50 rounded-full">
                        <span className="text-lg font-bold text-sunset-600">{match.score}</span>
                        <span className="text-xs text-sunset-600">/100</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{match.bio}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {match.specialties.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-2 text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors">
                    View Profile →
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-600 mb-4">
                Want unlimited matches and direct intros?
              </p>
              <button className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
                Upgrade to Premium
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}