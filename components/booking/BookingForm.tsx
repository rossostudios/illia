'use client'

import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  User,
  Video,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useSessionContext } from '@/components/SessionProvider'
import { createClient } from '@/lib/supabase/client'
import BookingCalendar from './BookingCalendar'

type TimeSlot = {
  id: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

type Provider = {
  id: string
  name: string
  email?: string
  phone?: string
  whatsapp?: string
  photo_url?: string
  services: string[]
  languages: string[]
  rate_hourly?: number
  rate_monthly?: number
  specialties?: string[]
  address?: string
  city?: string
  neighborhood?: string
}

type BookingFormProps = {
  provider: Provider
  preselectedService?: string
  onSuccess?: (bookingId: string) => void
  onCancel?: () => void
}

const serviceOptions = {
  cleaning: { label: 'Home Cleaning', icon: Home, duration: 120 },
  cooking: { label: 'Cooking Service', icon: User, duration: 90 },
  'meal-prep': { label: 'Meal Prep', icon: FileText, duration: 120 },
  'deep-cleaning': { label: 'Deep Cleaning', icon: RefreshCw, duration: 180 },
  laundry: { label: 'Laundry Service', icon: Home, duration: 60 },
  organizing: { label: 'Home Organization', icon: Home, duration: 120 },
}

const locationTypes = {
  user_address: { label: 'My Address', icon: Home },
  provider_address: { label: "Provider's Location", icon: MapPin },
  virtual: { label: 'Virtual/Online', icon: Video },
}

export default function BookingForm({
  provider,
  preselectedService,
  onSuccess,
  onCancel,
}: BookingFormProps) {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const { user } = useSessionContext()
  const supabase = createClient()

  // Form state
  const [selectedServices, setSelectedServices] = useState<string[]>(
    preselectedService ? [preselectedService] : []
  )
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [locationType, setLocationType] = useState<keyof typeof locationTypes>('user_address')
  const [userAddress, setUserAddress] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringPattern, setRecurringPattern] = useState({
    type: 'weekly',
    interval: 1,
    endDate: '',
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const formSubmittedRef = useRef(false)

  // Calculate total duration and price
  const totalDuration = selectedServices.reduce((total, service) => {
    const serviceOption = serviceOptions[service as keyof typeof serviceOptions]
    return total + (serviceOption?.duration || 60)
  }, 0)

  const hourlyRate = provider.rate_hourly || 0
  const totalPrice = (hourlyRate * totalDuration) / 60

  // Track form changes
  useEffect(() => {
    const hasFormData =
      selectedServices.length > 0 ||
      selectedSlot !== null ||
      userAddress.trim() !== '' ||
      specialInstructions.trim() !== ''

    setHasUnsavedChanges(hasFormData && !formSubmittedRef.current)
  }, [selectedServices, selectedSlot, userAddress, specialInstructions])

  // Handle beforeunload event
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !formSubmittedRef.current) {
        const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?'
        e.returnValue = confirmationMessage
        return confirmationMessage
      }
    },
    [hasUnsavedChanges]
  )

  // Add and remove beforeunload listener
  useEffect(() => {
    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }
  }, [hasUnsavedChanges, handleBeforeUnload])

  // Handle navigation away
  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges && !formSubmittedRef.current) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel your booking?'
      )
      if (!confirmed) {
        return
      }
    }
    onCancel?.()
  }, [hasUnsavedChanges, onCancel])

  const handleServiceToggle = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service))
    } else {
      setSelectedServices([...selectedServices, service])
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to book a service', {
        description: 'Authentication required',
      })
      router.push(`/${locale}/login`)
      return
    }

    if (!selectedSlot || selectedServices.length === 0) {
      toast.error('Please select services and a time slot', {
        description: 'Incomplete booking',
      })
      return
    }

    if (locationType === 'user_address' && !userAddress.trim()) {
      toast.error('Please provide your address for the service', {
        description: 'Address required',
      })
      return
    }

    if (!agreeToTerms) {
      toast.error('Please agree to the terms and conditions', {
        description: 'Terms acceptance required',
      })
      return
    }

    setLoading(true)

    try {
      // Create the booking
      const bookingData = {
        user_id: user.id,
        provider_id: provider.id,
        service_type: selectedServices,
        booking_date: selectedSlot.date,
        start_time: selectedSlot.startTime,
        end_time: selectedSlot.endTime,
        duration_minutes: totalDuration,
        status: 'pending',
        hourly_rate: hourlyRate,
        total_amount: Math.round(totalPrice * 100), // Convert to cents
        currency: 'USD',
        is_recurring: isRecurring,
        recurring_pattern: isRecurring ? recurringPattern : null,
        special_instructions: specialInstructions || null,
        location_details: {
          type: locationType,
          address: locationType === 'user_address' ? userAddress : provider.address,
          city: provider.city,
          neighborhood: provider.neighborhood,
        },
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Create service agreement record
      if (agreeToTerms) {
        await supabase.from('service_agreements').insert({
          booking_id: booking.id,
          agreement_text: generateAgreementText(),
          version: '1.0',
          accepted_by: user.id,
          accepted_at: new Date().toISOString(),
        })
      }

      // Send confirmation message to provider
      await sendBookingNotification(booking.id)

      toast.success('Booking created!', {
        description: 'Your booking request has been sent to the provider',
      })

      // Mark form as submitted to prevent unsaved changes warning
      formSubmittedRef.current = true

      onSuccess?.(booking.id)

      // Redirect to bookings page
      setTimeout(() => {
        router.push(`/${locale}/dashboard/bookings`)
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking', {
        description: 'Booking failed',
      })
    } finally {
      setLoading(false)
    }
  }

  const sendBookingNotification = async (_bookingId: string) => {
    try {
      // Create a new conversation
      const { data: conversation } = await supabase
        .from('conversations')
        .insert({
          created_at: new Date().toISOString(),
          metadata: { type: 'booking' },
        })
        .select()
        .single()

      if (conversation && user) {
        // Add participants to conversation
        await supabase.from('conversation_participants').insert([
          {
            conversation_id: conversation.id,
            user_id: user.id,
            joined_at: new Date().toISOString(),
          },
          {
            conversation_id: conversation.id,
            user_id: provider.id,
            joined_at: new Date().toISOString(),
          },
        ])

        // Send booking notification message
        const message = `🗓️ New Booking Request\n\nServices: ${selectedServices
          .map((s) => serviceOptions[s as keyof typeof serviceOptions]?.label)
          .join(', ')}\nDate: ${selectedSlot?.date}\nTime: ${selectedSlot?.startTime} - ${
          selectedSlot?.endTime
        }\nDuration: ${totalDuration} minutes\n\nPlease confirm or contact the client for any questions.`

        await supabase.from('direct_messages').insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          receiver_id: provider.id,
          message,
          message_type: 'text',
          created_at: new Date().toISOString(),
        })
      }
    } catch (_error) {
      // Error handled silently
    }
  }

  const generateAgreementText = () => `Service Agreement

This agreement is between ${user?.email} (Client) and ${provider.name} (Provider).

Services to be provided: ${selectedServices
    .map((s) => serviceOptions[s as keyof typeof serviceOptions]?.label)
    .join(', ')}
Date and Time: ${selectedSlot?.date} from ${selectedSlot?.startTime} to ${selectedSlot?.endTime}
Duration: ${totalDuration} minutes
Total Cost: $${totalPrice.toFixed(2)} USD

Cancellation Policy:
- Cancellations made 24+ hours in advance: No charge
- Cancellations made less than 24 hours: 50% charge
- No-show: 100% charge

Both parties agree to the terms stated above.`

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
              Select Services
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {provider.services.map((service) => {
                const serviceOption = serviceOptions[service as keyof typeof serviceOptions]
                if (!serviceOption) {
                  return null
                }

                const Icon = serviceOption.icon
                const isSelected = selectedServices.includes(service)

                return (
                  <button
                    className={`rounded-lg border-2 p-4 text-left transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                        : 'border-gray-200 hover:border-teal-300 dark:border-gray-700 dark:hover:border-teal-700'
                    }
                    `}
                    key={service}
                    onClick={() => handleServiceToggle(service)}
                    type="button"
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`mt-0.5 h-5 w-5 ${
                          isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {serviceOption.label}
                        </p>
                        <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                          Duration: {serviceOption.duration} min
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {selectedServices.length > 0 && (
              <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-blue-900 text-sm dark:text-blue-100">
                  Total duration: {totalDuration} minutes | Estimated cost: ${totalPrice.toFixed(2)}{' '}
                  USD
                </p>
              </div>
            )}
          </>
        )

      case 2:
        return (
          <>
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
              Select Date & Time
            </h3>
            <BookingCalendar
              duration={totalDuration}
              onSlotSelect={setSelectedSlot}
              providerId={provider.id}
              providerName={provider.name}
              selectedSlot={selectedSlot || undefined}
            />

            {/* Recurring Booking Option */}
            <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <label className="flex items-start gap-3">
                <input
                  checked={isRecurring}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:focus:ring-teal-400"
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  type="checkbox"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Make this a recurring booking
                  </span>
                  <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                    Schedule this service on a regular basis
                  </p>
                </div>
              </label>

              {isRecurring && (
                <div className="mt-3 space-y-3 pl-7">
                  <div>
                    <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                      Repeat
                    </label>
                    <select
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                      onChange={(e) =>
                        setRecurringPattern({ ...recurringPattern, type: e.target.value })
                      }
                      value={recurringPattern.type}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Every 2 weeks</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                      End date
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                      min={selectedSlot?.date}
                      onChange={(e) =>
                        setRecurringPattern({ ...recurringPattern, endDate: e.target.value })
                      }
                      type="date"
                      value={recurringPattern.endDate}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )

      case 3:
        return (
          <>
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
              Location & Instructions
            </h3>

            {/* Location Type */}
            <div className="space-y-3">
              <label className="block font-medium text-gray-700 text-sm dark:text-gray-300">
                Service Location
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Object.entries(locationTypes).map(([key, option]) => {
                  const Icon = option.icon
                  const isSelected = locationType === key

                  return (
                    <button
                      className={`rounded-lg border-2 p-3 transition-all ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                          : 'border-gray-200 hover:border-teal-300 dark:border-gray-700 dark:hover:border-teal-700'
                      }
                      `}
                      key={key}
                      onClick={() => setLocationType(key as keyof typeof locationTypes)}
                      type="button"
                    >
                      <Icon
                        className={`mx-auto mb-1 h-5 w-5 ${
                          isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'
                        }`}
                      />
                      <p className="font-medium text-gray-900 text-sm dark:text-white">
                        {option.label}
                      </p>
                    </button>
                  )
                })}
              </div>

              {locationType === 'user_address' && (
                <div>
                  <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                    Your Address
                    <span className="ml-0.5 text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                    onChange={(e) => setUserAddress(e.target.value)}
                    placeholder="Enter your complete address..."
                    rows={2}
                    value={userAddress}
                  />
                </div>
              )}

              {locationType === 'provider_address' && provider.address && (
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    <MapPin className="mr-1 inline h-4 w-4" />
                    Service will be provided at: {provider.address}
                  </p>
                </div>
              )}

              {locationType === 'virtual' && (
                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                  <p className="text-blue-900 text-sm dark:text-blue-100">
                    <Video className="mr-1 inline h-4 w-4" />A video link will be shared before the
                    appointment
                  </p>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="mt-4">
              <label className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300">
                Special Instructions (Optional)
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests or instructions for the provider..."
                rows={3}
                value={specialInstructions}
              />
            </div>

            {/* Contact Information */}
            <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <h4 className="mb-3 font-medium text-gray-900 text-sm dark:text-white">
                Provider Contact
              </h4>
              <div className="space-y-2">
                {provider.phone && (
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    <Phone className="mr-2 inline h-4 w-4" />
                    {provider.phone}
                  </p>
                )}
                {provider.whatsapp && (
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    <MessageSquare className="mr-2 inline h-4 w-4" />
                    WhatsApp: {provider.whatsapp}
                  </p>
                )}
              </div>
            </div>
          </>
        )

      case 4:
        return (
          <>
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
              Review & Confirm
            </h3>

            {/* Booking Summary */}
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <h4 className="mb-3 font-medium text-gray-900 dark:text-white">Booking Summary</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600 text-sm dark:text-gray-400">Provider:</dt>
                    <dd className="font-medium text-gray-900 text-sm dark:text-white">
                      {provider.name}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 text-sm dark:text-gray-400">Services:</dt>
                    <dd className="text-right font-medium text-gray-900 text-sm dark:text-white">
                      {selectedServices
                        .map((s) => serviceOptions[s as keyof typeof serviceOptions]?.label)
                        .join(', ')}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 text-sm dark:text-gray-400">Date:</dt>
                    <dd className="font-medium text-gray-900 text-sm dark:text-white">
                      {selectedSlot?.date}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 text-sm dark:text-gray-400">Time:</dt>
                    <dd className="font-medium text-gray-900 text-sm dark:text-white">
                      {selectedSlot?.startTime} - {selectedSlot?.endTime}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 text-sm dark:text-gray-400">Duration:</dt>
                    <dd className="font-medium text-gray-900 text-sm dark:text-white">
                      {totalDuration} minutes
                    </dd>
                  </div>
                  {isRecurring && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600 text-sm dark:text-gray-400">Recurring:</dt>
                      <dd className="font-medium text-gray-900 text-sm dark:text-white">
                        {recurringPattern.type} until {recurringPattern.endDate}
                      </dd>
                    </div>
                  )}
                  <div className="mt-2 border-t pt-2 dark:border-gray-800">
                    <div className="flex justify-between">
                      <dt className="font-medium text-gray-900 dark:text-white">Total:</dt>
                      <dd className="font-semibold text-lg text-teal-600 dark:text-teal-400">
                        ${totalPrice.toFixed(2)} USD
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>

              {/* Cancellation Policy */}
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <div className="flex gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <h4 className="mb-1 font-medium text-sm text-yellow-900 dark:text-yellow-100">
                      Cancellation Policy
                    </h4>
                    <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                      <li>• 24+ hours notice: No charge</li>
                      <li>• Less than 24 hours: 50% charge</li>
                      <li>• No-show: 100% charge</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <label className="flex items-start gap-3">
                  <input
                    checked={agreeToTerms}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:focus:ring-teal-400"
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    type="checkbox"
                  />
                  <div className="flex-1">
                    <span className="text-gray-900 text-sm dark:text-white">
                      I agree to the terms and conditions and cancellation policy
                    </span>
                    <p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
                      By booking, you agree to the service agreement and provider's terms
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  // Announce step changes to screen readers
  useEffect(() => {
    const stepLabels = [
      'Select Services',
      'Select Date & Time',
      'Location & Instructions',
      'Review & Confirm',
    ]
    const announcement = `Step ${step} of 4: ${stepLabels[step - 1]}`

    // Create and announce live region content
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    liveRegion.textContent = announcement
    document.body.appendChild(liveRegion)

    // Clean up after announcement
    const timer = setTimeout(() => {
      document.body.removeChild(liveRegion)
    }, 1000)

    return () => {
      clearTimeout(timer)
      if (document.body.contains(liveRegion)) {
        document.body.removeChild(liveRegion)
      }
    }
  }, [step])

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Progress Steps */}
      <div
        aria-label="Booking progress"
        className="border-gray-200 border-b p-4 dark:border-gray-700"
        role="navigation"
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          {[1, 2, 3, 4].map((stepNumber) => {
            const stepLabels = [
              'Select Services',
              'Select Date & Time',
              'Location & Instructions',
              'Review & Confirm',
            ]
            const isCurrentStep = step === stepNumber
            const isCompleted = step > stepNumber

            return (
              <div
                className={`flex items-center ${stepNumber < 4 ? 'flex-1' : ''}`}
                key={stepNumber}
              >
                <div
                  aria-current={isCurrentStep ? 'step' : undefined}
                  aria-label={`${stepLabels[stepNumber - 1]}${isCompleted ? ' - Completed' : isCurrentStep ? ' - Current Step' : ''}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm ${
                    step >= stepNumber
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }
                  `}
                  role="listitem"
                >
                  {isCompleted ? (
                    <CheckCircle aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < 4 && (
                  <div
                    aria-hidden="true"
                    className={`mx-2 h-1 flex-1 ${
                      step > stepNumber ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
        <div className="mx-auto mt-2 flex max-w-3xl justify-between">
          <span className="text-gray-500 text-xs dark:text-gray-400">Services</span>
          <span className="text-gray-500 text-xs dark:text-gray-400">Date & Time</span>
          <span className="text-gray-500 text-xs dark:text-gray-400">Details</span>
          <span className="text-gray-500 text-xs dark:text-gray-400">Confirm</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">{renderStep()}</div>

      {/* Form Actions */}
      <div className="flex justify-between border-gray-200 border-t px-6 py-4 dark:border-gray-700">
        {step > 1 ? (
          <button
            className="px-4 py-2 text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            onClick={() => setStep(step - 1)}
            type="button"
          >
            Back
          </button>
        ) : (
          <button
            className="px-4 py-2 text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>
        )}

        {step < 4 ? (
          <button
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2 text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={
              (step === 1 && selectedServices.length === 0) ||
              (step === 2 && !selectedSlot) ||
              (step === 3 && locationType === 'user_address' && !userAddress.trim())
            }
            onClick={() => setStep(step + 1)}
            type="button"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2 text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!agreeToTerms || loading}
            onClick={handleSubmit}
            type="button"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-white border-b-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Confirm Booking
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
