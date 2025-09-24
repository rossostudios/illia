'use client'

import { format } from 'date-fns'
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  MessageSquare,
  MoreVertical,
  RefreshCw,
  User,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import BookingDetailModal from './BookingDetailModal'

type BookingManagementTableProps = {
  bookings: any[]
}

export default function BookingManagementTable({ bookings }: BookingManagementTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking)
    setShowModal(true)
    setOpenDropdown(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
      case 'confirmed':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock
      case 'confirmed':
        return Calendar
      case 'completed':
        return CheckCircle
      case 'cancelled':
        return XCircle
      default:
        return Calendar
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
        <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <p className="font-medium text-gray-900 text-lg dark:text-white">No bookings found</p>
        <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
          Bookings will appear here as they are created
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-gray-200 border-b dark:border-gray-700">
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">
                  Booking ID
                </th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">User</th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">
                  Provider
                </th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">
                  Date & Time
                </th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Status</th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Amount</th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status)

                return (
                  <tr
                    className="border-gray-100 border-b last:border-0 dark:border-gray-700/50"
                    key={booking.id}
                  >
                    <td className="p-4">
                      <p className="font-mono text-gray-900 text-sm dark:text-white">
                        {booking.id.slice(0, 8)}...
                      </p>
                      <p className="text-gray-500 text-xs dark:text-gray-400">
                        {format(new Date(booking.created_at), 'MMM d, yyyy')}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {booking.users?.avatar_url ? (
                          <img
                            alt={booking.users.display_name || booking.users.username}
                            className="h-8 w-8 rounded-full object-cover"
                            src={booking.users.avatar_url}
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                            <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm dark:text-white">
                            {booking.users?.display_name || booking.users?.username}
                          </p>
                          <p className="text-gray-500 text-xs dark:text-gray-400">
                            {booking.users?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {booking.providers?.avatar_url ? (
                          <img
                            alt={booking.providers.display_name || booking.providers.username}
                            className="h-8 w-8 rounded-full object-cover"
                            src={booking.providers.avatar_url}
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                            <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm dark:text-white">
                            {booking.providers?.display_name || booking.providers?.username}
                          </p>
                          <p className="text-gray-500 text-xs dark:text-gray-400">Provider</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 text-sm dark:text-white">
                          {format(new Date(booking.start_time), 'MMM d, yyyy')}
                        </p>
                        <p className="text-gray-500 text-xs dark:text-gray-400">
                          {format(new Date(booking.start_time), 'h:mm a')} -{' '}
                          {format(new Date(booking.end_time), 'h:mm a')}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium text-xs ${getStatusColor(booking.status)}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-medium text-gray-900 text-sm dark:text-white">
                        <DollarSign className="h-3 w-3" />
                        {booking.total_amount || 0}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <button
                          className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() =>
                            setOpenDropdown(openDropdown === booking.id ? null : booking.id)
                          }
                        >
                          <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>

                        {openDropdown === booking.id && (
                          <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                            <button
                              className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                              onClick={() => handleViewBooking(booking)}
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            <button className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                              <RefreshCw className="h-4 w-4" />
                              Change Status
                            </button>
                            <button className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                              <MessageSquare className="h-4 w-4" />
                              Contact User
                            </button>
                            <button className="flex w-full items-center gap-2 px-4 py-2 text-red-600 text-sm hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-800">
                              <XCircle className="h-4 w-4" />
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => {
            setShowModal(false)
            setSelectedBooking(null)
          }}
        />
      )}
    </>
  )
}
