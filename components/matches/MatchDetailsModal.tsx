'use client'

import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Star,
  User,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { Match } from './types'

type MatchDetailsModalProps = {
  match: Match | null
  isOpen: boolean
  onClose: () => void
  onAction: (matchId: string, action: string) => void
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

const timelineIconMap = {
  request: Calendar,
  view: User,
  response: MessageSquare,
  contact: Phone,
  hire: CheckCircle,
}

export function MatchDetailsModal({ match, isOpen, onClose, onAction }: MatchDetailsModalProps) {
  const [newNote, setNewNote] = useState('')
  const [showAddNote, setShowAddNote] = useState(false)

  if (!match) {
    return null
  }

  const config = statusConfig[match.status]

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAction(match.id, `add-note:${newNote}`)
      setNewNote('')
      setShowAddNote(false)
    }
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
            className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-gray-900"
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-gray-200 border-b bg-white/95 p-6 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image
                      alt={match.provider.name}
                      className="object-cover"
                      fill
                      sizes="64px"
                      src={match.provider.image}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
                        {match.provider.name}
                      </h2>
                      {match.provider.verified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{match.provider.service}</p>
                    <span
                      className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${config.color}`}
                    >
                      {config.label} - {config.description}
                    </span>
                  </div>
                </div>
                <Button
                  className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={onClose}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                  {/* Provider Details */}
                  <div>
                    <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                      Provider Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        {match.provider.location}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <DollarSign className="h-4 w-4" />${match.provider.hourlyRate}/hour
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Star className="h-4 w-4 text-yellow-400" />
                        {match.provider.rating} ({match.provider.reviews} reviews)
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        {match.provider.experience}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {match.provider.languages.map((lang) => (
                        <span
                          className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 text-sm dark:bg-gray-800 dark:text-gray-400"
                          key={lang}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                      Activity Timeline
                    </h3>
                    <div className="space-y-3">
                      {match.timeline.map((event, index) => {
                        const Icon = timelineIconMap[event.type] || Clock
                        return (
                          <div className="flex gap-3" key={index}>
                            <div className="flex-shrink-0">
                              <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                                <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900 dark:text-white">{event.event}</p>
                              <p className="text-gray-500 text-sm dark:text-gray-400">
                                {format(new Date(event.date), 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notes</h3>
                      <Button onClick={() => setShowAddNote(true)} size="sm" variant="outline">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Note
                      </Button>
                    </div>
                    {showAddNote && (
                      <div className="mb-3 space-y-2">
                        <textarea
                          className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add a note..."
                          rows={3}
                          value={newNote}
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleAddNote} size="sm" variant="default">
                            Save Note
                          </Button>
                          <Button
                            onClick={() => {
                              setShowAddNote(false)
                              setNewNote('')
                            }}
                            size="sm"
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {match.notes.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">No notes yet</p>
                      ) : (
                        match.notes.map((note, index) => (
                          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800" key={index}>
                            <p className="text-gray-900 dark:text-white">{note.content}</p>
                            <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
                              {format(new Date(note.date), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                      Quick Actions
                    </h4>
                    <div className="space-y-2">
                      {match.status === 'pending' && (
                        <>
                          <Button
                            className="w-full justify-start"
                            onClick={() => onAction(match.id, 'contact')}
                            variant="default"
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </Button>
                          <Button
                            className="w-full justify-start"
                            onClick={() => onAction(match.id, 'call')}
                            variant="outline"
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Schedule Call
                          </Button>
                        </>
                      )}
                      {match.status === 'contacted' && (
                        <>
                          <Button
                            className="w-full justify-start"
                            onClick={() => onAction(match.id, 'hire')}
                            variant="default"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Hire Provider
                          </Button>
                          <Button
                            className="w-full justify-start"
                            onClick={() => onAction(match.id, 'schedule')}
                            variant="outline"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Service
                          </Button>
                        </>
                      )}
                      {match.status === 'hired' && (
                        <>
                          <Button
                            className="w-full justify-start"
                            onClick={() => onAction(match.id, 'review')}
                            variant="default"
                          >
                            <Star className="mr-2 h-4 w-4" />
                            Write Review
                          </Button>
                          <Button
                            className="w-full justify-start"
                            onClick={() => onAction(match.id, 'invoice')}
                            variant="outline"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Invoices
                          </Button>
                        </>
                      )}
                      <Button
                        className="w-full justify-start"
                        onClick={() => onAction(match.id, 'email')}
                        variant="outline"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
