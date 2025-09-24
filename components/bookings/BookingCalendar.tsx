'use client'

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { enUS, es, ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Booking } from '@/types/booking'

type BookingCalendarProps = {
  bookings: Booking[]
  currentDate: Date
  onDateChange: (date: Date) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  locale?: string
}

export function BookingCalendar({
  bookings,
  currentDate,
  onDateChange,
  onPrevMonth,
  onNextMonth,
  locale = 'en',
}: BookingCalendarProps) {
  const getLocale = () => {
    if (locale === 'es') return es
    if (locale === 'pt') return ptBR
    return enUS
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getBookingsForDay = (day: Date) =>
    bookings.filter((booking) => isSameDay(new Date(booking.booking_date), day))

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Calendar Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 text-lg dark:text-white">
          {format(currentDate, 'MMMM yyyy', { locale: getLocale() })}
        </h2>
        <div className="flex gap-2">
          <Button onClick={onPrevMonth} size="sm" variant="outline">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={onNextMonth} size="sm" variant="outline">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div
            className="p-2 text-center font-medium text-gray-500 text-xs uppercase dark:text-gray-400"
            key={i}
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, idx) => {
          const dayBookings = getBookingsForDay(day)
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()

          return (
            <button
              className={`relative min-h-[60px] rounded-lg border p-2 text-sm transition-colors ${
                isCurrentMonth
                  ? 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800'
                  : 'border-gray-100 bg-gray-50 text-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-600'
              }
                ${isToday(day) ? 'ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900' : ''}
                ${isSameDay(day, currentDate) ? 'bg-teal-50 dark:bg-teal-900/20' : ''}
              `}
              key={idx}
              onClick={() => onDateChange(day)}
            >
              <span
                className={`font-medium ${isToday(day) ? 'text-teal-600 dark:text-teal-400' : ''}
                ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}
              `}
              >
                {format(day, 'd')}
              </span>

              {dayBookings.length > 0 && (
                <div className="mt-1 space-y-0.5">
                  {dayBookings.slice(0, 2).map((booking, i) => (
                    <div
                      className={`h-1.5 w-full rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-500'
                          : booking.status === 'pending'
                            ? 'bg-yellow-500'
                            : booking.status === 'cancelled'
                              ? 'bg-red-500'
                              : 'bg-blue-500'
                      }
                      `}
                      key={booking.id}
                    />
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-center text-gray-500 text-xs dark:text-gray-400">
                      +{dayBookings.length - 2}
                    </div>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 border-gray-200 border-t pt-4 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-gray-600 text-sm dark:text-gray-400">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="text-gray-600 text-sm dark:text-gray-400">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span className="text-gray-600 text-sm dark:text-gray-400">Completed</span>
        </div>
      </div>
    </div>
  )
}
