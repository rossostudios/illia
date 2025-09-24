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

    if (selectedServices.includes('cleaning')) {
      baseMatches += 8
    }
    if (selectedServices.includes('cooking')) {
      baseMatches += 6
    }
    if (selectedServices.includes('deep-clean')) {
      baseMatches += 3
    }
    if (selectedServices.includes('meal-prep')) {
      baseMatches += 4
    }

    if (extras.includes('English speaker')) {
      baseMatches = Math.floor(baseMatches * 0.6)
    }
    if (extras.includes('Pet-friendly')) {
      baseMatches = Math.floor(baseMatches * 0.8)
    }

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
    } catch (_error) {
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
    if (serviceCount === 0) {
      return null
    }

    const cityName = selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'
    return `Based on ${serviceCount} service${serviceCount > 1 ? 's' : ''} in ${cityName}: ~12 matches available`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-start gap-2">
                <h1 className="font-bold text-4xl text-teal-600 dark:text-teal-400">Explore</h1>
                <div className="relative">
                  <button
                    aria-label="More information about Explore"
                    className="rounded-full p-1 transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/20"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <Info className="h-5 w-5 text-teal-500 dark:text-teal-400" />
                  </button>
                  {showTooltip && (
                    <div className="absolute top-8 left-0 z-10 w-64 rounded-lg border border-teal-100 bg-white p-3 shadow-lg dark:border-teal-800 dark:bg-gray-900">
                      <p className="font-medium text-gray-700 text-sm dark:text-gray-300">
                        Our interactive tool lets you explore home help options. Answer a few
                        questions for AI-matched recommendations—free previews, Premium for intros.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Discover & test matches for your expat setup
              </p>
            </div>
            <button
              className="flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-3 font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-800 focus:from-teal-700 focus:to-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              onClick={() => router.push('/en/dashboard/quiz')}
            >
              <Sparkles className="h-4 w-4" />
              Quick Quiz
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Wizard Card */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white p-8 shadow-md dark:bg-gray-900">
              {/* Connected Stepper */}
              <ConnectedStepper
                currentStep={currentStep}
                labels={['Select City', 'Choose Services', 'Add Details']}
                totalSteps={3}
              />

              {/* Step Content */}
              <div className="min-h-[300px]">
                {/* Step 1: City Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="mb-4 font-semibold text-gray-900 text-xl dark:text-white">
                      Where are you based?
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <motion.button
                        className={`rounded-lg border-2 p-6 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                          selectedCity === 'medellin'
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setSelectedCity('medellin')}
                        transition={{ type: 'spring', stiffness: 300 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MapPin className="mx-auto mb-2 h-8 w-8 text-teal-600 dark:text-teal-400" />
                        <h3 className="font-semibold text-lg dark:text-white">Medellín</h3>
                        <p className="mt-1 font-medium text-gray-600 text-sm dark:text-gray-400">
                          El Poblado, Laureles, Envigado
                        </p>
                      </motion.button>
                      <motion.button
                        className={`rounded-lg border-2 p-6 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                          selectedCity === 'florianopolis'
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setSelectedCity('florianopolis')}
                        transition={{ type: 'spring', stiffness: 300 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Globe className="mx-auto mb-2 h-8 w-8 text-teal-600 dark:text-teal-400" />
                        <h3 className="font-semibold text-lg dark:text-white">Florianópolis</h3>
                        <p className="mt-1 font-medium text-gray-600 text-sm dark:text-gray-400">
                          Lagoa, Campeche, Centro
                        </p>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Step 2: Service Selection */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h2 className="mb-4 font-semibold text-gray-900 text-xl dark:text-white">
                      What services do you need?
                    </h2>
                    {validationError && selectedServices.length === 0 && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <p className="text-red-700 text-sm">
                          Please select at least one service to see tailored matches (e.g., English
                          speakers in your area)
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {SERVICES.map((service) => {
                        const Icon = service.icon
                        const isSelected = selectedServices.includes(service.id)
                        return (
                          <motion.button
                            animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
                            className={`rounded-lg border-2 p-4 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                              isSelected
                                ? service.color === 'sunset'
                                  ? 'border-sunset-500 bg-sunset-50'
                                  : 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            key={service.id}
                            onClick={() => handleServiceToggle(service.id)}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            whileHover={{ y: -3, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon
                              className={`mx-auto mb-2 h-6 w-6 ${
                                isSelected
                                  ? service.color === 'sunset'
                                    ? 'text-sunset-600'
                                    : 'text-teal-600'
                                  : 'text-gray-800'
                              }`}
                            />
                            <p
                              className={`font-medium text-sm ${
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
                    <h2 className="mb-4 font-semibold text-gray-900 text-xl dark:text-white">
                      Customize your preferences
                    </h2>

                    {/* Frequency */}
                    <div>
                      <label className="mb-2 block font-medium text-gray-700 text-sm">
                        Service Frequency
                      </label>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        {['weekly', 'bi-weekly', 'monthly'].map((freq) => (
                          <button
                            className={`min-h-[44px] rounded-lg border-2 px-4 py-2 capitalize transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                              frequency === freq
                                ? 'border-teal-500 bg-teal-50 text-teal-700'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                            key={freq}
                            onClick={() => setFrequency(freq)}
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget Range */}
                    <div>
                      <label className="mb-2 block font-medium text-gray-700 text-sm">
                        Monthly Budget: ${budget[0]} - ${budget[1]}
                      </label>
                      <div className="px-3">
                        <input
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-teal-600"
                          max="500"
                          min="100"
                          onChange={(e) =>
                            setBudget([budget[0], Number.parseInt(e.target.value, 10)])
                          }
                          type="range"
                          value={budget[1]}
                        />
                      </div>
                    </div>

                    {/* Extras */}
                    <div>
                      <label className="mb-2 block font-medium text-gray-700 text-sm">
                        Special Requirements
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['English speaker', 'Pet-friendly', 'Vegan cooking', 'Eco-friendly'].map(
                          (extra) => (
                            <button
                              className={`min-h-[40px] rounded-full px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                                extras.includes(extra)
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              key={extra}
                              onClick={() => handleExtraToggle(extra)}
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
              <div className="mt-8 flex justify-between border-t pt-6">
                <button
                  className={`flex min-h-[44px] items-center gap-2 rounded-lg border px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                    currentStep === 1
                      ? 'cursor-not-allowed border-gray-200 text-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>

                {currentStep < 3 ? (
                  <div className="flex items-center gap-3">
                    <button
                      className={`flex min-h-[44px] items-center gap-2 rounded-lg px-6 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                        canProceed()
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                      onClick={() => {
                        if (!canProceed() && currentStep === 2) {
                          setValidationError('Please select at least one service')
                          return
                        }
                        setValidationError(null)
                        setCurrentStep(currentStep + 1)
                      }}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    {currentStep === 2 && (
                      <button
                        className="rounded px-2 py-1 text-gray-800 text-sm underline hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        onClick={() => {
                          setValidationError(null)
                          setCurrentStep(3)
                        }}
                      >
                        Skip for now
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    className={`flex min-h-[44px] items-center gap-2 rounded-lg px-6 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                      canProceed() && !isLoading
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'cursor-not-allowed bg-gray-200 text-gray-700'
                    }`}
                    disabled={!canProceed() || isLoading}
                    onClick={handleFindMatches}
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
            <div className="sticky top-8 rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Heart className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                Pro Tips
              </h3>
              <p className="mb-4 font-medium text-gray-700 text-sm dark:text-gray-300">
                {getTips()}
              </p>

              {/* Dynamic Match Preview */}
              <AnimatePresence mode="wait">
                {selectedServices.length > 0 && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-lg border border-teal-200 bg-gradient-to-r from-teal-50 to-orange-50 p-4 dark:border-teal-800 dark:from-teal-900/20 dark:to-orange-900/20"
                    exit={{ opacity: 0, y: -10 }}
                    initial={{ opacity: 0, y: 10 }}
                    key="match-preview"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        <span className="font-semibold text-gray-900 text-sm dark:text-white">
                          Available Matches
                        </span>
                      </div>
                      <motion.span
                        animate={{ scale: 1, opacity: 1 }}
                        className="font-bold text-2xl text-teal-600 dark:text-teal-400"
                        initial={{ scale: 0.5, opacity: 0 }}
                        key={estimatedMatches}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        {estimatedMatches}
                      </motion.span>
                    </div>
                    <div className="text-gray-700 text-xs dark:text-gray-300">
                      Based on {selectedServices.length} service
                      {selectedServices.length > 1 ? 's' : ''} in{' '}
                      {selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'}
                      {extras.length > 0 &&
                        ` with ${extras.length} preference${extras.length > 1 ? 's' : ''}`}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 border-gray-100 border-t pt-6 dark:border-gray-700">
                <p className="mb-2 text-gray-700 text-xs dark:text-gray-300">
                  Popular in {selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'}:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Cleaning + Cooking</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">68%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Weekly service</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">71%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">English speaker</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">45%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8">
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-12 shadow-md dark:bg-gray-900">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    className="absolute inset-0"
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <div className="h-12 w-12 rounded-full bg-teal-200 opacity-30" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-xl dark:text-white">
                    Finding your perfect matches...
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Analyzing {selectedServices.length} service
                    {selectedServices.length > 1 ? 's' : ''} in{' '}
                    {selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'}
                  </p>
                  <motion.div
                    animate={{ opacity: 1 }}
                    className="flex justify-center gap-1 pt-2"
                    initial={{ opacity: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.span
                      animate={{ y: [0, -8, 0] }}
                      className="h-2 w-2 rounded-full bg-teal-600"
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                    />
                    <motion.span
                      animate={{ y: [0, -8, 0] }}
                      className="h-2 w-2 rounded-full bg-teal-600"
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                    />
                    <motion.span
                      animate={{ y: [0, -8, 0] }}
                      className="h-2 w-2 rounded-full bg-teal-600"
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
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
            <h2 className="mb-6 font-bold text-2xl text-gray-900">Your Matches</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((match, index) => (
                <div
                  className="animate-[fadeIn_0.5s_ease-in-out_forwards] rounded-xl bg-white p-6 opacity-0 shadow-md dark:bg-gray-900"
                  key={match.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mb-4 flex items-start gap-4">
                    <img
                      alt={match.name}
                      className="h-16 w-16 rounded-full object-cover"
                      src={match.photo}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {match.name}
                        </h3>
                        {match.verified && <Check className="h-4 w-4 text-teal-600" />}
                      </div>
                      <p className="text-gray-600 text-sm dark:text-gray-400">{match.location}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-sunset-500 text-sunset-500" />
                        <span className="font-medium text-sm">{match.rate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 rounded-full bg-sunset-50 px-2 py-1">
                        <span className="font-bold text-lg text-sunset-600">{match.score}</span>
                        <span className="text-sunset-600 text-xs">/100</span>
                      </div>
                    </div>
                  </div>

                  <p className="mb-3 text-gray-600 text-sm dark:text-gray-400">{match.bio}</p>

                  {/* Review Snippet */}
                  {match.review && (
                    <div className="mb-3 rounded-lg border-teal-500 border-l-4 bg-gray-50 p-3 dark:border-teal-400 dark:bg-gray-900/50">
                      <p className="text-gray-700 text-sm italic dark:text-gray-300">
                        "{match.review.text}"
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-medium text-gray-600 text-xs dark:text-gray-400">
                          — {match.review.author}
                        </span>
                        <div className="flex gap-0.5">
                          {[...new Array(match.review.rating)].map((_, i) => (
                            <Star className="h-3 w-3 fill-sunset-500 text-sunset-500" key={i} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4 flex flex-wrap gap-1">
                    {match.specialties.slice(0, 3).map((specialty: string) => (
                      <span
                        className="rounded-full bg-teal-50 px-2 py-1 text-teal-700 text-xs dark:bg-teal-900/30 dark:text-teal-300"
                        key={specialty}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <button className="min-h-[44px] w-full rounded-lg py-2 font-medium text-teal-600 transition-all hover:bg-teal-50 focus:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset">
                    View Profile →
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="mb-4 text-gray-700 text-sm">
                Want unlimited matches and direct intros?
              </p>
              <button className="min-h-[48px] rounded-lg bg-teal-600 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg focus:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
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
              <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-md md:p-12">
                <div className="flex flex-col items-center space-y-6 text-center">
                  <div className="relative">
                    <Search className="h-16 w-16 text-gray-300" />
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      className="-right-2 -top-2 absolute"
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                    >
                      <Sparkles className="h-6 w-6 text-sunset-400" />
                    </motion.div>
                  </div>

                  <div className="max-w-3xl space-y-3">
                    <h3 className="font-semibold text-2xl text-gray-900">
                      {selectedServices.length === 0
                        ? 'Pick services to see matches'
                        : 'Building your matches...'}
                    </h3>
                    <p className="text-base text-gray-800 leading-relaxed">
                      {selectedServices.length === 0
                        ? 'Select at least one service above to discover available home helpers in your area.'
                        : `We're expanding our network in ${selectedCity === 'medellin' ? 'Medellín' : 'Florianópolis'}. Try adjusting your preferences or check back soon for more options!`}
                    </p>
                  </div>

                  {/* Suggestion Bubbles */}
                  {selectedServices.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1.5 font-medium text-sm text-teal-700">
                        Try: Weekly cleaning only (15 matches)
                      </span>
                      <span className="inline-flex items-center rounded-full bg-sunset-50 px-3 py-1.5 font-medium text-sm text-sunset-700">
                        Remove: English speaker (+8 matches)
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                    <button
                      className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-3 text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-800 hover:shadow-lg focus:from-teal-700 focus:to-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      onClick={() => {
                        setCurrentStep(2)
                        setSelectedServices([])
                        setExtras([])
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Adjust Preferences
                    </button>
                    <button
                      className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-all hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      onClick={() => router.push('/en/dashboard/quiz')}
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
