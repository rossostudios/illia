'use client'

import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { AnimatePresence } from 'framer-motion'
import { AlertCircle, Calendar, Download } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { BookingCalendar } from '@/components/bookings/BookingCalendar'
import { BookingCard } from '@/components/bookings/BookingCard'
import { BookingFilters } from '@/components/bookings/BookingFilters'
import { BookingStats } from '@/components/bookings/BookingStats'
import { useSessionContext } from '@/components/SessionProvider'
import { Button } from '@/components/ui/Button'
import { MOCK_BOOKINGS } from '@/data/mock-bookings'
import { createClient } from '@/lib/supabase/client'
import type { Booking } from '@/types/booking'

const WEEK_OPTIONS = { weekStartsOn: 1 } as const

type BookingFiltersState = {
  search: string
  status: 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled'
  dateRange: 'all' | 'today' | 'past' | 'this_week' | 'next_week' | 'this_month' | 'next_month'
}

const DEFAULT_FILTERS: BookingFiltersState = {
  search: '',
  status: 'all',
  dateRange: 'all',
}

export default function BookingsPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const { user } = useSessionContext()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSampleData, setIsSampleData] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filters, setFilters] = useState<BookingFiltersState>(DEFAULT_FILTERS)

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      setErrorMessage(null)
      setIsSampleData(false)

      if (!user?.id) {
        setBookings([])
        return
      }

      // TODO: Enable when bookings table is created in database
      // const supabase = createClient()
      // const { data, error } = await supabase
      //   .from('bookings')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .order('booking_date', { ascending: true })

      // For now, just use mock data
      throw new Error('Bookings table not yet available')
    } catch (_error) {
      setErrorMessage(
        'Live bookings are temporarily unavailable. Showing sample data for reference.'
      )
      setBookings(MOCK_BOOKINGS)
      setIsSampleData(true)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleBookingAction = useCallback(
    async (bookingId: string, action: string) => {
      if (isSampleData) {
        toast.info('Connect to Supabase to manage live bookings.')
        return
      }

      switch (action) {
        case 'confirm': {
          await toast.promise(
            (async () => {
              const response = await fetch('/api/bookings', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: bookingId, status: 'confirmed' }),
                credentials: 'include',
              })

              const payload = await response.json().catch(() => ({}))

              if (!response.ok) {
                throw new Error(payload.error ?? 'Failed to confirm booking')
              }

              await fetchBookings()
              return payload
            })(),
            {
              loading: 'Confirming booking…',
              success: (payload) => (payload?.message as string | undefined) ?? 'Booking confirmed',
              error: (error) => error.message || 'Failed to confirm booking',
            }
          )
          break
        }
        case 'cancel': {
          await toast.promise(
            (async () => {
              const response = await fetch(`/api/bookings?id=${bookingId}`, {
                method: 'DELETE',
                credentials: 'include',
              })

              const payload = await response.json().catch(() => ({}))

              if (!response.ok) {
                throw new Error(payload.error ?? 'Failed to cancel booking')
              }

              await fetchBookings()
              return payload
            })(),
            {
              loading: 'Cancelling booking…',
              success: (payload) => (payload?.message as string | undefined) ?? 'Booking cancelled',
              error: (error) => error.message || 'Failed to cancel booking',
            }
          )
          break
        }
        case 'reschedule':
          router.push(`/${locale}/dashboard/bookings/${bookingId}/reschedule`)
          break
        case 'message':
          router.push(`/${locale}/dashboard/messages`)
          break
        case 'call':
          toast.info('Opening phone dialer...')
          break
        case 'review':
          router.push(`/${locale}/dashboard/bookings/${bookingId}/review`)
          break
        case 'rebook':
          router.push(`/${locale}/dashboard/bookings/new?provider=${bookingId}`)
          break
        default:
          break
      }
    },
    [fetchBookings, isSampleData, locale, router]
  )

  const handleFiltersChange = useCallback((nextFilters: BookingFiltersState) => {
    setFilters(nextFilters)
  }, [])

  const handleViewModeChange = useCallback((mode: 'grid' | 'list' | 'calendar') => {
    setViewMode(mode)
  }, [])

  const handleExport = () => {
    toast.success('Exporting bookings...')
    // Implement CSV export logic
  }

  const handleCalendarSync = () => {
    toast.info('Opening calendar sync settings...')
    // Implement calendar sync
  }

  const filteredBookings = useMemo(() => {
    const today = startOfDay(new Date())
    const normalizedSearch = filters.search.trim().toLowerCase()
    const weekStart = startOfWeek(today, WEEK_OPTIONS)
    const weekEnd = endOfWeek(today, WEEK_OPTIONS)
    const nextWeekStart = startOfWeek(addWeeks(today, 1), WEEK_OPTIONS)
    const nextWeekEnd = endOfWeek(addWeeks(today, 1), WEEK_OPTIONS)
    const monthStart = startOfMonth(today)
    const monthEnd = endOfMonth(today)
    const nextMonthStart = startOfMonth(addMonths(today, 1))
    const nextMonthEnd = endOfMonth(addMonths(today, 1))

    const sorted = [...bookings].sort(
      (a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime()
    )

    return sorted.filter((booking) => {
      const bookingDate = startOfDay(new Date(booking.booking_date))

      if (normalizedSearch) {
        const providerName = booking.provider?.name?.toLowerCase() || ''
        const services = booking.service_type.map((service) => service.toLowerCase())
        const matchesSearch =
          providerName.includes(normalizedSearch) ||
          services.some((service) => service.includes(normalizedSearch))

        if (!matchesSearch) {
          return false
        }
      }

      if (filters.status !== 'all' && booking.status !== filters.status) {
        return false
      }

      switch (filters.dateRange) {
        case 'today':
          if (!isSameDay(bookingDate, today)) {
            return false
          }
          break
        case 'past':
          if (!isBefore(bookingDate, today)) {
            return false
          }
          break
        case 'this_week':
          if (!isWithinInterval(bookingDate, { start: weekStart, end: weekEnd })) {
            return false
          }
          break
        case 'next_week':
          if (!isWithinInterval(bookingDate, { start: nextWeekStart, end: nextWeekEnd })) {
            return false
          }
          break
        case 'this_month':
          if (!isWithinInterval(bookingDate, { start: monthStart, end: monthEnd })) {
            return false
          }
          break
        case 'next_month':
          if (!isWithinInterval(bookingDate, { start: nextMonthStart, end: nextMonthEnd })) {
            return false
          }
          break
        default:
          break
      }

      return true
    })
  }, [bookings, filters])

  const stats = useMemo(() => {
    const today = startOfDay(new Date())
    const totals = bookings.reduce(
      (acc, booking) => {
        const bookingDate = startOfDay(new Date(booking.booking_date))

        if (
          (booking.status === 'confirmed' || booking.status === 'pending') &&
          (isSameDay(bookingDate, today) || isAfter(bookingDate, today))
        ) {
          acc.upcoming += 1
        }

        if (booking.status === 'pending') {
          acc.pending += 1
        }

        if (booking.status === 'completed') {
          acc.completed += 1
        }

        return acc
      },
      { total: bookings.length, upcoming: 0, pending: 0, completed: 0 }
    )

    return totals
  }, [bookings])

  let bookingsContent: ReactNode

  if (loading) {
    bookingsContent = (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
      </div>
    )
  } else if (filteredBookings.length === 0) {
    bookingsContent = (
      <div className="py-12 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 font-medium text-gray-900 text-lg dark:text-white">
          No bookings found
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {filters.search || filters.status !== 'all' || filters.dateRange !== 'all'
            ? 'Try adjusting your filters'
            : "You haven't made any bookings yet"}
        </p>
        <Button className="mt-4" onClick={() => router.push(`/${locale}/dashboard/directory`)}>
          Browse Services
        </Button>
      </div>
    )
  } else if (viewMode === 'calendar') {
    bookingsContent = (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BookingCalendar
            bookings={filteredBookings}
            currentDate={currentDate}
            locale={locale}
            onDateChange={setCurrentDate}
            onNextMonth={() => setCurrentDate((prev) => addMonths(prev, 1))}
            onPrevMonth={() => setCurrentDate((prev) => addMonths(prev, -1))}
          />
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {format(currentDate, 'MMMM d, yyyy')}
          </h3>
          {filteredBookings
            .filter(
              (booking) =>
                startOfDay(new Date(booking.booking_date)).toDateString() ===
                currentDate.toDateString()
            )
            .map((booking) => (
              <BookingCard
                booking={booking}
                key={booking.id}
                onAction={handleBookingAction}
                viewMode="grid"
              />
            ))}
        </div>
      </div>
    )
  } else if (viewMode === 'list') {
    bookingsContent = (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <AnimatePresence mode="popLayout">
          {filteredBookings.map((booking) => (
            <BookingCard
              booking={booking}
              key={booking.id}
              onAction={handleBookingAction}
              viewMode="list"
            />
          ))}
        </AnimatePresence>
      </div>
    )
  } else {
    bookingsContent = (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredBookings.map((booking) => (
            <BookingCard
              booking={booking}
              key={booking.id}
              onAction={handleBookingAction}
              viewMode="grid"
            />
          ))}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-gray-200 border-b bg-white px-4 py-6 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2 font-bold text-3xl text-gray-900 dark:text-white">
                <Calendar className="h-8 w-8 text-teal-600" />
                My Bookings
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Manage your service bookings and appointments
              </p>
            </div>
            <div className="hidden sm:flex sm:gap-3">
              <Button onClick={handleCalendarSync} variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Sync Calendar
              </Button>
              <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <BookingStats stats={stats} />

          {isSampleData && (
            <p className="mt-3 flex items-center gap-2 font-medium text-amber-600 text-xs dark:text-amber-300">
              <AlertCircle className="h-4 w-4" /> Sample data shown while live bookings load.
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <BookingFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onViewModeChange={handleViewModeChange}
        totalBookings={filteredBookings.length}
        viewMode={viewMode}
      />

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {errorMessage && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-500/40 dark:bg-amber-900/30 dark:text-amber-100">
            <p className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </p>
          </div>
        )}

        {bookingsContent}
      </div>
    </div>
  )
}
