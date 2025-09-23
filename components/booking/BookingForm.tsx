'use client'

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
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
import { useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import { useToast } from '@/hooks/useToast'
import { createClient } from '@/lib/supabase/client'
import BookingCalendar from './BookingCalendar'

interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface Provider {
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

interface BookingFormProps {
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
  const { success, error: showError } = useToast()
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

  // Calculate total duration and price
  const totalDuration = selectedServices.reduce((total, service) => {
    const serviceOption = serviceOptions[service as keyof typeof serviceOptions]
    return total + (serviceOption?.duration || 60)
  }, 0)

  const hourlyRate = provider.rate_hourly || 0
  const totalPrice = (hourlyRate * totalDuration) / 60

  const handleServiceToggle = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service))
    } else {
      setSelectedServices([...selectedServices, service])
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      showError('Authentication required', 'Please log in to book a service')
      router.push(`/${locale}/login`)
      return
    }

    if (!selectedSlot || selectedServices.length === 0) {
      showError('Incomplete booking', 'Please select services and a time slot')
      return
    }

    if (locationType === 'user_address' && !userAddress.trim()) {
      showError('Address required', 'Please provide your address for the service')
      return
    }

    if (!agreeToTerms) {
      showError('Terms required', 'Please agree to the terms and conditions')
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

      if (error) throw error

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

      success('Booking created!', 'Your booking request has been sent to the provider')
      onSuccess?.(booking.id)

      // Redirect to bookings page
      setTimeout(() => {
        router.push(`/${locale}/dashboard/bookings`)
      }, 2000)
    } catch (error: any) {
      console.error('Booking error:', error)
      showError('Booking failed', error.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const sendBookingNotification = async (bookingId: string) => {
    try {
      // Get or create conversation with provider
      const { data: conversation } = await supabase.rpc('get_or_create_conversation', {
        user1_id: user?.id,
        user2_id: provider.id,
      })

      if (conversation) {
        // Send booking notification message
        const message = `🗓️ New Booking Request\n\nServices: ${selectedServices
          .map((s) => serviceOptions[s as keyof typeof serviceOptions]?.label)
          .join(', ')}\nDate: ${selectedSlot?.date}\nTime: ${selectedSlot?.startTime} - ${
          selectedSlot?.endTime
        }\nDuration: ${totalDuration} minutes\n\nPlease confirm or contact the client for any questions.`

        await supabase.rpc('send_message', {
          p_sender_id: user?.id,
          p_receiver_id: provider.id,
          p_message: message,
          p_message_type: 'text',
        })
      }
    } catch (error) {
      console.error('Failed to send booking notification:', error)
    }
  }

  const generateAgreementText = () => {
    return `Service Agreement

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
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Services
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {provider.services.map((service) => {
                const serviceOption = serviceOptions[service as keyof typeof serviceOptions]
                if (!serviceOption) return null

                const Icon = serviceOption.icon
                const isSelected = selectedServices.includes(service)

                return (
                  <button
                    key={service}
                    onClick={() => handleServiceToggle(service)}
                    className={`
                      p-4 rounded-lg border-2 transition-all text-left
                      ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`h-5 w-5 mt-0.5 ${
                          isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {serviceOption.label}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Date & Time
            </h3>
            <BookingCalendar
              providerId={provider.id}
              providerName={provider.name}
              onSlotSelect={setSelectedSlot}
              selectedSlot={selectedSlot || undefined}
              duration={totalDuration}
            />

            {/* Recurring Booking Option */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="mt-1 h-4 w-4 text-teal-600 border-gray-300 dark:border-gray-600 rounded focus:ring-teal-500 dark:focus:ring-teal-400"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Make this a recurring booking
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Schedule this service on a regular basis
                  </p>
                </div>
              </label>

              {isRecurring && (
                <div className="mt-3 pl-7 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Repeat
                    </label>
                    <select
                      value={recurringPattern.type}
                      onChange={(e) =>
                        setRecurringPattern({ ...recurringPattern, type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Every 2 weeks</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End date
                    </label>
                    <input
                      type="date"
                      value={recurringPattern.endDate}
                      onChange={(e) =>
                        setRecurringPattern({ ...recurringPattern, endDate: e.target.value })
                      }
                      min={selectedSlot?.date}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Location & Instructions
            </h3>

            {/* Location Type */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Service Location
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(locationTypes).map(([key, option]) => {
                  const Icon = option.icon
                  const isSelected = locationType === key

                  return (
                    <button
                      key={key}
                      onClick={() => setLocationType(key as keyof typeof locationTypes)}
                      className={`
                        p-3 rounded-lg border-2 transition-all
                        ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700'
                        }
                      `}
                    >
                      <Icon
                        className={`h-5 w-5 mx-auto mb-1 ${
                          isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'
                        }`}
                      />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </p>
                    </button>
                  )
                })}
              </div>

              {locationType === 'user_address' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Address
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <textarea
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    rows={2}
                    placeholder="Enter your complete address..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                </div>
              )}

              {locationType === 'provider_address' && provider.address && (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Service will be provided at: {provider.address}
                  </p>
                </div>
              )}

              {locationType === 'virtual' && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <Video className="inline h-4 w-4 mr-1" />A video link will be shared before the
                    appointment
                  </p>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Special Instructions (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
                placeholder="Any special requests or instructions for the provider..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
              />
            </div>

            {/* Contact Information */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Provider Contact
              </h4>
              <div className="space-y-2">
                {provider.phone && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="inline h-4 w-4 mr-2" />
                    {provider.phone}
                  </p>
                )}
                {provider.whatsapp && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <MessageSquare className="inline h-4 w-4 mr-2" />
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Review & Confirm
            </h3>

            {/* Booking Summary */}
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Booking Summary</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Provider:</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      {provider.name}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Services:</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white text-right">
                      {selectedServices
                        .map((s) => serviceOptions[s as keyof typeof serviceOptions]?.label)
                        .join(', ')}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Date:</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedSlot?.date}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Time:</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedSlot?.startTime} - {selectedSlot?.endTime}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Duration:</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      {totalDuration} minutes
                    </dd>
                  </div>
                  {isRecurring && (
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600 dark:text-gray-400">Recurring:</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">
                        {recurringPattern.type} until {recurringPattern.endDate}
                      </dd>
                    </div>
                  )}
                  <div className="border-t dark:border-gray-800 pt-2 mt-2">
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
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                      Cancellation Policy
                    </h4>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                      <li>• 24+ hours notice: No charge</li>
                      <li>• Less than 24 hours: 50% charge</li>
                      <li>• No-show: 100% charge</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-teal-600 border-gray-300 dark:border-gray-600 rounded focus:ring-teal-500 dark:focus:ring-teal-400"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-gray-900 dark:text-white">
                      I agree to the terms and conditions and cancellation policy
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Progress Steps */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className={`flex items-center ${stepNumber < 4 ? 'flex-1' : ''}`}>
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    step >= stepNumber
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
              </div>
              {stepNumber < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > stepNumber ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-3xl mx-auto mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Services</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Date & Time</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Details</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Confirm</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">{renderStep()}</div>

      {/* Form Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Back
          </button>
        ) : (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 1 && selectedServices.length === 0) ||
              (step === 2 && !selectedSlot) ||
              (step === 3 && locationType === 'user_address' && !userAddress.trim())
            }
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!agreeToTerms || loading}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
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
