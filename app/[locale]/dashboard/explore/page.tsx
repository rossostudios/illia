// Changelog: Renamed to Explore; wizard stepper with visuals; fixed cramped layout to full-width card + right tips panel; added progress/results animation.

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  Heart,
  Home,
  Info,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Users,
  Utensils,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ConnectedStepper } from '@/components/ConnectedStepper'

const SERVICES = [
  { id: 'cleaning', label: 'House Cleaning', icon: Home, color: 'teal' },
  { id: 'cooking', label: 'Cooking', icon: Utensils, color: 'sunset' },
  { id: 'deep-clean', label: 'Deep Clean', icon: Sparkles, color: 'teal' },
  { id: 'meal-prep', label: 'Meal Prep', icon: Utensils, color: 'sunset' },
  { id: 'laundry', label: 'Laundry', icon: Home, color: 'teal' },
  { id: 'organization', label: 'Organization', icon: Home, color: 'sunset' },
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
  const [validationError, setValidationError] = useState<string | null>(null)
  const [estimatedMatches, setEstimatedMatches] = useState(0)

  const calculateEstimatedMatches = () => {
    // Dynamic calculation based on selections
    let baseMatches = selectedCity === 'medellin' ? 15 : 12

    if (selectedServices.includes('cleaning')) baseMatches += 8
    if (selectedServices.includes('cooking')) baseMatches += 6
    if (selectedServices.includes('deep-clean')) baseMatches += 3
    if (selectedServices.includes('meal-prep')) baseMatches += 4

    if (extras.includes('English speaker')) baseMatches = Math.floor(baseMatches * 0.6)
    if (extras.includes('Pet-friendly')) baseMatches = Math.floor(baseMatches * 0.8)

    return Math.max(3, baseMatches) // Always show at least 3 matches
  }

  useEffect(() => {
    setEstimatedMatches(calculateEstimatedMatches())
  }, [calculateEstimatedMatches])

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    )
  }

  const handleExtraToggle = (extra: string) => {
    setExtras((prev) => (prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]))
  }

  const handleFindMatches = async () => {
    setIsLoading(true)

    try {
      // Build query parameters
      const params = new URLSearchParams({
        city: selectedCity,
        services: selectedServices.join(','),
        budget_max: (budget[1] * 100).toString(), // Convert to cents
      })

      // Add extras as language preferences if applicable
      const languageExtras = extras.includes('English speaker') ? ['english'] : []
      if (languageExtras.length > 0) {
        params.append('languages', languageExtras.join(','))
      }

      const response = await fetch(`/api/providers?${params}`)
      const data = await response.json()

      if (data.success && data.providers) {
        setMatches(data.providers)
      } else {
        // No providers found
        setMatches([])
      }
    } catch (error) {
      console.error('Error fetching providers:', error)
      // Show empty state on error
      setMatches([])
    } finally {
      setIsLoading(false)
    }
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
        ? 'El Poblado and Laureles are the most popular expat neighborhoods with the highest concentration of English-speaking helpers.'
        : 'Lagoa and Campeche have great options for beach-loving expats. Most helpers here speak some English.'
    }
    if (currentStep === 2) {
      return selectedServices.length > 0
        ? `Great choice! Bundling ${selectedServices.length} services usually saves 15-20% compared to booking separately.`
        : 'Pro tip: Combining cleaning + cooking is the most popular package among expats (saves ~$50/month).'
    }
    if (currentStep === 3) {
      return frequency === 'weekly'
        ? `Weekly service in ${selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'} averages $${budget[0]}-$${budget[1]}/month. Most expats start here.`
        : 'Bi-weekly service is perfect for minimalists. Consider adding a monthly deep clean for best results.'
    }
    return null
  }

  const _getPreview = () => {
    const serviceCount = selectedServices.length
    if (serviceCount === 0) return null

    const cityName = selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'
    return `Based on ${serviceCount} service${serviceCount > 1 ? 's' : ''} in ${cityName}: ~12 matches available`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-start gap-2">
                <h1 className="text-4xl font-bold text-teal-600 dark:text-teal-400">Explore</h1>
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="p-1 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-full transition-colors"
                    aria-label="More information about Explore"
                  >
                    <Info className="h-5 w-5 text-teal-500 dark:text-teal-400" />
                  </button>
                  {showTooltip && (
                    <div className="absolute left-0 top-8 w-64 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-teal-100 dark:border-teal-800 z-10">
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        Our interactive tool lets you explore home help options. Answer a few
                        questions for AI-matched recommendations—free previews, Premium for intros.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Discover & test matches for your expat setup
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/en/dashboard/quiz')}
              className="flex items-center gap-2 px-6 py-3 min-h-[44px] bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg font-medium hover:from-teal-700 hover:to-teal-800 focus:from-teal-700 focus:to-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              Quick Quiz
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Wizard Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              {/* Connected Stepper */}
              <ConnectedStepper
                currentStep={currentStep}
                totalSteps={3}
                labels={['Select City', 'Choose Services', 'Add Details']}
              />

              {/* Step Content */}
              <div className="min-h-[300px]">
                {/* Step 1: City Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Where are you based?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        onClick={() => setSelectedCity('medellin')}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className={`p-6 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                          selectedCity === 'medellin'
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <MapPin className="h-8 w-8 mb-2 text-teal-600 dark:text-teal-400 mx-auto" />
                        <h3 className="font-semibold text-lg dark:text-white">Medellín</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
                          El Poblado, Laureles, Envigado
                        </p>
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setSelectedCity('florianopolis')}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className={`p-6 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                          selectedCity === 'florianopolis'
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <Globe className="h-8 w-8 mb-2 text-teal-600 dark:text-teal-400 mx-auto" />
                        <h3 className="font-semibold text-lg dark:text-white">Florianópolis</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
                          Lagoa, Campeche, Centro
                        </p>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Step 2: Service Selection */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      What services do you need?
                    </h2>
                    {validationError && selectedServices.length === 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">
                          Please select at least one service to see tailored matches (e.g., English
                          speakers in your area)
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {SERVICES.map((service) => {
                        const Icon = service.icon
                        const isSelected = selectedServices.includes(service.id)
                        return (
                          <motion.button
                            type="button"
                            key={service.id}
                            onClick={() => handleServiceToggle(service.id)}
                            whileHover={{ y: -3, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            className={`p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                              isSelected
                                ? service.color === 'sunset'
                                  ? 'border-sunset-500 bg-sunset-50'
                                  : 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon
                              className={`h-6 w-6 mb-2 mx-auto ${
                                isSelected
                                  ? service.color === 'sunset'
                                    ? 'text-sunset-600'
                                    : 'text-teal-600'
                                  : 'text-gray-800'
                              }`}
                            />
                            <p
                              className={`text-sm font-medium ${
                                isSelected ? 'text-gray-900' : 'text-gray-700'
                              }`}
                            >
                              {service.label}
                            </p>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Step 3: Details */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Customize your preferences
                    </h2>

                    {/* Frequency */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Service Frequency
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        {['weekly', 'bi-weekly', 'monthly'].map((freq) => (
                          <button
                            type="button"
                            key={freq}
                            onClick={() => setFrequency(freq)}
                            className={`px-4 py-2 min-h-[44px] rounded-lg border-2 capitalize transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                              frequency === freq
                                ? 'border-teal-500 bg-teal-50 text-teal-700'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
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
                          onChange={(e) => setBudget([budget[0], parseInt(e.target.value, 10)])}
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
                        {['English speaker', 'Pet-friendly', 'Vegan cooking', 'Eco-friendly'].map(
                          (extra) => (
                            <button
                              type="button"
                              key={extra}
                              onClick={() => handleExtraToggle(extra)}
                              className={`px-4 py-2 min-h-[40px] rounded-full text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                                extras.includes(extra)
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {extra}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                    currentStep === 1
                      ? 'border-gray-200 text-gray-700 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>

                {currentStep < 3 ? (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!canProceed() && currentStep === 2) {
                          setValidationError('Please select at least one service')
                          return
                        }
                        setValidationError(null)
                        setCurrentStep(currentStep + 1)
                      }}
                      className={`flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                        canProceed()
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    {currentStep === 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          setValidationError(null)
                          setCurrentStep(3)
                        }}
                        className="text-sm text-gray-800 hover:text-gray-800 underline focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded px-2 py-1"
                      >
                        Skip for now
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleFindMatches}
                    disabled={!canProceed() || isLoading}
                    className={`flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                      canProceed() && !isLoading
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-gray-200 text-gray-700 cursor-not-allowed'
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                Pro Tips
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-4">
                {getTips()}
              </p>

              {/* Dynamic Match Preview */}
              <AnimatePresence mode="wait">
                {selectedServices.length > 0 && (
                  <motion.div
                    key="match-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-orange-50 dark:from-teal-900/20 dark:to-orange-900/20 rounded-lg border border-teal-200 dark:border-teal-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          Available Matches
                        </span>
                      </div>
                      <motion.span
                        key={estimatedMatches}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                        className="text-2xl font-bold text-teal-600 dark:text-teal-400"
                      >
                        {estimatedMatches}
                      </motion.span>
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300">
                      Based on {selectedServices.length} service
                      {selectedServices.length > 1 ? 's' : ''} in{' '}
                      {selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'}
                      {extras.length > 0 &&
                        ` with ${extras.length} preference${extras.length > 1 ? 's' : ''}`}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                  Popular in {selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'}:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Cleaning + Cooking</span>
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">68%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Weekly service</span>
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">71%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">English speaker</span>
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">45%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 max-w-2xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="h-12 w-12 rounded-full bg-teal-200 opacity-30" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Finding your perfect matches...
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Analyzing {selectedServices.length} service
                    {selectedServices.length > 1 ? 's' : ''} in{' '}
                    {selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'}
                  </p>
                  <motion.div
                    className="flex justify-center gap-1 pt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.span
                      className="h-2 w-2 bg-teal-600 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="h-2 w-2 bg-teal-600 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span
                      className="h-2 w-2 bg-teal-600 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {!isLoading && matches.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Matches</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match, index) => (
                <div
                  key={match.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]"
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
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {match.name}
                        </h3>
                        {match.verified && <Check className="h-4 w-4 text-teal-600" />}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{match.location}</p>
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

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{match.bio}</p>

                  {/* Review Snippet */}
                  {match.review && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg mb-3 border-l-4 border-teal-500 dark:border-teal-400">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{match.review.text}"
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                          — {match.review.author}
                        </span>
                        <div className="flex gap-0.5">
                          {[...Array(match.review.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-sunset-500 fill-sunset-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mb-4">
                    {match.specialties.slice(0, 3).map((specialty: string) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="w-full py-2 min-h-[44px] text-teal-600 font-medium hover:bg-teal-50 focus:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset rounded-lg transition-all"
                  >
                    View Profile →
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-700 mb-4">
                Want unlimited matches and direct intros?
              </p>
              <button
                type="button"
                className="px-6 py-3 min-h-[48px] bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 focus:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        ) : (
          /* Empty State */
          currentStep === 3 &&
          !isLoading &&
          matches.length === 0 && (
            <div className="mt-8">
              <div className="bg-white rounded-xl shadow-md p-8 md:p-12 max-w-4xl mx-auto">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <Search className="h-16 w-16 text-gray-300" />
                    <motion.div
                      className="absolute -right-2 -top-2"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Sparkles className="h-6 w-6 text-sunset-400" />
                    </motion.div>
                  </div>

                  <div className="space-y-3 max-w-3xl">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {selectedServices.length === 0
                        ? 'Pick services to see matches'
                        : 'Building your matches...'}
                    </h3>
                    <p className="text-gray-800 leading-relaxed text-base">
                      {selectedServices.length === 0
                        ? 'Select at least one service above to discover available home helpers in your area.'
                        : `We're expanding our network in ${selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'}. Try adjusting your preferences or check back soon for more options!`}
                    </p>
                  </div>

                  {/* Suggestion Bubbles */}
                  {selectedServices.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="inline-flex items-center px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                        Try: Weekly cleaning only (15 matches)
                      </span>
                      <span className="inline-flex items-center px-3 py-1.5 bg-sunset-50 text-sunset-700 rounded-full text-sm font-medium">
                        Remove: English speaker (+8 matches)
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(2)
                        setSelectedServices([])
                        setExtras([])
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 focus:from-teal-700 focus:to-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Adjust Preferences
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/en/dashboard/quiz')}
                      className="flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
                    >
                      <Sparkles className="h-4 w-4" />
                      Take Full Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
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
