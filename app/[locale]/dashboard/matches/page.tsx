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
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertCircle,
  },
  contacted: {
    label: 'Contacted',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: MessageSquare,
  },
  hired: {
    label: 'Hired',
    color: 'bg-teal-100 text-teal-800 border-teal-200',
    icon: CheckCircle,
  },
  archived: {
    label: 'Archived',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Archive,
  },
}

function getTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
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

  const filteredMatches = useMemo(() => {
    return MOCK_MATCHES.filter((match) => {
      const matchesSearch =
        searchQuery === '' ||
        match.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.provider.service.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || match.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  const statusCounts = useMemo(() => {
    return MOCK_MATCHES.reduce(
      (acc, match) => {
        acc[match.status] = (acc[match.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
  }, [])

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-teal-600">My Matches</h1>
            <p className="text-gray-700 mt-1">Track and manage your provider introductions</p>
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/en/dashboard/explore'
            }}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Request New Match
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-900">Total Matches</h3>
              <User className="h-4 w-4 text-gray-700" />
            </div>
            <div className="text-2xl font-bold">{MOCK_MATCHES.length}</div>
            <p className="text-xs text-gray-700">All time</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-900">Pending</h3>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold">{statusCounts.pending || 0}</div>
            <p className="text-xs text-gray-700">Awaiting response</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-900">Active Hires</h3>
              <CheckCircle className="h-4 w-4 text-teal-600" />
            </div>
            <div className="text-2xl font-bold">{statusCounts.hired || 0}</div>
            <p className="text-xs text-gray-700">Currently working</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-900">Success Rate</h3>
              <Star className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-gray-700">Hired vs total</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <label htmlFor={searchInputId} className="sr-only">
              Search matches
            </label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700" />
            <input
              id={searchInputId}
              type="text"
              placeholder="Search by name or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div
            className="flex gap-1 bg-gray-100 p-1 rounded-lg"
            role="group"
            aria-label="Filter by status"
          >
            {['all', 'pending', 'contacted', 'hired', 'archived'].map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => setStatusFilter(status)}
                aria-pressed={statusFilter === status}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize',
                  statusFilter === status
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                )}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <User className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No matches found</h3>
            <p className="text-gray-700 text-center max-w-md">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Request a match to get started with finding your perfect provider'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="text-left px-6 py-3 text-xs font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Provider
                  </th>
                  <th
                    scope="col"
                    className="text-left px-6 py-3 text-xs font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Service
                  </th>
                  <th
                    scope="col"
                    className="text-left px-6 py-3 text-xs font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="text-left px-6 py-3 text-xs font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Timeline
                  </th>
                  <th
                    scope="col"
                    className="text-left px-6 py-3 text-xs font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Rate
                  </th>
                  <th
                    scope="col"
                    className="text-right px-6 py-3 text-xs font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMatches.map((match) => {
                  const StatusIcon = statusConfig[match.status as keyof typeof statusConfig].icon
                  return (
                    <motion.tr
                      key={match.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedMatch(match)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200" aria-hidden="true" />
                          <div>
                            <p className="font-medium text-gray-900">{match.provider.name}</p>
                            <div className="flex items-center gap-1 text-sm">
                              <Star
                                className="h-3 w-3 fill-amber-400 text-amber-400"
                                aria-hidden="true"
                              />
                              <span className="text-gray-900 font-medium">
                                {match.provider.rating}
                              </span>
                              <span className="text-gray-700">({match.provider.reviews})</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{match.provider.service}</p>
                          <p className="text-sm text-gray-700">{match.provider.location}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
                            statusConfig[match.status as keyof typeof statusConfig].color
                          )}
                        >
                          <StatusIcon className="h-3 w-3" aria-hidden="true" />
                          {statusConfig[match.status as keyof typeof statusConfig].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="h-3 w-3 text-gray-700" aria-hidden="true" />
                          <span className="text-gray-900">
                            Intro {getTimeAgo(match.introRequested)}
                          </span>
                        </div>
                        {match.lastContact && (
                          <div className="flex items-center gap-2 text-sm text-gray-800 mt-1">
                            <MessageSquare className="h-3 w-3 text-gray-700" aria-hidden="true" />
                            <span className="text-gray-900">
                              Contact {getTimeAgo(match.lastContact)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-gray-900" aria-hidden="true" />
                          <span className="font-medium text-gray-900">
                            {match.provider.hourlyRate}
                          </span>
                          <span className="text-sm text-gray-900">/hr</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedMatch(match)
                              setNoteDialogOpen(true)
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-900 hover:text-black"
                            aria-label="Add note"
                          >
                            <FileText className="h-4 w-4 text-gray-700" />
                          </button>
                          {match.status === 'hired' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedMatch(match)
                                setRatingDialogOpen(true)
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-900 hover:text-black"
                              aria-label="Rate provider"
                            >
                              <Star className="h-4 w-4 text-gray-700" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedMatch(match)
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-900 hover:text-black"
                            aria-label="View details"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-700" />
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 id="modal-title" className="text-2xl font-bold">
                  Match Details
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedMatch(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Provider Info */}
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200" aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedMatch.provider.name}
                    </h3>
                    <p className="text-gray-900">{selectedMatch.provider.service}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-800" aria-hidden="true" />
                        <span className="text-gray-900">{selectedMatch.provider.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star
                          className="h-3 w-3 fill-amber-400 text-amber-400"
                          aria-hidden="true"
                        />
                        <span className="text-gray-900">
                          {selectedMatch.provider.rating} ({selectedMatch.provider.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-gray-800" aria-hidden="true" />
                        <span className="text-gray-900">
                          ${selectedMatch.provider.hourlyRate}/hr
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border',
                      statusConfig[selectedMatch.status as keyof typeof statusConfig].color
                    )}
                  >
                    {statusConfig[selectedMatch.status as keyof typeof statusConfig].label}
                  </span>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="font-semibold mb-3">Timeline</h4>
                  <div className="space-y-3">
                    {selectedMatch.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1">
                          <div
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
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{event.event}</p>
                          <p className="text-xs text-gray-700">
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
                    <h4 className="font-semibold mb-3">Notes</h4>
                    <div className="space-y-2">
                      {selectedMatch.notes.map((note, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-900">{note.content}</p>
                          <p className="text-xs text-gray-700 mt-1">
                            {new Date(note.date).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Archived Reason */}
                {selectedMatch.status === 'archived' && 'archivedReason' in selectedMatch && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900">Archive Reason</p>
                    <p className="text-sm text-gray-900 mt-1">{selectedMatch.archivedReason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setNoteDialogOpen(true)}
                  >
                    <FileText className="h-4 w-4" />
                    Add Note
                  </button>
                  {selectedMatch.status === 'hired' && (
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      onClick={() => setRatingDialogOpen(true)}
                    >
                      <Star className="h-4 w-4" />
                      Rate Provider
                    </button>
                  )}
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-labelledby="note-modal-title"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-3xl w-full"
          >
            <div className="p-8">
              <h2 id="note-modal-title" className="text-2xl font-bold mb-3 text-teal-600">
                Add Note
              </h2>
              <p className="text-gray-800 text-base mb-6">
                Add a note about your interaction with {selectedMatch?.provider.name}
              </p>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor={noteTextareaId}
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Note
                  </label>
                  <textarea
                    id={noteTextareaId}
                    placeholder="Enter your notes here... (e.g., discussed availability, pricing, specific requirements)"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => setNoteDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-labelledby="rating-modal-title"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full"
          >
            <div className="p-8">
              <h2 id="rating-modal-title" className="text-2xl font-bold mb-3 text-teal-600">
                Rate Provider
              </h2>
              <p className="text-gray-800 text-base mb-6">
                How was your experience with {selectedMatch?.provider.name}?
              </p>

              <div className="space-y-6">
                <div>
                  <span id={ratingLabelId} className="block text-sm font-medium text-gray-900 mb-3">
                    Rating
                  </span>
                  <div className="flex gap-2" role="group" aria-labelledby={ratingLabelId}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        aria-label={`Rate ${star} out of 5 stars`}
                        aria-pressed={rating >= star}
                        className="focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
                      >
                        <Star
                          className={cn(
                            'h-8 w-8 transition-colors',
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor={reviewTextareaId}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Review (Optional)
                  </label>
                  <textarea
                    id={reviewTextareaId}
                    placeholder="Share your experience..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => setRatingDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
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
