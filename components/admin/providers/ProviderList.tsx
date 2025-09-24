'use client'

import { formatDistanceToNow } from 'date-fns'
import { Award, DollarSign, Eye, Mail, MapPin, Star, User } from 'lucide-react'
import { useState } from 'react'
import ProviderDetailModal from './ProviderDetailModal'

type ProviderListProps = {
  providers: any[]
  status: string
}

export default function ProviderList({ providers, status }: ProviderListProps) {
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const handleViewProvider = (provider: any) => {
    setSelectedProvider(provider)
    setShowModal(true)
  }

  const getAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) {
      return 0
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  if (providers.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
        <div className="text-gray-400 dark:text-gray-500">
          <User className="mx-auto mb-4 h-12 w-12" />
          <p className="font-medium text-lg">No {status} providers</p>
          <p className="mt-1 text-sm">
            {status === 'pending'
              ? 'No providers waiting for approval'
              : `No ${status} providers to display`}
          </p>
        </div>
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
                  Provider
                </th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Type</th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">
                  Location
                </th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Rate</th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Rating</th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Joined</th>
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr
                  className="border-gray-100 border-b last:border-0 dark:border-gray-700/50"
                  key={provider.id}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {provider.avatar_url ? (
                        <img
                          alt={provider.display_name || provider.username}
                          className="h-10 w-10 rounded-full object-cover"
                          src={provider.avatar_url}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                          <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {provider.display_name || provider.username}
                        </p>
                        <div className="flex items-center gap-2 text-gray-500 text-sm dark:text-gray-400">
                          <Mail className="h-3 w-3" />
                          {provider.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-purple-700 text-sm dark:bg-purple-900/20 dark:text-purple-300">
                      <Award className="h-3 w-3" />
                      {provider.provider_type || 'Standard'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-600 text-sm dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {provider.location || 'Not specified'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 font-medium text-gray-900 text-sm dark:text-white">
                      <DollarSign className="h-3 w-3" />
                      {provider.hourly_rate || 0}/hr
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="font-medium text-gray-900 text-sm dark:text-white">
                        {getAverageRating(provider.booking_reviews)}
                      </span>
                      <span className="text-gray-500 text-xs dark:text-gray-400">
                        ({provider.booking_reviews?.length || 0})
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-600 text-sm dark:text-gray-400">
                      {formatDistanceToNow(new Date(provider.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </td>
                  <td className="p-4">
                    <button
                      className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-purple-700"
                      onClick={() => handleViewProvider(provider)}
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedProvider && (
        <ProviderDetailModal
          onClose={() => {
            setShowModal(false)
            setSelectedProvider(null)
          }}
          provider={selectedProvider}
          status={status}
        />
      )}
    </>
  )
}
