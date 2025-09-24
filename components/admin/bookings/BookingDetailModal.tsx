'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  Star,
  User,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Database } from '@/lib/database.types'

type BookingDetailModalProps = {
  booking: any
  onClose: () => void
}

export default function BookingDetailModal({ booking, onClose }: BookingDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [newStatus, setNewStatus] = useState(booking.status)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleStatusChange = async () => {
    if (newStatus === booking.status) {
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', booking.id)

      if (error) {
        throw error
      }

      // Log the status change
      await supabase.from('booking_status_history').insert({
        booking_id: booking.id,
        old_status: booking.status,
        new_status: newStatus,
        changed_by: (await supabase.auth.getUser()).data.user?.id,
      })

      alert('Booking status updated successfully!')
      router.refresh()
      onClose()
    } catch (_error) {
      alert('Failed to update booking status')
    } finally {
      setLoading(false)
    }
  }

  const _getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'confirmed':
        return 'text-blue-600 dark:text-blue-400'
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'cancelled':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-gray-200 border-b p-6 dark:border-gray-700">
          <div>
            <h2 className="font-bold text-gray-900 text-xl dark:text-white">Booking Details</h2>
            <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
              ID: {booking.id.slice(0, 8)}...
            </p>
          </div>
          <button
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] space-y-6 overflow-y-auto p-6">
          {/* Status */}
          <div>
            <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
              Booking Status
            </label>
            <div className="flex items-center gap-3">
              <select
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                onChange={(e) => setNewStatus(e.target.value)}
                value={newStatus}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {newStatus !== booking.status && (
                <button
                  className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                  disabled={loading}
                  onClick={handleStatusChange}
                >
                  Update Status
                </button>
              )}
            </div>
          </div>

          {/* User and Provider */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* User Info */}
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
              <h3 className="mb-3 font-medium text-gray-700 text-sm dark:text-gray-300">
                User Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {booking.users?.avatar_url ? (
                    <img
                      alt={booking.users.display_name || booking.users.username}
                      className="h-10 w-10 rounded-full object-cover"
                      src={booking.users.avatar_url}
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                      <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.users?.display_name || booking.users?.username}
                    </p>
                    <p className="text-gray-500 text-sm dark:text-gray-400">
                      {booking.users?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Info */}
            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
              <h3 className="mb-3 font-medium text-gray-700 text-sm dark:text-gray-300">
                Provider Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {booking.providers?.avatar_url ? (
                    <img
                      alt={booking.providers.display_name || booking.providers.username}
                      className="h-10 w-10 rounded-full object-cover"
                      src={booking.providers.avatar_url}
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-800">
                      <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.providers?.display_name || booking.providers?.username}
                    </p>
                    <p className="text-gray-500 text-sm dark:text-gray-400">
                      {booking.providers?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-3 font-medium text-gray-700 text-sm dark:text-gray-300">
              Booking Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-500 text-xs dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 text-sm dark:text-white">
                    {format(new Date(booking.start_time), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-500 text-xs dark:text-gray-400">Time</p>
                  <p className="font-medium text-gray-900 text-sm dark:text-white">
                    {format(new Date(booking.start_time), 'h:mm a')} -{' '}
                    {format(new Date(booking.end_time), 'h:mm a')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-500 text-xs dark:text-gray-400">Total Amount</p>
                  <p className="font-medium text-gray-900 text-sm dark:text-white">
                    ${booking.total_amount || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-500 text-xs dark:text-gray-400">Location</p>
                  <p className="font-medium text-gray-900 text-sm dark:text-white">
                    {booking.location || 'Virtual'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div>
              <h3 className="mb-2 font-medium text-gray-700 text-sm dark:text-gray-300">
                Booking Notes
              </h3>
              <p className="rounded-lg bg-gray-50 p-3 text-gray-700 text-sm dark:bg-gray-700/50 dark:text-gray-300">
                {booking.notes}
              </p>
            </div>
          )}

          {/* Review */}
          {booking.booking_reviews && booking.booking_reviews.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-gray-700 text-sm dark:text-gray-300">Review</h3>
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                <div className="mb-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      className={`h-4 w-4 ${
                        star <= booking.booking_reviews[0].rating
                          ? 'fill-current text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      key={star}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm dark:text-gray-400">
                    ({booking.booking_reviews[0].rating}/5)
                  </span>
                </div>
                {booking.booking_reviews[0].comment && (
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    {booking.booking_reviews[0].comment}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Cancellation Info */}
          {booking.status === 'cancelled' && booking.cancellation_reason && (
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <p className="mb-1 font-medium text-red-800 text-sm dark:text-red-200">
                Cancellation Reason
              </p>
              <p className="text-red-600 text-sm dark:text-red-300">
                {booking.cancellation_reason}
              </p>
              {booking.cancelled_at && (
                <p className="mt-2 text-red-500 text-xs dark:text-red-400">
                  Cancelled on {format(new Date(booking.cancelled_at), 'MMM d, yyyy h:mm a')}
                </p>
              )}
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="mb-3 font-medium text-gray-700 text-sm dark:text-gray-300">Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span className="text-gray-900 dark:text-white">
                  {format(new Date(booking.created_at), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              {booking.updated_at !== booking.created_at && (
                <div className="flex items-center gap-3 text-sm">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Last updated:</span>
                  <span className="text-gray-900 dark:text-white">
                    {format(new Date(booking.updated_at), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-gray-200 border-t p-6 dark:border-gray-700">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <button className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700">
                <MessageSquare className="mr-2 inline h-4 w-4" />
                Contact User
              </button>
              <button className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700">
                <MessageSquare className="mr-2 inline h-4 w-4" />
                Contact Provider
              </button>
            </div>

            <button
              className="rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
