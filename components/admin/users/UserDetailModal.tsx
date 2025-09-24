'use client'

import { format } from 'date-fns'
import {
  Activity,
  Award,
  Ban,
  Calendar,
  DollarSign,
  Mail,
  MapPin,
  Shield,
  Star,
  User,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type UserDetailModalProps = {
  user: any
  onClose: () => void
}

export default function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSuspendUser = async () => {
    if (!confirm('Are you sure you want to suspend this user?')) {
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('users').update({ is_deleted: true }).eq('id', user.id)

      if (error) {
        throw error
      }

      alert('User suspended successfully!')
      router.refresh()
      onClose()
    } catch (_error) {
      alert('Failed to suspend user')
    } finally {
      setLoading(false)
    }
  }

  const handleMakeAdmin = async () => {
    if (!confirm('Are you sure you want to make this user an admin?')) {
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('admin_users').insert({
        user_id: user.id,
        role: 'moderator',
      })

      if (error) {
        throw error
      }

      alert('User is now an admin!')
      router.refresh()
      onClose()
    } catch (_error) {
      alert('Failed to make user admin')
    } finally {
      setLoading(false)
    }
  }

  const handleChangeTier = async (newTier: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.from('users').update({ tier: newTier }).eq('id', user.id)

      if (error) {
        throw error
      }

      alert(`User tier changed to ${newTier}!`)
      router.refresh()
      onClose()
    } catch (_error) {
      alert('Failed to change tier')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-gray-200 border-b p-6 dark:border-gray-700">
          <h2 className="font-bold text-gray-900 text-xl dark:text-white">User Details</h2>
          <button
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] space-y-6 overflow-y-auto p-6">
          {/* User Info */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 font-medium text-gray-500 text-sm dark:text-gray-400">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img
                      alt={user.display_name || user.username}
                      className="h-16 w-16 rounded-full object-cover"
                      src={user.avatar_url}
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                      <User className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user.display_name || user.username}
                    </p>
                    <p className="text-gray-500 text-sm dark:text-gray-400">@{user.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  {user.location || 'Not specified'}
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  Joined {format(new Date(user.created_at), 'MMM d, yyyy')}
                </div>

                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-sm dark:text-gray-400">Tier:</span>
                  <select
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    onChange={(e) => handleChangeTier(e.target.value)}
                    value={user.tier || 'free'}
                  >
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-medium text-gray-500 text-sm dark:text-gray-400">
                Account Statistics
              </h3>
              <div className="space-y-3">
                {user.is_provider && (
                  <>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 text-sm dark:text-gray-400">
                        Provider Type:
                      </span>
                      <span className="font-medium text-gray-900 text-sm dark:text-white">
                        {user.provider_type || 'Standard'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 text-sm dark:text-gray-400">Hourly Rate:</span>
                      <span className="font-medium text-gray-900 text-sm dark:text-white">
                        ${user.hourly_rate || 0}/hr
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 text-sm dark:text-gray-400">Rating:</span>
                      <span className="font-medium text-gray-900 text-sm dark:text-white">
                        {user.booking_reviews?.length > 0
                          ? `${(
                              user.booking_reviews.reduce(
                                (acc: number, r: any) => acc + r.rating,
                                0
                              ) / user.booking_reviews.length
                            ).toFixed(1)} (${user.booking_reviews.length} reviews)`
                          : 'No reviews yet'}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-sm dark:text-gray-400">Total Bookings:</span>
                  <span className="font-medium text-gray-900 text-sm dark:text-white">
                    {user.bookings?.length || 0}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-sm dark:text-gray-400">Last Active:</span>
                  <span className="font-medium text-gray-900 text-sm dark:text-white">
                    {user.last_active_at
                      ? format(new Date(user.last_active_at), 'MMM d, yyyy')
                      : 'Never'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-sm dark:text-gray-400">Account Status:</span>
                  <span
                    className={`font-medium text-sm ${
                      user.is_deleted
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}
                  >
                    {user.is_deleted ? 'Suspended' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div>
              <h3 className="mb-2 font-medium text-gray-500 text-sm dark:text-gray-400">Bio</h3>
              <p className="rounded-lg bg-gray-50 p-3 text-gray-700 text-sm dark:bg-gray-700/50 dark:text-gray-300">
                {user.bio}
              </p>
            </div>
          )}

          {/* Specialties */}
          {user.is_provider && user.specialties && user.specialties.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-gray-500 text-sm dark:text-gray-400">
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.specialties.map((specialty: string) => (
                  <span
                    className="rounded-full bg-purple-100 px-2 py-1 text-purple-700 text-xs dark:bg-purple-900/20 dark:text-purple-300"
                    key={specialty}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div>
            <h3 className="mb-3 font-medium text-gray-500 text-sm dark:text-gray-400">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-lg bg-purple-100 px-3 py-1.5 font-medium text-purple-700 text-sm transition-colors hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30"
                type="button"
              >
                View Bookings
              </button>
              <button
                className="rounded-lg bg-purple-100 px-3 py-1.5 font-medium text-purple-700 text-sm transition-colors hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30"
                type="button"
              >
                View Reviews
              </button>
              <button
                className="rounded-lg bg-purple-100 px-3 py-1.5 font-medium text-purple-700 text-sm transition-colors hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30"
                type="button"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-gray-200 border-t p-6 dark:border-gray-700">
          <div className="flex justify-between">
            <div className="flex gap-2">
              {!user.is_deleted && (
                <>
                  <button
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                    disabled={loading}
                    onClick={handleMakeAdmin}
                    type="button"
                  >
                    <Shield className="h-4 w-4" />
                    Make Admin
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
                    disabled={loading}
                    onClick={handleSuspendUser}
                    type="button"
                  >
                    <Ban className="h-4 w-4" />
                    Suspend
                  </button>
                </>
              )}
            </div>

            <button
              className="rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
