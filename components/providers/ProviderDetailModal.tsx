'use client'

import {
  Briefcase,
  Check,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  Star,
  X,
} from 'lucide-react'
import { useState } from 'react'
import type { Database } from '@/types/database'

type ServiceProvider = Database['public']['Tables']['service_providers']['Row']

type ProviderDetailModalProps = {
  provider: ServiceProvider | null
  isOpen: boolean
  onClose: () => void
  onContact: (provider: ServiceProvider) => void
  onSave: (provider: ServiceProvider) => void
}

export function ProviderDetailModal({
  provider,
  isOpen,
  onClose,
  onContact,
  onSave,
}: ProviderDetailModalProps) {
  const [isSaved, setIsSaved] = useState(false)

  if (!(isOpen && provider)) {
    return null
  }

  const handleSave = async () => {
    await onSave(provider)
    setIsSaved(true)
  }

  const handleClose = () => {
    setIsSaved(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        aria-label="Close modal"
        className="fixed inset-0 z-[9998] bg-black/50 transition-opacity"
        onClick={handleClose}
        type="button"
      />

      {/* Modal */}
      <div className="relative z-[9999] flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex-shrink-0 border-gray-200 border-b px-6 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-xl dark:text-white">
              Provider Details
            </h2>
            <button
              className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={handleClose}
              type="button"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Provider Header */}
          <div className="mb-6 flex items-start gap-4">
            <div className="relative">
              <img
                alt={provider.name || 'Provider'}
                className="h-20 w-20 rounded-full object-cover"
                height={80}
                src={provider.avatar_url || `https://i.pravatar.cc/150?u=${provider.id}`}
                width={80}
              />
              {provider.status === 'verified' && (
                <Shield className="-bottom-1 -right-1 absolute h-6 w-6 rounded-full bg-white p-1 text-teal-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                {provider.name}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
                {provider.rating_avg && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span>{provider.rating_avg.toFixed(1)}</span>
                    {provider.reviews_count && <span>({provider.reviews_count} reviews)</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">About</h4>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              {provider.bio || 'No bio available'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {provider.city || 'Location not specified'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {provider.years_experience
                  ? `${provider.years_experience} years experience`
                  : 'Experience not specified'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {provider.hourly_rate ? `$${provider.hourly_rate}/hour` : 'Rate negotiable'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {provider.services?.join(', ') || 'Various services'}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6 space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Contact</h4>

            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {provider.email || 'Email not available'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {provider.phone || 'Phone not available'}
              </span>
            </div>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {provider.languages && provider.languages.length > 0 ? (
                provider.languages.map((lang: string) => (
                  <span
                    className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 text-xs dark:bg-gray-800 dark:text-gray-300"
                    key={lang}
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm dark:text-gray-400">Not specified</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 border-gray-200 border-t px-6 py-4 dark:border-gray-700">
          <div className="flex gap-3">
            <button
              className="flex-1 rounded-lg bg-teal-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-teal-700"
              onClick={() => onContact(provider)}
              type="button"
            >
              <MessageSquare className="mr-2 inline h-4 w-4" />
              Contact Provider
            </button>
            <button
              className={`flex-1 rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                isSaved
                  ? 'cursor-default bg-green-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
              disabled={isSaved}
              onClick={isSaved ? undefined : handleSave}
              type="button"
            >
              {isSaved ? (
                <>
                  <Check className="mr-2 inline h-4 w-4" />
                  Saved to Matches
                </>
              ) : (
                'Save to Matches'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
