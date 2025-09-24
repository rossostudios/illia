'use client'

import { addMonths, format } from 'date-fns'
import { AnimatePresence } from 'framer-motion'
import { Calendar, Download } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { BookingCalendar } from '@/components/bookings/BookingCalendar'
import { BookingCard } from '@/components/bookings/BookingCard'
import { BookingFilters } from '@/components/bookings/BookingFilters'
import { BookingStats } from '@/components/bookings/BookingStats'
import { useSessionContext } from '@/components/SessionProvider'
import { Button } from '@/components/ui/Button'
import { MOCK_BOOKINGS } from '@/data/mock-bookings'
import type { Booking } from '@/types/booking'

export default function BookingsPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const { session } = useSessionContext()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all',
  })

  useEffect(() => {
    fetchBookings()
  }, [session])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      // In production, fetch from Supabase
      // const supabase = createClient()
      // const { data, error } = await supabase
      //   .from('bookings')
      //   .select('*')
      //   .eq('user_id', session?.user?.id)

      // For now, use mock data
      setBookings(MOCK_BOOKINGS)
    } catch (error) {
      toast.error('Failed to load bookings')
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingAction = async (bookingId: string, action: string) => {
    switch (action) {
      case 'confirm':
        toast.success('Booking confirmed!')
        // Update booking status
        break
      case 'cancel':
        toast.info('Booking cancelled')
        // Update booking status
        break
      case 'reschedule':
        router.push(`/${locale}/dashboard/bookings/${bookingId}/reschedule`)
        break
      case 'message':
        router.push(`/${locale}/dashboard/messages`)
        break
      case 'call':
        // Handle phone call
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
  }

  const handleExport = () => {
    toast.success('Exporting bookings...')
    // Implement CSV export logic
  }

  const handleCalendarSync = () => {
    toast.info('Opening calendar sync settings...')
    // Implement calendar sync
  }

  // Filter bookings based on filters
  const filteredBookings = bookings.filter((booking) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      if (
        !(
          booking.provider?.name.toLowerCase().includes(searchLower) ||
          booking.service_type.some((s) => s.toLowerCase().includes(searchLower))
        )
      ) {
        return false
      }
    }

    // Status filter
    if (filters.status !== 'all' && booking.status !== filters.status) {
      return false
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const bookingDate = new Date(booking.booking_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      switch (filters.dateRange) {
        case 'today':
          if (bookingDate.toDateString() !== today.toDateString()) return false
          break
        case 'past':
          if (bookingDate >= today) return false
          break
        // Add more date range logic as needed
      }
    }

    return true
  })

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
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
        </div>
      </div>

      {/* Filters */}
      <BookingFilters
        filters={filters}
        onFiltersChange={setFilters}
        onViewModeChange={setViewMode}
        totalBookings={filteredBookings.length}
        viewMode={viewMode}
      />

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          </div>
        ) : filteredBookings.length === 0 ? (
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
        ) : viewMode === 'calendar' ? (
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
                  (b) => new Date(b.booking_date).toDateString() === currentDate.toDateString()
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
        ) : viewMode === 'list' ? (
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
        ) : (
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
        )}
      </div>
    </div>
  )
}
