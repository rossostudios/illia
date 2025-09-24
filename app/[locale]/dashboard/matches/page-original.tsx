'use client'

import { motion } from 'framer-motion'
import {
  AlertCircle,
  Archive,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Star,
  User,
  X,
} from 'lucide-react'
import { useId, useMemo, useState } from 'react'

// Utility function for className concatenation
function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ')
}

// Enhanced mock data with CRM features
const MOCK_MATCHES = [
  {
    id: 1,
    provider: {
      name: 'Maria Garcia',
      service: 'House Cleaning',
      location: 'Charleston, SC',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 35,
      image: '/api/placeholder/48/48',
      languages: ['English', 'Spanish'],
      verified: true,
      experience: '5 years',
    },
    status: 'pending',
    introRequested: '2024-01-20T10:00:00',
    lastContact: null,
    notes: [],
    timeline: [
      { date: '2024-01-20T10:00:00', event: 'Introduction requested', type: 'request' },
      { date: '2024-01-20T14:30:00', event: 'Provider viewed your request', type: 'view' },
    ],
  },
  {
    id: 2,
    provider: {
      name: 'John Smith',
      service: 'Handyman Services',
      location: 'Mount Pleasant, SC',
      rating: 4.7,
      reviews: 89,
      hourlyRate: 45,
      image: '/api/placeholder/48/48',
      languages: ['English'],
      verified: true,
      experience: '8 years',
    },
    status: 'contacted',
    introRequested: '2024-01-18T09:00:00',
    lastContact: '2024-01-19T15:00:00',
    notes: [
      {
        date: '2024-01-19T15:00:00',
        content: 'Discussed kitchen cabinet repair. Available next week.',
      },
    ],
    timeline: [
      { date: '2024-01-18T09:00:00', event: 'Introduction requested', type: 'request' },
      { date: '2024-01-18T11:00:00', event: 'Provider responded', type: 'response' },
      { date: '2024-01-19T15:00:00', event: 'Phone call completed', type: 'contact' },
    ],
  },
  {
    id: 3,
    provider: {
      name: 'Sophie Chen',
      service: 'Dog Walking',
      location: 'Charleston, SC',
      rating: 5.0,
      reviews: 203,
      hourlyRate: 25,
      image: '/api/placeholder/48/48',
      languages: ['English', 'Mandarin'],
      verified: true,
      experience: '3 years',
    },
    status: 'hired',
    introRequested: '2024-01-15T08:00:00',
    lastContact: '2024-01-17T10:00:00',
    hiredDate: '2024-01-17T10:00:00',
    notes: [
      {
        date: '2024-01-16T14:00:00',
        content: 'Great with dogs! Has experience with anxious pets.',
      },
      { date: '2024-01-17T10:00:00', content: 'Hired for 3x weekly walks starting Monday.' },
    ],
    timeline: [
      { date: '2024-01-15T08:00:00', event: 'Introduction requested', type: 'request' },
      { date: '2024-01-15T09:30:00', event: 'Provider responded', type: 'response' },
      { date: '2024-01-16T14:00:00', event: 'Meet and greet completed', type: 'contact' },
      { date: '2024-01-17T10:00:00', event: 'Hired', type: 'hired' },
    ],
  },
  {
    id: 4,
    provider: {
      name: 'Robert Johnson',
      service: 'Lawn Care',
      location: 'Charleston, SC',
      rating: 4.6,
      reviews: 67,
      hourlyRate: 40,
      image: '/api/placeholder/48/48',
      languages: ['English'],
      verified: false,
      experience: '10 years',
    },
    status: 'archived',
    introRequested: '2024-01-10T07:00:00',
    lastContact: '2024-01-11T16:00:00',
    archivedDate: '2024-01-12T09:00:00',
    archivedReason: 'Not a good fit - looking for organic lawn care only',
    notes: [{ date: '2024-01-11T16:00:00', content: 'Does not offer organic treatment options.' }],
    timeline: [
      { date: '2024-01-10T07:00:00', event: 'Introduction requested', type: 'request' },
      { date: '2024-01-11T10:00:00', event: 'Provider responded', type: 'response' },
      { date: '2024-01-11T16:00:00', event: 'Phone call completed', type: 'contact' },
      { date: '2024-01-12T09:00:00', event: 'Archived', type: 'archived' },
    ],
  },
]

