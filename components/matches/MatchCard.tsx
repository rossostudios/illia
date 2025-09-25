'use client'

import { format, formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import {
  Archive,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  Star,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { Match } from './types'

type MatchCardProps = {
  match: Match
  viewMode: 'card' | 'list'
  onAction: (matchId: string, action: string) => void
  onClick: () => void
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  contacted: {
    label: 'Contacted',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  viewed: {
    label: 'Viewed',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  },
  hired: {
    label: 'Hired',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
  dismissed: {
    label: 'Dismissed',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  },
}

const statusIconMap = {
  pending: Clock,
  contacted: MessageSquare,
  viewed: CheckCircle,
  hired: CheckCircle,
  dismissed: X,
  archived: Archive,
  declined: X,
}

export function MatchCard({ match, viewMode, onAction, onClick }: MatchCardProps) {
  const StatusIcon = statusIconMap[match.status]
  const config = statusConfig[match.status]

  if (viewMode === 'list') {
    return (
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="group flex items-center justify-between border-gray-200 border-b bg-white p-4 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
        initial={{ opacity: 0, x: -20 }}
        onClick={onClick}
      >
        <div className="flex items-center space-x-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image
              alt={match.provider.name}
              className="object-cover"
              fill
              sizes="48px"
              src={match.provider.avatar_url || `https://i.pravatar.cc/100?u=${match.provider.id}`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white">{match.provider.name}</h3>
              {match.provider.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
              <span className={`rounded-full px-2 py-0.5 text-xs ${config.color}`}>
                {config.label}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-4 text-gray-600 text-sm dark:text-gray-400">
              <span>{match.provider.service}</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {match.provider.location}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400" />
                {match.provider.rating}
              </span>
              <span className="font-medium">
                {match.matchScore ? `${Math.round(match.matchScore * 100)}% match` : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">
            {match.createdAt
              ? formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })
              : 'Recently'}
          </span>
          <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
      initial={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                alt={match.provider.name}
                className="object-cover"
                fill
                sizes="48px"
                src={match.provider.avatar_url || `https://i.pravatar.cc/100?u=${match.provider.id}`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{match.provider.name}</h3>
                {match.provider.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
              </div>
              <p className="text-gray-600 text-sm dark:text-gray-400">{match.provider.service}</p>
            </div>
          </div>
          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs ${config.color}`}
          >
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </span>
        </div>

        {/* Provider Details */}
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            {match.provider.location}
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Star className="h-4 w-4 text-yellow-400" />
            {match.provider.rating > 0 ? match.provider.rating.toFixed(1) : 'No rating'}
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <CheckCircle className="h-4 w-4" />
            {match.matchScore ? `${Math.round(match.matchScore * 100)}% match` : 'Match'}
          </div>
        </div>

        {/* Match Info */}
        <div className="mb-4 flex flex-wrap gap-1">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 text-xs dark:bg-gray-800 dark:text-gray-400">
            {match.provider.city}
          </span>
          {match.provider.verified && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-600 text-xs dark:bg-blue-800 dark:text-blue-400">
              Verified
            </span>
          )}
        </div>

        {/* Timeline */}
        <div className="mb-4 border-gray-200 border-t pt-4 dark:border-gray-700">
          <p className="mb-2 font-medium text-gray-700 text-sm dark:text-gray-300">
            Recent Activity
          </p>
          <div className="space-y-1">
            {match.timeline.slice(0, 2).map((event, index) => (
              <div
                className="flex items-center gap-2 text-gray-600 text-xs dark:text-gray-400"
                key={index}
              >
                <span>
                  {event.date ? (
                    format(new Date(event.date), 'MMM d, h:mm a')
                  ) : (
                    'Unknown'
                  )}
                </span>
                <span className="text-gray-400">•</span>
                <span>{event.event}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {match.status === 'pending' && (
            <>
              <Button
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction(match.id, 'contact')
                }}
                size="sm"
                variant="primary"
              >
                Contact
              </Button>
              <Button
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction(match.id, 'decline')
                }}
                size="sm"
                variant="outline"
              >
                Decline
              </Button>
            </>
          )}
          {match.status === 'contacted' && (
            <>
              <Button
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction(match.id, 'hire')
                }}
                size="sm"
                variant="primary"
              >
                Hire
              </Button>
              <Button
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction(match.id, 'message')
                }}
                size="sm"
                variant="outline"
              >
                Message
              </Button>
            </>
          )}
          {match.status === 'hired' && (
            <Button
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                onAction(match.id, 'view')
              }}
              size="sm"
              variant="outline"
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
