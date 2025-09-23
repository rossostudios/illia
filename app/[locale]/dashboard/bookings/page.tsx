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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  Grid3x3,
  Home,
  List,
  MapPin,
  MessageSquare,
  MoreVertical,
  Phone,
  RefreshCw,
  Search,
  Star,
  User,
  Video,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSessionContext } from '@/components/SessionProvider'
import { useToast } from '@/hooks/useToast'
import { createClient } from '@/lib/supabase/client'

interface Booking {
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
  recurring_pattern?: any
  special_instructions?: string
  location_details?: any
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
  es: es,
  pt: ptBR,
}

export default function BookingsPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const dateLocale = locales[locale as keyof typeof locales] || enUS
  const { user } = useSessionContext()
  const { success, error: showError, warning } = useToast()
  const supabase = createClient()

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
  }, [user])

  async function fetchBookings() {
    if (!user) return

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
    } catch (error) {
      console.error('Error fetching bookings:', error)
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
  const getBookingsForDate = (date: Date) => {
    return filteredBookings.filter((booking) => isSameDay(parseISO(booking.booking_date), date))
  }

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
      const updates: any = {}

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
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error)
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
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {isProvider ? 'Manage your service bookings' : 'View and manage your bookings'}
              </p>
            </div>
            <Link
              href={`/${locale}/dashboard/directory`}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              New Booking
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
              <p className="text-2xl font-semibold text-yellow-900 dark:text-yellow-100">
                {stats.pending}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-sm text-green-600 dark:text-green-400">Confirmed</p>
              <p className="text-2xl font-semibold text-green-900 dark:text-green-100">
                {stats.confirmed}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-sm text-blue-600 dark:text-blue-400">Revenue</p>
              <p className="text-2xl font-semibold text-blue-900 dark:text-blue-100">
                ${(stats.revenue / 100).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookings..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
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
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>

            {/* View Toggle */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${
                  view === 'list'
                    ? 'bg-white dark:bg-gray-800 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded ${
                  view === 'grid'
                    ? 'bg-white dark:bg-gray-800 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`p-2 rounded ${
                  view === 'calendar'
                    ? 'bg-white dark:bg-gray-800 shadow-sm'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-label="Calendar view"
              >
                <Calendar className="h-4 w-4" />
              </button>
            </div>

            {/* Export */}
            <button
              onClick={exportBookings}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
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
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {/* Date Block */}
                      <div className="text-center bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {format(parseISO(booking.booking_date), 'MMM')}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {format(parseISO(booking.booking_date), 'd')}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {format(parseISO(booking.booking_date), 'EEE')}
                        </p>
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {isProvider ? booking.user?.name : booking.provider?.name}
                            </h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.start_time} - {booking.end_time}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {booking.duration_minutes} min
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              statusColors[booking.status]
                            }`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {booking.status}
                          </span>
                        </div>

                        {/* Services */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {booking.service_type.map((service) => (
                            <span
                              key={service}
                              className="px-2 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded text-xs"
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                          onClick={() => handleBookingAction(booking.id, 'confirm')}
                          disabled={isActionLoading}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {isActionLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          ) : (
                            'Confirm'
                          )}
                        </button>
                      )}
                      {booking.status === 'confirmed' && isProvider && (
                        <button
                          onClick={() => handleBookingAction(booking.id, 'complete')}
                          disabled={isActionLoading}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {isActionLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          ) : (
                            'Complete'
                          )}
                        </button>
                      )}
                      {['pending', 'confirmed'].includes(booking.status) && (
                        <button
                          onClick={() => handleBookingAction(booking.id, 'cancel')}
                          disabled={isActionLoading}
                          className="px-3 py-1 border border-red-600 text-red-600 dark:border-red-400 dark:text-red-400 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        >
                          {isActionLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                          ) : (
                            'Cancel'
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => openBookingDetails(booking)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBookings.map((booking) => {
              const StatusIcon = statusIcons[booking.status]

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openBookingDetails(booking)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(parseISO(booking.booking_date), 'MMM d, yyyy')}
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {booking.start_time}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
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
                          key={service}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}
              </h3>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="bg-gray-50 dark:bg-gray-900 p-2 text-center text-xs font-medium text-gray-700 dark:text-gray-300"
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
                    key={index}
                    className={`bg-white dark:bg-gray-800 min-h-[80px] p-2 ${
                      !isCurrentMonth ? 'opacity-50' : ''
                    } ${isToday(day) ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {format(day, 'd')}
                    </p>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          onClick={() => openBookingDetails(booking)}
                          className="text-xs p-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded cursor-pointer hover:bg-teal-200 dark:hover:bg-teal-900/50 truncate"
                        >
                          {booking.start_time} -{' '}
                          {isProvider ? booking.user?.name : booking.provider?.name}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Booking Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                      statusColors[selectedBooking.status]
                    }`}
                  >
                    {React.createElement(statusIcons[selectedBooking.status], {
                      className: 'h-4 w-4',
                    })}
                    {selectedBooking.status.charAt(0).toUpperCase() +
                      selectedBooking.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Booking #{selectedBooking.id.slice(0, 8)}
                  </span>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(parseISO(selectedBooking.booking_date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time</p>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {selectedBooking.start_time} - {selectedBooking.end_time} (
                      {selectedBooking.duration_minutes} min)
                    </p>
                  </div>
                </div>

                {/* Provider/Client Info */}
                <div className="border-t dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {isProvider ? 'Client' : 'Service Provider'}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {(isProvider
                          ? selectedBooking.user?.name
                          : selectedBooking.provider?.name)?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {isProvider ? selectedBooking.user?.name : selectedBooking.provider?.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isProvider ? selectedBooking.user?.email : selectedBooking.provider?.email}
                      </p>
                    </div>
                  </div>
                  {selectedBooking.provider?.phone && (
                    <div className="flex items-center gap-4 mt-3">
                      <a
                        href={`tel:${selectedBooking.provider.phone}`}
                        className="text-sm text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline"
                      >
                        <Phone className="h-3 w-3" />
                        {selectedBooking.provider.phone}
                      </a>
                      {selectedBooking.provider.whatsapp && (
                        <a
                          href={`https://wa.me/${selectedBooking.provider.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 hover:underline"
                        >
                          <MessageSquare className="h-3 w-3" />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Services */}
                <div className="border-t dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.service_type.map((service) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="border-t dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Location</p>
                  <div className="flex items-start gap-2">
                    {selectedBooking.location_details?.type === 'virtual' ? (
                      <>
                        <Video className="h-4 w-4 mt-0.5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Virtual Meeting
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Link will be shared before the appointment
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedBooking.location_details?.type === 'user_address'
                              ? 'Your Address'
                              : "Provider's Location"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  <div className="border-t dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Special Instructions
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedBooking.special_instructions}
                    </p>
                  </div>
                )}

                {/* Pricing */}
                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                    <p className="text-2xl font-semibold text-teal-600 dark:text-teal-400">
                      ${(selectedBooking.total_amount / 100).toFixed(2)} {selectedBooking.currency}
                    </p>
                  </div>
                  {selectedBooking.cancellation_fee && selectedBooking.cancellation_fee > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-red-600 dark:text-red-400">Cancellation Fee</p>
                      <p className="text-lg font-medium text-red-600 dark:text-red-400">
                        ${(selectedBooking.cancellation_fee / 100).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Review (if completed) */}
                {selectedBooking.status === 'completed' && selectedBooking.booking_reviews?.[0] && (
                  <div className="border-t dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Review</p>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (selectedBooking.booking_reviews?.[0]?.rating || 0)
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-900 dark:text-white">
                      {selectedBooking.booking_reviews[0].review_text}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t dark:border-gray-700 pt-4 flex justify-end gap-3">
                  <Link
                    href={`/${locale}/dashboard/messages`}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Message
                  </Link>
                  {selectedBooking.status === 'pending' && isProvider && (
                    <button
                      onClick={() => {
                        handleBookingAction(selectedBooking.id, 'confirm')
                        setShowDetailsModal(false)
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Confirm Booking
                    </button>
                  )}
                  {['pending', 'confirmed'].includes(selectedBooking.status) && (
                    <button
                      onClick={() => {
                        handleBookingAction(selectedBooking.id, 'cancel')
                        setShowDetailsModal(false)
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