const statusConfig = {
  pending: {
    label: 'Pending',
    color:
      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
    icon: AlertCircle,
  },
  contacted: {
    label: 'Contacted',
    color:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    icon: MessageSquare,
  },
  hired: {
    label: 'Hired',
    color:
      'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-700',
    icon: CheckCircle,
  },
  archived: {
    label: 'Archived',
    color:
      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600',
    icon: Archive,
  },
}

function getTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return 'Today'
  }
  if (diffInDays === 1) {
    return 'Yesterday'
  }
  if (diffInDays < 7) {
    return `${diffInDays} days ago`
  }
  if (diffInDays < 30) {
    return `${Math.floor(diffInDays / 7)} weeks ago`
  }
  return `${Math.floor(diffInDays / 30)} months ago`
}

export default function MyMatchesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedMatch, setSelectedMatch] = useState<(typeof MOCK_MATCHES)[0] | null>(null)
  const [noteDialogOpen, setNoteDialogOpen] = useState(false)
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [rating, setRating] = useState(5)

  // Generate unique IDs for form elements
  const noteTextareaId = useId()
  const reviewTextareaId = useId()
  const ratingLabelId = useId()
  const searchInputId = useId()

  const filteredMatches = useMemo(
    () =>
      MOCK_MATCHES.filter((match) => {
        const matchesSearch =
          searchQuery === '' ||
          match.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.provider.service.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || match.status === statusFilter

        return matchesSearch && matchesStatus
      }),
    [searchQuery, statusFilter]
  )

  const statusCounts = useMemo(
    () =>
      MOCK_MATCHES.reduce(
        (acc, match) => {
          acc[match.status] = (acc[match.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      ),
    []
  )

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl text-teal-600 tracking-tight dark:text-teal-400">
              My Matches
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Track and manage your provider introductions
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            onClick={() => {
              window.location.href = '/en/dashboard/explore'
            }}
          >
            <Plus className="h-4 w-4" />
            Request New Match
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="font-medium text-gray-900 text-sm dark:text-white">Total Matches</h3>
              <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="font-bold text-2xl text-gray-900 dark:text-white">
              {MOCK_MATCHES.length}
            </div>
            <p className="text-gray-600 text-xs dark:text-gray-400">All time</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="font-medium text-gray-900 text-sm dark:text-white">Pending</h3>
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="font-bold text-2xl text-gray-900 dark:text-white">
              {statusCounts.pending || 0}
            </div>
            <p className="text-gray-600 text-xs dark:text-gray-400">Awaiting response</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="font-medium text-gray-900 text-sm dark:text-white">Active Hires</h3>
              <CheckCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="font-bold text-2xl text-gray-900 dark:text-white">
              {statusCounts.hired || 0}
            </div>
            <p className="text-gray-600 text-xs dark:text-gray-400">Currently working</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="font-medium text-gray-900 text-sm dark:text-white">Success Rate</h3>
              <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="font-bold text-2xl text-gray-900 dark:text-white">75%</div>
            <p className="text-gray-600 text-xs dark:text-gray-400">Hired vs total</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <label className="sr-only" htmlFor={searchInputId}>
              Search matches
            </label>
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
              id={searchInputId}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or service..."
              type="text"
              value={searchQuery}
            />
          </div>
          <div
            aria-label="Filter by status"
            className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700"
            role="group"
          >
            {['all', 'pending', 'contacted', 'hired', 'archived'].map((status) => (
              <button
                aria-pressed={statusFilter === status}
                className={cn(
                  'rounded-md px-4 py-2 font-medium text-sm capitalize transition-colors',
                  statusFilter === status
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                )}
                key={status}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        {filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-700">
              <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="mb-1 font-semibold text-gray-900 text-lg dark:text-white">
              No matches found
            </h3>
            <p className="max-w-md text-center text-gray-600 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Request a match to get started with finding your perfect provider'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-gray-200 border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
                <tr>
                  <th
                    className="px-6 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider dark:text-gray-300"
                    scope="col"
                  >
                    Provider
                  </th>
                  <th
                    className="px-6 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider dark:text-gray-300"
                    scope="col"
                  >
                    Service
                  </th>
                  <th
                    className="px-6 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider dark:text-gray-300"
                    scope="col"
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider dark:text-gray-300"
                    scope="col"
                  >
                    Timeline
                  </th>
                  <th
                    className="px-6 py-3 text-left font-medium text-gray-700 text-xs uppercase tracking-wider dark:text-gray-300"
                    scope="col"
                  >
                    Rate
                  </th>
                  <th
                    className="px-6 py-3 text-right font-medium text-gray-700 text-xs uppercase tracking-wider dark:text-gray-300"
                    scope="col"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMatches.map((match) => {
                  const StatusIcon = statusConfig[match.status as keyof typeof statusConfig].icon
                  return (
                    <motion.tr
                      animate={{ opacity: 1, y: 0 }}
                      className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      initial={{ opacity: 0, y: 20 }}
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            aria-hidden="true"
                            className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {match.provider.name}
                            </p>
                            <div className="flex items-center gap-1 text-sm">
                              <Star
                                aria-hidden="true"
                                className="h-3 w-3 fill-amber-400 text-amber-400"
                              />
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {match.provider.rating}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                ({match.provider.reviews})
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {match.provider.service}
                          </p>
                          <p className="text-gray-600 text-sm dark:text-gray-400">
                            {match.provider.location}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full border px-2 py-1 font-medium text-xs',
                            statusConfig[match.status as keyof typeof statusConfig].color
                          )}
                        >
                          <StatusIcon aria-hidden="true" className="h-3 w-3" />
                          {statusConfig[match.status as keyof typeof statusConfig].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
                          <Clock
                            aria-hidden="true"
                            className="h-3 w-3 text-gray-500 dark:text-gray-500"
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            Intro {getTimeAgo(match.introRequested)}
                          </span>
                        </div>
                        {match.lastContact && (
                          <div className="mt-1 flex items-center gap-2 text-gray-600 text-sm dark:text-gray-400">
                            <MessageSquare
                              aria-hidden="true"
                              className="h-3 w-3 text-gray-500 dark:text-gray-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              Contact {getTimeAgo(match.lastContact)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <DollarSign
                            aria-hidden="true"
                            className="h-4 w-4 text-gray-600 dark:text-gray-400"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {match.provider.hourlyRate}
                          </span>
                          <span className="text-gray-600 text-sm dark:text-gray-400">/hr</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            aria-label="Add note"
                            className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedMatch(match)
                              setNoteDialogOpen(true)
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          {match.status === 'hired' && (
                            <button
                              aria-label="Rate provider"
                              className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedMatch(match)
                                setRatingDialogOpen(true)
                              }}
                            >
                              <Star className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            aria-label="View details"
                            className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedMatch(match)
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Match Details Modal */}
      {selectedMatch && !noteDialogOpen && !ratingDialogOpen && (
        <div
          aria-labelledby="modal-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          role="dialog"
        >
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white dark:bg-gray-900"
            initial={{ opacity: 0, scale: 0.95 }}
          >
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-2xl text-gray-900 dark:text-white" id="modal-title">
                  Match Details
                </h2>
                <button
                  aria-label="Close dialog"
                  className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => setSelectedMatch(null)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Provider Info */}
                <div className="flex items-start gap-4">
                  <div
                    aria-hidden="true"
                    className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                      {selectedMatch.provider.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedMatch.provider.service}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin
                          aria-hidden="true"
                          className="h-3 w-3 text-gray-500 dark:text-gray-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {selectedMatch.provider.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star
                          aria-hidden="true"
                          className="h-3 w-3 fill-amber-400 text-amber-400"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {selectedMatch.provider.rating} ({selectedMatch.provider.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign
                          aria-hidden="true"
                          className="h-3 w-3 text-gray-500 dark:text-gray-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          ${selectedMatch.provider.hourlyRate}/hr
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-3 py-1 font-medium text-sm',
                      statusConfig[selectedMatch.status as keyof typeof statusConfig].color
                    )}
                  >
                    {statusConfig[selectedMatch.status as keyof typeof statusConfig].label}
                  </span>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Timeline</h4>
                  <div className="space-y-3">
                    {selectedMatch.timeline.map((event, index) => (
                      <div className="flex items-start gap-3" key={index}>
                        <div className="mt-1">
                          <div
                            aria-hidden="true"
                            className={cn(
                              'h-2 w-2 rounded-full',
                              event.type === 'hired'
                                ? 'bg-teal-600'
                                : event.type === 'archived'
                                  ? 'bg-gray-600'
                                  : event.type === 'contact'
                                    ? 'bg-blue-600'
                                    : 'bg-gray-400'
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm dark:text-white">
                            {event.event}
                          </p>
                          <p className="text-gray-600 text-xs dark:text-gray-400">
                            {new Date(event.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedMatch.notes.length > 0 && (
                  <div>
                    <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Notes</h4>
                    <div className="space-y-2">
                      {selectedMatch.notes.map((note, index) => (
                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50" key={index}>
                          <p className="text-gray-700 text-sm dark:text-gray-300">{note.content}</p>
                          <p className="mt-1 text-gray-600 text-xs dark:text-gray-400">
                            {new Date(note.date).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Archived Reason */}
                {selectedMatch.status === 'archived' && 'archivedReason' in selectedMatch && (
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
                    <p className="font-medium text-gray-900 text-sm dark:text-white">
                      Archive Reason
                    </p>
                    <p className="mt-1 text-gray-700 text-sm dark:text-gray-300">
                      {selectedMatch.archivedReason}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => setNoteDialogOpen(true)}
                  >
                    <FileText className="h-4 w-4" />
                    Add Note
                  </button>
                  {selectedMatch.status === 'hired' && (
                    <button
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                      onClick={() => setRatingDialogOpen(true)}
                    >
                      <Star className="h-4 w-4" />
                      Rate Provider
                    </button>
                  )}
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                    <Mail className="h-4 w-4" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Note Modal */}
      {noteDialogOpen && (
        <div
          aria-labelledby="note-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          role="dialog"
        >
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl rounded-lg bg-white dark:bg-gray-900"
            initial={{ opacity: 0, scale: 0.95 }}
          >
            <div className="p-8">
              <h2
                className="mb-3 font-bold text-2xl text-teal-600 dark:text-teal-400"
                id="note-modal-title"
              >
                Add Note
              </h2>
              <p className="mb-6 text-base text-gray-600 dark:text-gray-400">
                Add a note about your interaction with {selectedMatch?.provider.name}
              </p>

              <div className="space-y-6">
                <div>
                  <label
                    className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300"
                    htmlFor={noteTextareaId}
                  >
                    Note
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                    id={noteTextareaId}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your notes here... (e.g., discussed availability, pricing, specific requirements)"
                    rows={8}
                    value={newNote}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => setNoteDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                    onClick={() => {
                      setNewNote('')
                      setNoteDialogOpen(false)
                    }}
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rate Provider Modal */}
      {ratingDialogOpen && (
        <div
          aria-labelledby="rating-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          role="dialog"
        >
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-lg bg-white dark:bg-gray-900"
            initial={{ opacity: 0, scale: 0.95 }}
          >
            <div className="p-8">
              <h2
                className="mb-3 font-bold text-2xl text-teal-600 dark:text-teal-400"
                id="rating-modal-title"
              >
                Rate Provider
              </h2>
              <p className="mb-6 text-base text-gray-600 dark:text-gray-400">
                How was your experience with {selectedMatch?.provider.name}?
              </p>

              <div className="space-y-6">
                <div>
                  <span
                    className="mb-3 block font-medium text-gray-700 text-sm dark:text-gray-300"
                    id={ratingLabelId}
                  >
                    Rating
                  </span>
                  <div aria-labelledby={ratingLabelId} className="flex gap-2" role="group">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        aria-label={`Rate ${star} out of 5 stars`}
                        aria-pressed={rating >= star}
                        className="rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        key={star}
                        onClick={() => setRating(star)}
                      >
                        <Star
                          className={cn(
                            'h-8 w-8 transition-colors',
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300 dark:text-gray-600'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
                    htmlFor={reviewTextareaId}
                  >
                    Review (Optional)
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-teal-400"
                    id={reviewTextareaId}
                    placeholder="Share your experience..."
                    rows={6}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    onClick={() => setRatingDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                    onClick={() => {
                      setRating(5)
                      setRatingDialogOpen(false)
                    }}
                  >
                    Submit Rating
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
