'use client'

import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { enUS, es, ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type TimeSlot = {
  id: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  isBlocked?: boolean
  maxBookings?: number
  currentBookings?: number
}

type ProviderAvailability = {
  monday?: string[]
  tuesday?: string[]
  wednesday?: string[]
  thursday?: string[]
  friday?: string[]
  saturday?: string[]
  sunday?: string[]
}

type BookingCalendarProps = {
  providerId: string
  providerName?: string
  onSlotSelect?: (slot: TimeSlot) => void
  selectedDate?: Date
  selectedSlot?: TimeSlot
  minDate?: Date
  maxDate?: Date
  duration?: number // Duration in minutes
  timezone?: string
  showLegend?: boolean
  className?: string
}

const locales = {
  en: enUS,
  es,
  pt: ptBR,
}

const _dayNames = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
}

export default function BookingCalendar({
  providerId,
  providerName = 'Provider',
  onSlotSelect,
  selectedDate: initialDate,
  selectedSlot,
  minDate = new Date(),
  maxDate = addMonths(new Date(), 3),
  duration = 60,
  timezone = 'America/Bogota',
  showLegend = true,
  className = '',
}: BookingCalendarProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const dateLocale = locales[locale as keyof typeof locales] || enUS

  const [currentMonth, setCurrentMonth] = useState(initialDate || new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [providerAvailability, setProviderAvailability] = useState<ProviderAvailability | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  const supabase = createClient()

  // Fetch provider availability schedule
  useEffect(() => {
    async function fetchProviderAvailability() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('service_providers')
          .select('work_hours, work_days')
          .eq('id', providerId)
          .single()

        if (error) {
          throw error
        }
        setProviderAvailability((data?.work_hours as ProviderAvailability) || {})
      } catch (_error) {
        // Error handled silently
      } finally {
        setLoading(false)
      }
    }

    fetchProviderAvailability()
  }, [providerId, supabase])

  // Fetch available slots for selected date
  useEffect(() => {
    if (!(selectedDate && providerAvailability)) {
      return
    }

    async function fetchSlots() {
      if (!selectedDate || !providerAvailability) return
      setLoadingSlots(true)
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd')
        const dayName = format(selectedDate, 'EEEE').toLowerCase()
        const daySchedule = providerAvailability[dayName as keyof ProviderAvailability] || []

        // Generate slots from provider's availability schedule
        const slots: TimeSlot[] = []
        for (const timeRange of daySchedule) {
          const [startStr, endStr] = timeRange.split('-')
          const [startHour, startMin] = startStr.split(':').map(Number)
          const [endHour, endMin] = endStr.split(':').map(Number)

          // Generate slots based on duration
          let currentHour = startHour
          let currentMin = startMin

          while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
            const slotStartTime = `${String(currentHour).padStart(2, '0')}:${String(
              currentMin
            ).padStart(2, '0')}`

            // Calculate end time for this slot
            let slotEndMin = currentMin + duration
            const slotEndHour = currentHour + Math.floor(slotEndMin / 60)
            slotEndMin %= 60

            // Don't create slots that exceed the provider's availability
            if (slotEndHour < endHour || (slotEndHour === endHour && slotEndMin <= endMin)) {
              const slotEndTime = `${String(slotEndHour).padStart(2, '0')}:${String(
                slotEndMin
              ).padStart(2, '0')}`

              slots.push({
                id: `${dateStr}-${slotStartTime}`,
                date: dateStr,
                startTime: slotStartTime,
                endTime: slotEndTime,
                isAvailable: true,
                maxBookings: 1,
                currentBookings: 0,
              })
            }

            // Move to next slot
            currentMin += duration
            if (currentMin >= 60) {
              currentHour += Math.floor(currentMin / 60)
              currentMin %= 60
            }
          }
        }

        // Check existing bookings to mark slots as unavailable
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('booking_date, start_time, end_time')
          .eq('provider_id', providerId)
          .eq('booking_date', dateStr)
          .in('status', ['confirmed', 'pending'])

        if (!error && bookings) {
          for (const booking of bookings) {
            // Mark conflicting slots as unavailable
            slots.forEach((slot) => {
              const slotStart = parseISO(`${dateStr}T${slot.startTime}`)
              const slotEnd = parseISO(`${dateStr}T${slot.endTime}`)
              const bookingStart = parseISO(`${dateStr}T${booking.start_time}`)
              const bookingEnd = parseISO(`${dateStr}T${booking.end_time}`)

              if (
                (slotStart >= bookingStart && slotStart < bookingEnd) ||
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (slotStart <= bookingStart && slotEnd >= bookingEnd)
              ) {
                slot.isAvailable = false
                slot.currentBookings = (slot.currentBookings || 0) + 1
              }
            })
          }
        }

        // Filter out past slots for today
        if (isToday(selectedDate)) {
          const now = new Date()
          const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes()
          ).padStart(2, '0')}`

          setAvailableSlots(slots.filter((slot) => slot.startTime > currentTime))
        } else {
          setAvailableSlots(slots)
        }
      } catch (_error) {
        setAvailableSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchSlots()
  }, [selectedDate, providerAvailability, providerId, duration, supabase])

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    const days = []
    let currentDay = start

    while (currentDay <= end) {
      days.push(currentDay)
      currentDay = addDays(currentDay, 1)
    }

    return days
  }, [currentMonth])

  // Check if a date has available slots
  const hasAvailability = (date: Date) => {
    if (!providerAvailability) {
      return false
    }

    const dayName = format(date, 'EEEE').toLowerCase()
    const daySchedule = providerAvailability[dayName as keyof ProviderAvailability]

    return daySchedule && daySchedule.length > 0
  }

  const handleDateSelect = (date: Date) => {
    if (date < minDate || date > maxDate) {
      return
    }
    setSelectedDate(date)
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.isAvailable) {
      return
    }
    onSlotSelect?.(slot)
  }

  return (
    <div className={`booking-calendar ${className}`}>
      {/* Calendar Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
            Select Date & Time
          </h3>
          {showLegend && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-teal-500" />
                <span className="text-gray-600 dark:text-gray-400">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="text-gray-600 dark:text-gray-400">Unavailable</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">Selected</span>
              </div>
            </div>
          )}
        </div>

        {/* Month Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            aria-label="Previous month"
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            type="button"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h4 className="font-medium text-gray-900 text-lg dark:text-white">
            {format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}
          </h4>
          <button
            aria-label="Next month"
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            type="button"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-teal-600 border-b-2" />
          </div>
        ) : (
          <>
            {/* Day Headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  className="py-2 text-center font-medium text-gray-500 text-xs dark:text-gray-400"
                  key={day}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const hasSlots = hasAvailability(day)
                const isPast = day < minDate
                const isFuture = day > maxDate
                const isDisabled = isPast || isFuture || !hasSlots

                return (
                  <button
                    className={`relative h-10 rounded-lg p-2 transition-all ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}
                      ${
                        isSelected
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : isDisabled
                            ? 'cursor-not-allowed opacity-50'
                            : hasSlots
                              ? 'hover:bg-teal-50 dark:hover:bg-teal-900/20'
                              : ''
                      }
                      ${isToday(day) && !isSelected ? 'ring-2 ring-teal-500 ring-inset' : ''}
                    `}
                    disabled={isDisabled}
                    key={index}
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    type="button"
                  >
                    <span className="text-sm">{format(day, 'd')}</span>
                    {hasSlots && !isDisabled && (
                      <div className="-translate-x-1/2 absolute bottom-1 left-1/2 h-1 w-1 rounded-full bg-teal-500" />
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h4 className="mb-3 font-medium text-gray-900 text-md dark:text-white">
            Available Times for {format(selectedDate, 'MMMM d, yyyy')}
          </h4>

          {loadingSlots ? (
            <div className="flex justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-teal-600 border-b-2" />
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {availableSlots.map((slot) => (
                <button
                  className={`rounded-lg px-3 py-2 font-medium text-sm transition-all ${
                    selectedSlot?.id === slot.id
                      ? 'bg-teal-600 text-white'
                      : slot.isAvailable
                        ? 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-teal-50 hover:text-teal-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-teal-900/20 dark:hover:text-teal-300'
                        : 'cursor-not-allowed bg-gray-100 text-gray-400 line-through dark:bg-gray-900 dark:text-gray-600'
                  }
                  `}
                  disabled={!slot.isAvailable}
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  type="button"
                >
                  <Clock className="mr-1 inline h-3 w-3" />
                  {slot.startTime}
                </button>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500 dark:text-gray-400">
              No available time slots for this date
            </p>
          )}

          {selectedSlot && (
            <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-3 dark:border-teal-800 dark:bg-teal-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-sm text-teal-900 dark:text-teal-100">
                    Selected: {format(selectedDate, 'MMM d')} at {selectedSlot.startTime} -{' '}
                    {selectedSlot.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300">
                  <MapPin className="h-4 w-4" />
                  <span>{providerName}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
