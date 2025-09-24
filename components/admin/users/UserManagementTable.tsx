'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  Award,
  Ban,
  Eye,
  Mail,
  MapPin,
  MoreVertical,
  Shield,
  Star,
  Trash2,
  User,
} from 'lucide-react'
import { useState } from 'react'
import UserDetailModal from './UserDetailModal'

type UserManagementTableProps = {
  users: any[]
}

export default function UserManagementTable({ users }: UserManagementTableProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setShowModal(true)
    setOpenDropdown(null)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'basic':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
  }

  const getAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) {
      return null
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
        <User className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <p className="font-medium text-gray-900 text-lg dark:text-white">No users found</p>
        <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">Try adjusting your filters</p>
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
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">User</th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Type</th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Tier</th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">
                  Location
                </th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">
                  Activity
                </th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Joined</th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  className={`border-gray-100 border-b last:border-0 dark:border-gray-700/50 ${
                    user.is_deleted ? 'opacity-50' : ''
                  }`}
                  key={user.id}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img
                          alt={user.display_name || user.username}
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar_url}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                          <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.display_name || user.username}
                        </p>
                        <div className="flex items-center gap-2 text-gray-500 text-sm dark:text-gray-400">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                      {user.is_deleted && (
                        <span className="rounded bg-red-100 px-2 py-0.5 font-medium text-red-700 text-xs dark:bg-red-900/20 dark:text-red-300">
                          Deleted
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {user.is_provider ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-purple-700 text-sm dark:bg-purple-900/20 dark:text-purple-300">
                        <Award className="h-3 w-3" />
                        Provider
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-gray-700 text-sm dark:bg-gray-700 dark:text-gray-300">
                        <User className="h-3 w-3" />
                        User
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2 py-1 font-medium text-xs ${getTierColor(user.tier || 'free')}`}
                    >
                      {(user.tier || 'free').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-600 text-sm dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {user.location || 'Not specified'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {user.is_provider && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-current text-yellow-400" />
                          <span className="text-gray-900 dark:text-white">
                            {getAverageRating(user.booking_reviews) || 'N/A'}
                          </span>
                        </div>
                      )}
                      <p className="text-gray-500 text-xs dark:text-gray-400">
                        {user.bookings?.length || 0} bookings
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-600 text-sm dark:text-gray-400">
                      {formatDistanceToNow(new Date(user.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="relative">
                      <button
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                        type="button"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>

                      {openDropdown === user.id && (
                        <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                          <button
                            className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                            onClick={() => handleViewUser(user)}
                            type="button"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                          <button
                            className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                            type="button"
                          >
                            <Shield className="h-4 w-4" />
                            Make Admin
                          </button>
                          <button
                            className="flex w-full items-center gap-2 px-4 py-2 text-orange-600 text-sm hover:bg-gray-50 dark:text-orange-400 dark:hover:bg-gray-800"
                            type="button"
                          >
                            <Ban className="h-4 w-4" />
                            Suspend Account
                          </button>
                          <button
                            className="flex w-full items-center gap-2 px-4 py-2 text-red-600 text-sm hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-800"
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedUser && (
        <UserDetailModal
          onClose={() => {
            setShowModal(false)
            setSelectedUser(null)
          }}
          user={selectedUser}
        />
      )}
    </>
  )
}
