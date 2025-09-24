'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  DollarSign,
  Mail,
  MapPin,
  Star,
  User,
  X,
  XCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Database } from '@/lib/database.types'

type ProviderDetailModalProps = {
  provider: any
  status: string
  onClose: () => void
}

export default function ProviderDetailModal({
  provider,
  status,
  onClose,
}: ProviderDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleApprove = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.rpc('approve_provider', {
        provider_uuid: provider.id,
        admin_notes: 'Approved via admin panel',
      })

      if (error) {
        throw error
      }

      alert('Provider approved successfully!')
      router.refresh()
      onClose()
    } catch (_error) {
      alert('Failed to approve provider')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.rpc('reject_provider', {
        provider_uuid: provider.id,
        reason,
      })

      if (error) {
        throw error
      }

      alert('Provider rejected successfully!')
      router.refresh()
      onClose()
    } catch (_error) {
      alert('Failed to reject provider')
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for suspension')
      return
    }

    setLoading(true)
    try {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single()

      if (!adminUser) {
        throw new Error('Admin user not found')
      }

      const { error } = await supabase
        .from('users')
        .update({
          approval_status: 'suspended',
          suspended_at: new Date().toISOString(),
          suspended_reason: reason,
          suspended_by: adminUser.id,
        })
        .eq('id', provider.id)

      if (error) {
        throw error
      }

      alert('Provider suspended successfully!')
      router.refresh()
      onClose()
    } catch (_error) {
      alert('Failed to suspend provider')
    } finally {
      setLoading(false)
    }
  }

  const handleReactivate = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          approval_status: 'approved',
          suspended_at: null,
          suspended_reason: null,
          suspended_by: null,
        })
        .eq('id', provider.id)

      if (error) {
        throw error
      }

      alert('Provider reactivated successfully!')
      router.refresh()
      onClose()
    } catch (_error) {
      alert('Failed to reactivate provider')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-gray-200 border-b p-6 dark:border-gray-700">
          <h2 className="font-bold text-gray-900 text-xl dark:text-white">Provider Details</h2>
          <button
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] space-y-6 overflow-y-auto p-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {status === 'pending' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 font-medium text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">
                <AlertCircle className="h-4 w-4" />
                Pending Approval
              </span>
            )}
            {status === 'approved' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 text-sm dark:bg-green-900/20 dark:text-green-300">
                <CheckCircle className="h-4 w-4" />
                Approved
              </span>
            )}
            {status === 'rejected' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 font-medium text-red-700 text-sm dark:bg-red-900/20 dark:text-red-300">
                <XCircle className="h-4 w-4" />
                Rejected
              </span>
            )}
            {status === 'suspended' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 font-medium text-orange-700 text-sm dark:bg-orange-900/20 dark:text-orange-300">
                <AlertCircle className="h-4 w-4" />
                Suspended
              </span>
            )}
          </div>

          {/* Provider Info */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 font-medium text-gray-500 text-sm dark:text-gray-400">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {provider.avatar_url ? (
                    <img
                      alt={provider.display_name || provider.username}
                      className="h-16 w-16 rounded-full object-cover"
                      src={provider.avatar_url}
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                      <User className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {provider.display_name || provider.username}
                    </p>
                    <p className="text-gray-500 text-sm dark:text-gray-400">@{provider.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  {provider.email}
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  {provider.location || 'Not specified'}
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  Joined {format(new Date(provider.created_at), 'MMM d, yyyy')}
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-medium text-gray-500 text-sm dark:text-gray-400">
                Provider Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-sm dark:text-gray-400">Type:</span>
                  <span className="font-medium text-gray-900 text-sm dark:text-white">
                    {provider.provider_type || 'Standard'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-sm dark:text-gray-400">Hourly Rate:</span>
                  <span className="font-medium text-gray-900 text-sm dark:text-white">
                    ${provider.hourly_rate || 0}/hr
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-sm dark:text-gray-400">Rating:</span>
                  <span className="font-medium text-gray-900 text-sm dark:text-white">
                    {provider.booking_reviews?.length > 0
                      ? `${(
                          provider.booking_reviews.reduce(
                            (acc: number, r: any) => acc + r.rating,
                            0
                          ) / provider.booking_reviews.length
                        ).toFixed(1)} (${provider.booking_reviews.length} reviews)`
                      : 'No reviews yet'}
                  </span>
                </div>

                {provider.specialties && provider.specialties.length > 0 && (
                  <div>
                    <p className="mb-2 text-gray-600 text-sm dark:text-gray-400">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {provider.specialties.map((specialty: string) => (
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
              </div>
            </div>
          </div>

          {/* Bio */}
          {provider.bio && (
            <div>
              <h3 className="mb-2 font-medium text-gray-500 text-sm dark:text-gray-400">Bio</h3>
              <p className="rounded-lg bg-gray-50 p-3 text-gray-700 text-sm dark:bg-gray-700/50 dark:text-gray-300">
                {provider.bio}
              </p>
            </div>
          )}

          {/* Rejection/Suspension Reason */}
          {provider.rejection_reason && status === 'rejected' && (
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <p className="mb-1 font-medium text-red-800 text-sm dark:text-red-200">
                Rejection Reason
              </p>
              <p className="text-red-600 text-sm dark:text-red-300">{provider.rejection_reason}</p>
            </div>
          )}

          {provider.suspended_reason && status === 'suspended' && (
            <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
              <p className="mb-1 font-medium text-orange-800 text-sm dark:text-orange-200">
                Suspension Reason
              </p>
              <p className="text-orange-600 text-sm dark:text-orange-300">
                {provider.suspended_reason}
              </p>
              <p className="mt-2 text-orange-500 text-xs dark:text-orange-400">
                Suspended on {format(new Date(provider.suspended_at), 'MMM d, yyyy')}
              </p>
            </div>
          )}

          {/* Action Input */}
          {(status === 'pending' || (status === 'approved' && !provider.suspended_at)) && (
            <div>
              <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                {status === 'pending' ? 'Rejection Reason (if rejecting)' : 'Suspension Reason'}
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  status === 'pending'
                    ? 'Enter reason for rejection (required if rejecting)'
                    : 'Enter reason for suspension (required)'
                }
                rows={3}
                value={reason}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-gray-200 border-t p-6 dark:border-gray-700">
          <div className="flex justify-end gap-3">
            <button
              className="rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              Close
            </button>

            {status === 'pending' && (
              <>
                <button
                  className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  disabled={loading}
                  onClick={handleReject}
                >
                  Reject
                </button>
                <button
                  className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                  disabled={loading}
                  onClick={handleApprove}
                >
                  Approve
                </button>
              </>
            )}

            {status === 'approved' && !provider.suspended_at && (
              <button
                className="rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
                disabled={loading}
                onClick={handleSuspend}
              >
                Suspend
              </button>
            )}

            {status === 'suspended' && (
              <button
                className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
                onClick={handleReactivate}
              >
                Reactivate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
