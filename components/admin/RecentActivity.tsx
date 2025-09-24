'use client'

import { formatDistanceToNow } from 'date-fns'
import { Calendar, User, UserCheck } from 'lucide-react'

type RecentActivityProps = {
  users: any[]
  bookings: any[]
  providers: any[]
}

export default function RecentActivity({ users, bookings, providers }: RecentActivityProps) {
  return (
    <div className="space-y-6">
      {/* Recent Users */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="border-gray-200 border-b p-6 dark:border-gray-700">
          <h2 className="flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-white">
            <User className="h-5 w-5" />
            Recent Users
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {users?.map((user) => (
              <div
                className="flex items-center justify-between border-gray-100 border-b py-3 last:border-0 dark:border-gray-700"
                key={user.id}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.display_name || user.username}
                    </p>
                    <p className="text-gray-500 text-sm dark:text-gray-400">
                      {user.is_provider ? 'Provider' : 'User'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="border-gray-200 border-b p-6 dark:border-gray-700">
          <h2 className="flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-white">
            <Calendar className="h-5 w-5" />
            Recent Bookings
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {bookings?.map((booking) => (
              <div
                className="flex items-center justify-between border-gray-100 border-b py-3 last:border-0 dark:border-gray-700"
                key={booking.id}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      booking.status === 'completed'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}
                  >
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.users?.display_name || booking.users?.username} →{' '}
                      {booking.providers?.display_name || booking.providers?.username}
                    </p>
                    <p className="text-gray-500 text-sm dark:text-gray-400">
                      Status: {booking.status}
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Providers */}
      {providers && providers.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="border-gray-200 border-b p-6 dark:border-gray-700">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-white">
              <UserCheck className="h-5 w-5" />
              Pending Provider Approvals
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {providers.map((provider) => (
                <div
                  className="flex items-center justify-between border-gray-100 border-b py-3 last:border-0 dark:border-gray-700"
                  key={provider.id}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                      <UserCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {provider.display_name || provider.username}
                      </p>
                      <p className="text-gray-500 text-sm dark:text-gray-400">Awaiting approval</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm dark:text-gray-400">
                    {formatDistanceToNow(new Date(provider.created_at), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
