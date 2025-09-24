'use client'

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { enUS, es, ptBR } from 'date-fns/locale'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Eye,
  Grid3x3,
  List,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Star,
  Video,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

type Booking = {
  id: string
  user_id: string
  provider_id: string
  service_type: string[]
  booking_date: string
  start_time: string
  end_time: string
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show' | 'rescheduled'
  hourly_rate: number
  total_amount: number
  currency: string
  payment_status: string
  is_recurring: boolean
  recurring_pattern?: Record<string, unknown>
  special_instructions?: string
  location_details?: Record<string, unknown>
  cancellation_fee?: number
  cancelled_at?: string
  cancellation_reason?: string
  created_at: string
  user?: {
    id: string
    name: string
    email: string
    avatar_url?: string
  }
  provider?: {
    id: string
    name: string
    email: string
    phone?: string
    whatsapp?: string
    photo_url?: string
  }
  booking_reviews?: {
    rating: number
    review_text: string
  }[]
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  no_show: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  rescheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
}

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  cancelled: X,
  completed: Check,
  no_show: AlertCircle,
  rescheduled: RefreshCw,
}

const locales = {
  en: enUS,
  es,
  pt: ptBR,
}

export default function BookingsPage() {
  const _router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const dateLocale = locales[locale as keyof typeof locales] || enUS
  const { user } = useSessionContext()
  const { success, error: showError, warning } = useToast()
  const _supabase = createClient()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [isProvider, setIsProvider] = useState(false)
  const [view, setView] = useState<'list' | 'grid' | 'calendar'>('list')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDate, setFilterDate] = useState<'all' | 'upcoming' | 'past'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch bookings
  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  async function fetchBookings() {
    if (!user) {
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/bookings')
      const data = await response.json()

      if (data.success) {
        setBookings(data.bookings)
        setIsProvider(data.isProvider)
      } else {
        showError('Failed to fetch bookings', data.error)
      }
    } catch (_error) {
      showError('Error', 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    // Status filter
    if (filterStatus !== 'all' && booking.status !== filterStatus) {
      return false
    }

    // Date filter
    const bookingDate = parseISO(booking.booking_date)
    const today = new Date()

    if (filterDate === 'upcoming' && bookingDate < today) {
      return false
    }
    if (filterDate === 'past' && bookingDate >= today) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const searchableFields = [
        booking.provider?.name,
        booking.user?.name,
        booking.service_type.join(' '),
        booking.special_instructions,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (!searchableFields.includes(query)) {
        return false
      }
    }

    return true
  })

  // Get bookings for calendar view
  const getBookingsForDate = (date: Date) =>
    filteredBookings.filter((booking) => isSameDay(parseISO(booking.booking_date), date))

  // Calendar days
  const calendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }

  // Handle booking actions
  async function handleBookingAction(bookingId: string, action: 'confirm' | 'cancel' | 'complete') {
    setActionLoading(bookingId)

    try {
      const updates: Record<string, unknown> = {}

      switch (action) {
        case 'confirm':
          updates.status = 'confirmed'
          break
        case 'cancel': {
          const reason = prompt('Please provide a reason for cancellation:')
          if (!reason) {
            setActionLoading(null)
            return
          }

          // Call DELETE endpoint for cancellation
          const deleteResponse = await fetch(`/api/bookings?id=${bookingId}`, {
            method: 'DELETE',
          })

          const deleteData = await deleteResponse.json()

          if (deleteData.success) {
            if (deleteData.cancellation_fee > 0) {
              warning(
                'Booking cancelled',
                `A cancellation fee of $${(deleteData.cancellation_fee / 100).toFixed(2)} applies`
              )
            } else {
              success('Booking cancelled', 'The booking has been cancelled successfully')
            }
            await fetchBookings()
          } else {
            showError('Cancellation failed', deleteData.error)
          }
          setActionLoading(null)
          return
        }

        case 'complete':
          updates.status = 'completed'
          break
      }

      // Update booking status
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, ...updates }),
      })

      const data = await response.json()

      if (data.success) {
        success(`Booking ${action}ed`, `The booking has been ${action}ed successfully`)
        await fetchBookings()
      } else {
        showError(`Failed to ${action} booking`, data.error)
      }
    } catch (_error) {
      showError('Error', `Failed to ${action} booking`)
    } finally {
      setActionLoading(null)
    }
  }

  // Open booking details
  function openBookingDetails(booking: Booking) {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }

  // Export bookings
  function exportBookings() {
    const csv = [
      ['Date', 'Time', 'Service', 'Client/Provider', 'Status', 'Amount'],
      ...filteredBookings.map((booking) => [
        booking.booking_date,
        `${booking.start_time} - ${booking.end_time}`,
        booking.service_type.join(', '),
        isProvider ? booking.user?.name : booking.provider?.name,
        booking.status,
        `$${(booking.total_amount / 100).toFixed(2)}`,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  // Stats calculation
  const stats = {
    total: filteredBookings.length,
    pending: filteredBookings.filter((b) => b.status === 'pending').length,
    confirmed: filteredBookings.filter((b) => b.status === 'confirmed').length,
    completed: filteredBookings.filter((b) => b.status === 'completed').length,
    revenue: filteredBookings
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + b.total_amount, 0),
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-gray-200 border-b bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-2xl text-gray-900 dark:text-white">My Bookings</h1>
              <p className="mt-1 text-gray-600 text-sm dark:text-gray-400">
                {isProvider ? 'Manage your service bookings' : 'View and manage your bookings'}
              </p>
            </div>
            <Link
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700"
              href={`/${locale}/dashboard/directory`}
            >
              <Calendar className="h-4 w-4" />
              New Booking
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
              <p className="text-gray-600 text-sm dark:text-gray-400">Total</p>
              <p className="font-semibold text-2xl text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
              <p className="font-semibold text-2xl text-yellow-900 dark:text-yellow-100">
                {stats.pending}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <p className="text-green-600 text-sm dark:text-green-400">Confirmed</p>
              <p className="font-semibold text-2xl text-green-900 dark:text-green-100">
                {stats.confirmed}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-blue-600 text-sm dark:text-blue-400">Revenue</p>
              <p className="font-semibold text-2xl text-blue-900 dark:text-blue-100">
                ${(stats.revenue / 100).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
                <input
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookings..."
                  type="text"
                  value={searchQuery}
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
              onChange={(e) => setFilterStatus(e.target.value)}
              value={filterStatus}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>

            {/* Date Filter */}
            <select
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
              onChange={(e) => setFilterDate(e.target.value as string)}
              value={filterDate}
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>

            {/* View Toggle */}
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-900">
              <button
                aria-label="List view"
                className={`rounded p-2 ${
                  view === 'list'
                    ? 'bg-white shadow-sm dark:bg-gray-900'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                aria-label="Grid view"
                className={`rounded p-2 ${
                  view === 'grid'
                    ? 'bg-white shadow-sm dark:bg-gray-900'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
                onClick={() => setView('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                aria-label="Calendar view"
                className={`rounded p-2 ${
                  view === 'calendar'
                    ? 'bg-white shadow-sm dark:bg-gray-900'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
                onClick={() => setView('calendar')}
              >
                <Calendar className="h-4 w-4" />
              </button>
            </div>

            {/* Export */}
            <button
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              onClick={exportBookings}
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-teal-600 border-b-2" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-lg bg-white py-12 text-center dark:bg-gray-900">
            <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
            <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
              No bookings found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || filterStatus !== 'all' || filterDate !== 'all'
                ? 'Try adjusting your filters'
                : 'Your bookings will appear here'}
            </p>
          </div>
        ) : view === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const StatusIcon = statusIcons[booking.status]
              const isActionLoading = actionLoading === booking.id

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  initial={{ opacity: 0, y: 10 }}
                  key={booking.id}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {/* Date Block */}
                      <div className="rounded-lg bg-gray-50 px-3 py-2 text-center dark:bg-gray-900">
                        <p className="text-gray-600 text-xs dark:text-gray-400">
                          {format(parseISO(booking.booking_date), 'MMM')}
                        </p>
                        <p className="font-bold text-2xl text-gray-900 dark:text-white">
                          {format(parseISO(booking.booking_date), 'd')}
                        </p>
                        <p className="text-gray-600 text-xs dark:text-gray-400">
                          {format(parseISO(booking.booking_date), 'EEE')}
                        </p>
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {isProvider ? booking.user?.name : booking.provider?.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-4">
                              <span className="flex items-center gap-1 text-gray-600 text-sm dark:text-gray-400">
                                <Clock className="h-3 w-3" />
                                {booking.start_time} - {booking.end_time}
                              </span>
                              <span className="text-gray-600 text-sm dark:text-gray-400">
                                {booking.duration_minutes} min
                              </span>
                            </div>
                          </div>
                          <span
                            className={`flex items-center gap-1 rounded-full px-2 py-1 font-medium text-xs ${
                              statusColors[booking.status]
                            }`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {booking.status}
                          </span>
                        </div>

                        {/* Services */}
                        <div className="mb-2 flex flex-wrap gap-2">
                          {booking.service_type.map((service) => (
                            <span
                              className="rounded bg-teal-50 px-2 py-1 text-teal-700 text-xs dark:bg-teal-900/20 dark:text-teal-300"
                              key={service}
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4 text-gray-600 text-sm dark:text-gray-400">
                          {booking.location_details?.type === 'virtual' ? (
                            <span className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Virtual
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {booking.location_details?.type === 'user_address'
                                ? 'Your Location'
                                : "Provider's Location"}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />$
                            {(booking.total_amount / 100).toFixed(2)}
                          </span>
                          {booking.is_recurring && (
                            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                              <RefreshCw className="h-3 w-3" />
                              Recurring
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {booking.status === 'pending' && isProvider && (
                        <button
                          className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                          disabled={isActionLoading}
                          onClick={() => handleBookingAction(booking.id, 'confirm')}
                        >
                          {isActionLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-white border-b-2" />
                          ) : (
                            'Confirm'
                          )}
                        </button>
                      )}
                      {booking.status === 'confirmed' && isProvider && (
                        <button
                          className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                          disabled={isActionLoading}
                          onClick={() => handleBookingAction(booking.id, 'complete')}
                        >
                          {isActionLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-white border-b-2" />
                          ) : (
                            'Complete'
                          )}
                        </button>
                      )}
                      {['pending', 'confirmed'].includes(booking.status) && (
                        <button
                          className="rounded-lg border border-red-600 px-3 py-1 text-red-600 text-sm transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20"
                          disabled={isActionLoading}
                          onClick={() => handleBookingAction(booking.id, 'cancel')}
                        >
                          {isActionLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-red-600 border-b-2" />
                          ) : (
                            'Cancel'
                          )}
                        </button>
                      )}
                      <button
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => openBookingDetails(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : view === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => {
              const StatusIcon = statusIcons[booking.status]

              return (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                  initial={{ opacity: 0, scale: 0.95 }}
                  key={booking.id}
                  onClick={() => openBookingDetails(booking)}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm dark:text-gray-400">
                        {format(parseISO(booking.booking_date), 'MMM d, yyyy')}
                      </p>
                      <p className="font-semibold text-gray-900 text-lg dark:text-white">
                        {booking.start_time}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-1 font-medium text-xs ${
                        statusColors[booking.status]
                      }`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {isProvider ? booking.user?.name : booking.provider?.name}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {booking.service_type.map((service) => (
                        <span
                          className="rounded bg-gray-100 px-2 py-1 text-gray-700 text-xs dark:bg-gray-700 dark:text-gray-300"
                          key={service}
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t pt-2 dark:border-gray-700">
                      <span className="text-gray-600 text-sm dark:text-gray-400">
                        {booking.duration_minutes} min
                      </span>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">
                        ${(booking.total_amount / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          /* Calendar View */
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <button
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                {format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}
              </h3>
              <button
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  className="bg-gray-50 p-2 text-center font-medium text-gray-700 text-xs dark:bg-gray-900 dark:text-gray-300"
                  key={day}
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays().map((day, index) => {
                const dayBookings = getBookingsForDate(day)
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth()

                return (
                  <div
                    className={`min-h-[80px] bg-white p-2 dark:bg-gray-900 ${
                      isCurrentMonth ? '' : 'opacity-50'
                    } ${isToday(day) ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}
                    key={index}
                  >
                    <p className="mb-1 font-medium text-gray-900 text-sm dark:text-white">
                      {format(day, 'd')}
                    </p>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          className="cursor-pointer truncate rounded bg-teal-100 p-1 text-teal-700 text-xs hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50"
                          key={booking.id}
                          onClick={() => openBookingDetails(booking)}
                        >
                          {booking.start_time} -{' '}
                          {isProvider ? booking.user?.name : booking.provider?.name}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <p className="text-gray-500 text-xs dark:text-gray-400">
                          +{dayBookings.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedBooking && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-900"
              exit={{ scale: 0.95, opacity: 0 }}
              initial={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 text-xl dark:text-white">
                  Booking Details
                </h2>
                <button
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setShowDetailsModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6 p-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`flex items-center gap-2 rounded-full px-3 py-1 font-medium text-sm ${
                      statusColors[selectedBooking.status]
                    }`}
                  >
                    {React.createElement(statusIcons[selectedBooking.status], {
                      className: 'h-4 w-4',
                    })}
                    {selectedBooking.status.charAt(0).toUpperCase() +
                      selectedBooking.status.slice(1)}
                  </span>
                  <span className="text-gray-500 text-sm dark:text-gray-400">
                    Booking #{selectedBooking.id.slice(0, 8)}
                  </span>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-1 text-gray-600 text-sm dark:text-gray-400">Date</p>
                    <p className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      <Calendar className="h-4 w-4" />
                      {format(parseISO(selectedBooking.booking_date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-gray-600 text-sm dark:text-gray-400">Time</p>
                    <p className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      <Clock className="h-4 w-4" />
                      {selectedBooking.start_time} - {selectedBooking.end_time} (
                      {selectedBooking.duration_minutes} min)
                    </p>
                  </div>
                </div>

                {/* Provider/Client Info */}
                <div className="border-t pt-4 dark:border-gray-700">
                  <p className="mb-2 text-gray-600 text-sm dark:text-gray-400">
                    {isProvider ? 'Client' : 'Service Provider'}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600">
                      <span className="font-semibold text-white">
                        {(isProvider
                          ? selectedBooking.user?.name
                          : selectedBooking.provider?.name)?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {isProvider ? selectedBooking.user?.name : selectedBooking.provider?.name}
                      </p>
                      <p className="text-gray-600 text-sm dark:text-gray-400">
                        {isProvider ? selectedBooking.user?.email : selectedBooking.provider?.email}
                      </p>
                    </div>
                  </div>
                  {selectedBooking.provider?.phone && (
                    <div className="mt-3 flex items-center gap-4">
                      <a
                        className="flex items-center gap-1 text-sm text-teal-600 hover:underline dark:text-teal-400"
                        href={`tel:${selectedBooking.provider.phone}`}
                      >
                        <Phone className="h-3 w-3" />
                        {selectedBooking.provider.phone}
                      </a>
                      {selectedBooking.provider.whatsapp && (
                        <a
                          className="flex items-center gap-1 text-green-600 text-sm hover:underline dark:text-green-400"
                          href={`https://wa.me/${selectedBooking.provider.whatsapp.replace(/\D/g, '')}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <MessageSquare className="h-3 w-3" />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Services */}
                <div className="border-t pt-4 dark:border-gray-700">
                  <p className="mb-2 text-gray-600 text-sm dark:text-gray-400">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.service_type.map((service) => (
                      <span
                        className="rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                        key={service}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="border-t pt-4 dark:border-gray-700">
                  <p className="mb-2 text-gray-600 text-sm dark:text-gray-400">Location</p>
                  <div className="flex items-start gap-2">
                    {selectedBooking.location_details?.type === 'virtual' ? (
                      <>
                        <Video className="mt-0.5 h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Virtual Meeting
                          </p>
                          <p className="text-gray-600 text-sm dark:text-gray-400">
                            Link will be shared before the appointment
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedBooking.location_details?.type === 'user_address'
                              ? 'Your Address'
                              : "Provider's Location"}
                          </p>
                          <p className="text-gray-600 text-sm dark:text-gray-400">
                            {selectedBooking.location_details?.address ||
                              'Address will be confirmed'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedBooking.special_instructions && (
                  <div className="border-t pt-4 dark:border-gray-700">
                    <p className="mb-2 text-gray-600 text-sm dark:text-gray-400">
                      Special Instructions
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedBooking.special_instructions}
                    </p>
                  </div>
                )}

                {/* Pricing */}
                <div className="border-t pt-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm dark:text-gray-400">Total Amount</p>
                    <p className="font-semibold text-2xl text-teal-600 dark:text-teal-400">
                      ${(selectedBooking.total_amount / 100).toFixed(2)} {selectedBooking.currency}
                    </p>
                  </div>
                  {selectedBooking.cancellation_fee && selectedBooking.cancellation_fee > 0 && (
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-red-600 text-sm dark:text-red-400">Cancellation Fee</p>
                      <p className="font-medium text-lg text-red-600 dark:text-red-400">
                        ${(selectedBooking.cancellation_fee / 100).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Review (if completed) */}
                {selectedBooking.status === 'completed' && selectedBooking.booking_reviews?.[0] && (
                  <div className="border-t pt-4 dark:border-gray-700">
                    <p className="mb-2 text-gray-600 text-sm dark:text-gray-400">Review</p>
                    <div className="mb-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          className={`h-4 w-4 ${
                            star <= (selectedBooking.booking_reviews?.[0]?.rating || 0)
                              ? 'fill-current text-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          key={star}
                        />
                      ))}
                    </div>
                    <p className="text-gray-900 dark:text-white">
                      {selectedBooking.booking_reviews[0].review_text}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 border-t pt-4 dark:border-gray-700">
                  <Link
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    href={`/${locale}/dashboard/messages`}
                  >
                    Message
                  </Link>
                  {selectedBooking.status === 'pending' && isProvider && (
                    <button
                      className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                      onClick={() => {
                        handleBookingAction(selectedBooking.id, 'confirm')
                        setShowDetailsModal(false)
                      }}
                    >
                      Confirm Booking
                    </button>
                  )}
                  {['pending', 'confirmed'].includes(selectedBooking.status) && (
                    <button
                      className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                      onClick={() => {
                        handleBookingAction(selectedBooking.id, 'cancel')
                        setShowDetailsModal(false)
                      }}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
