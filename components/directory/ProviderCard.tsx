'use client'

import { motion } from 'framer-motion'
import { Award, Clock, DollarSign, Globe, MapPin, Star } from 'lucide-react'
import Image from 'next/image'
import type { Provider } from '@/data/mock-providers'

type ProviderCardProps = {
  provider: Provider
  viewMode: 'grid' | 'table'
  onClick: () => void
}

export function ProviderCard({ provider, viewMode, onClick }: ProviderCardProps) {
  if (viewMode === 'table') {
    return (
      <motion.tr
        animate={{ opacity: 1 }}
        className="cursor-pointer border-gray-100 border-b transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={onClick}
      >
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                alt={provider.name}
                className="rounded-full object-cover"
                fill
                sizes="40px"
                src={provider.photo}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 dark:text-white">{provider.name}</p>
                {provider.verified && (
                  <Award className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <p className="text-gray-500 text-sm dark:text-gray-400">{provider.service}</p>
            </div>
          </div>
        </td>
        <td className="hidden px-6 py-4 lg:table-cell">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 text-sm dark:text-gray-400">{provider.location}</span>
          </div>
        </td>
        <td className="hidden px-6 py-4 sm:table-cell">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-gray-900 text-sm dark:text-white">{provider.rating}</span>
            <span className="text-gray-500 text-sm dark:text-gray-400">({provider.reviews})</span>
          </div>
        </td>
        <td className="px-6 py-4 text-right">
          <p className="font-semibold text-gray-900 dark:text-white">{provider.rate}</p>
        </td>
      </motion.tr>
    )
  }

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
      exit={{ opacity: 0, scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
    >
      {/* Header with Photo */}
      <div className="relative h-48 bg-gradient-to-br from-teal-400 to-blue-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 right-4">
          {provider.verified && (
            <div className="rounded-full bg-blue-500 p-2">
              <Award className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="relative h-20 w-20 rounded-full border-4 border-white shadow-lg">
            <Image
              alt={provider.name}
              className="rounded-full object-cover"
              fill
              sizes="80px"
              src={provider.photo}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg dark:text-white">{provider.name}</h3>
          <p className="text-gray-600 text-sm dark:text-gray-400">{provider.service}</p>
        </div>

        <p className="mb-4 line-clamp-2 text-gray-600 text-sm dark:text-gray-400">{provider.bio}</p>

        {/* Stats Grid */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 text-sm dark:text-gray-400">{provider.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900 text-sm dark:text-white">
              {provider.rate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-gray-600 text-sm dark:text-gray-400">
              {provider.rating} ({provider.reviews})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 text-sm dark:text-gray-400">
              {provider.responseTime}
            </span>
          </div>
        </div>

        {/* Languages */}
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-400" />
          <div className="flex flex-wrap gap-1">
            {provider.languages.map((lang) => (
              <span
                className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 text-xs dark:bg-gray-800 dark:text-gray-400"
                key={lang}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1">
          {provider.specialties.slice(0, 3).map((specialty) => (
            <span
              className="rounded-full bg-teal-50 px-2 py-0.5 text-teal-600 text-xs dark:bg-teal-900/20 dark:text-teal-400"
              key={specialty}
            >
              {specialty}
            </span>
          ))}
          {provider.specialties.length > 3 && (
            <span className="text-gray-500 text-xs dark:text-gray-400">
              +{provider.specialties.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
