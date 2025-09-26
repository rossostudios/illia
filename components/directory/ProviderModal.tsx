'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  Clock,
  DollarSign,
  Globe,
  Heart,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { Provider } from '@/data/mock-providers'

type ProviderModalProps = {
  provider: Provider | null
  isOpen: boolean
  onClose: () => void
  onContact: (provider: Provider) => void
  onSave: (provider: Provider) => void
}

export function ProviderModal({
  provider,
  isOpen,
  onClose,
  onContact,
  onSave,
}: ProviderModalProps) {
  if (!provider) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-gray-900"
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-br from-teal-400 to-blue-500">
              <Button
                className="absolute top-4 right-4 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/30"
                onClick={onClose}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            </div>

            {/* Profile Photo */}
            <div className="-mt-12 px-6">
              <div className="relative h-24 w-24 rounded-full border-4 border-white shadow-lg dark:border-gray-900">
                <Image
                  alt={provider.name}
                  className="rounded-full object-cover"
                  fill
                  sizes="96px"
                  src={provider.photo}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
                      {provider.name}
                    </h2>
                    {provider.verified && (
                      <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 dark:bg-blue-900/20">
                        <Award className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-600 text-xs dark:text-blue-400">Verified</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{provider.service}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {provider.rating}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    ({provider.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">About</h3>
                <p className="text-gray-600 dark:text-gray-400">{provider.bio}</p>
              </div>

              {/* Details Grid */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 text-sm dark:text-gray-400">Location</span>
                  </div>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">
                    {provider.location}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 text-sm dark:text-gray-400">Rate</span>
                  </div>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">{provider.rate}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 text-sm dark:text-gray-400">Response Time</span>
                  </div>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">
                    {provider.responseTime}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 text-sm dark:text-gray-400">Languages</span>
                  </div>
                  <p className="mt-1 font-medium text-gray-900 dark:text-white">
                    {provider.languages.join(', ')}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mb-6 space-y-4">
                <div>
                  <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Experience</h4>
                  <p className="text-gray-600 dark:text-gray-400">{provider.experience}</p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Availability</h4>
                  <p className="text-gray-600 dark:text-gray-400">{provider.availability}</p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.specialties.map((specialty) => (
                      <span
                        className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
                        key={specialty}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => onContact(provider)} variant="primary">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Provider
                </Button>
                <Button onClick={() => onSave(provider)} variant="outline">
                  <Heart className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button disabled variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
