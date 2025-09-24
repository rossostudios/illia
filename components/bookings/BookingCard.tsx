'use client'

import { format } from 'date-fns'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Star,
  Video,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { Booking } from '@/types/booking'
import { statusColors } from '@/types/booking'

type BookingCardProps = {
  booking: Booking
  viewMode: 'grid' | 'list'
  onAction: (bookingId: string, action: string) => void
}

const statusIconMap = {
  pending: Clock,
  confirmed: CheckCircle,
  cancelled: X,
  completed: Check,
  no_show: AlertCircle,
  rescheduled: RefreshCw,
}

export function BookingCard({ booking, viewMode, onAction }: BookingCardProps) {
  const StatusIcon = statusIconMap[booking.status]

  if (viewMode === 'list') {
    return (
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="border-gray-200 border-b bg-white p-4 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
        exit={{ opacity: 0, x: -20 }}
        initial={{ opacity: 0, x: -20 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Provider Photo */}
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image
                alt={booking.provider?.name || 'Provider'}
                className="rounded-full object-cover"
                fill
                sizes="48px"
                src={booking.provider?.photo_url || 'https://i.pravatar.cc/150?img=3'}
              />
            </div>

            {/* Booking Info */}
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 dark:text-white">
                  {booking.provider?.name || 'Provider'}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${statusColors[booking.status]}`}
                >
                  {booking.status}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-4 text-gray-600 text-sm dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {booking.start_time} - {booking.end_time}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {booking.total_amount} {booking.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {booking.status === 'pending' && (
              <>
                <Button onClick={() => onAction(booking.id, 'confirm')} size="sm" variant="default">
                  Confirm
                </Button>
                <Button onClick={() => onAction(booking.id, 'cancel')} size="sm" variant="outline">
                  Cancel
                </Button>
              </>
            )}
            {booking.status === 'confirmed' && (
              <>
                <Button onClick={() => onAction(booking.id, 'message')} size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => onAction(booking.id, 'reschedule')}
                  size="sm"
                  variant="outline"
                >
                  Reschedule
                </Button>
              </>
            )}
            {booking.status === 'completed' && !booking.booking_reviews?.length && (
              <Button onClick={() => onAction(booking.id, 'review')} size="sm" variant="default">
                <Star className="mr-1 h-4 w-4" />
                Review
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
      exit={{ opacity: 0, scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.95 }}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative h-12 w-12">
            <Image
              alt={booking.provider?.name || 'Provider'}
              className="rounded-full object-cover"
              fill
              sizes="48px"
              src={booking.provider?.photo_url || 'https://i.pravatar.cc/150?img=3'}
            />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{booking.provider?.name}</p>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              {booking.service_type.join(', ')}
            </p>
          </div>
        </div>
        <span
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs ${statusColors[booking.status]}`}
        >
          <StatusIcon className="h-3 w-3" />
          {booking.status}
        </span>
      </div>

      {/* Details */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(booking.booking_date), 'EEEE, MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>
            {booking.start_time} - {booking.end_time} ({booking.duration_minutes} mins)
          </span>
        </div>
        {booking.location_details && (
          <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>At your location</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium">
            {booking.total_amount} {booking.currency}
          </span>
        </div>
      </div>

      {/* Special Instructions */}
      {booking.special_instructions && (
        <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <p className="text-gray-600 text-sm dark:text-gray-400">{booking.special_instructions}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {booking.status === 'pending' && (
          <>
            <Button
              className="flex-1"
              onClick={() => onAction(booking.id, 'confirm')}
              variant="default"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm
            </Button>
            <Button
              className="flex-1"
              onClick={() => onAction(booking.id, 'cancel')}
              variant="outline"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </>
        )}

        {booking.status === 'confirmed' && (
          <>
            {booking.provider?.phone && (
              <Button
                className="flex-1"
                onClick={() => onAction(booking.id, 'call')}
                variant="outline"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={() => onAction(booking.id, 'message')}
              variant="outline"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
          </>
        )}

        {booking.status === 'completed' && (
          <>
            {booking.booking_reviews?.length ? (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    className={`h-4 w-4 ${
                      i < (booking.booking_reviews?.[0]?.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    key={i}
                  />
                ))}
                <span className="ml-2 text-gray-600 text-sm dark:text-gray-400">Reviewed</span>
              </div>
            ) : (
              <Button
                className="flex-1"
                onClick={() => onAction(booking.id, 'review')}
                variant="default"
              >
                <Star className="mr-2 h-4 w-4" />
                Leave Review
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={() => onAction(booking.id, 'rebook')}
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Book Again
            </Button>
          </>
        )}
      </div>
    </motion.div>
  )
}
