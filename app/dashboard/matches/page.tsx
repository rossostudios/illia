// Wireframe: Low-fi My Matches page—table for history, filters, modal details; grayscale dashed style.

'use client'

import { ChevronDown, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

// Mock match data
const MOCK_MATCHES = [
  {
    id: 1,
    name: 'Maria Rodriguez',
    service: 'Weekly Cleaning + Cooking',
    location: 'El Poblado',
    status: 'hired',
    lastInteraction: 'Hired 2 weeks ago',
    dateRequested: '2024-09-08',
    rating: null,
    notes: 'Great communication, very thorough with cleaning.',
    photo: '',
    interactions: [
      { date: '2024-09-08', action: 'Intro requested' },
      { date: '2024-09-09', action: 'Provider responded' },
      { date: '2024-09-10', action: 'You hired provider' },
    ],
  },
  {
    id: 2,
    name: 'Ana Silva',
    service: 'House Cleaning',
    location: 'Lagoa',
    status: 'pending',
    lastInteraction: 'Intro requested 2 days ago',
    dateRequested: '2024-09-20',
    rating: null,
    notes: '',
    photo: '',
    interactions: [
      { date: '2024-09-20', action: 'Intro requested' },
      { date: '2024-09-20', action: 'Awaiting response' },
    ],
  },
  {
    id: 3,
    name: 'Carlos Martinez',
    service: 'Cooking & Meal Prep',
    location: 'Laureles',
    status: 'archived',
    lastInteraction: 'Archived 1 month ago',
    dateRequested: '2024-08-15',
    rating: 4,
    notes: "Good cook but schedule didn't work out.",
    photo: '',
    interactions: [
      { date: '2024-08-15', action: 'Intro requested' },
      { date: '2024-08-16', action: 'Provider responded' },
      { date: '2024-08-20', action: 'Trial session completed' },
      { date: '2024-08-22', action: 'You archived match' },
    ],
  },
  {
    id: 4,
    name: 'Lucia Fernandes',
    service: 'House Cleaning',
    location: 'Campeche',
    status: 'pending',
    lastInteraction: 'Intro requested 5 days ago',
    dateRequested: '2024-09-17',
    rating: null,
    notes: 'Waiting for response, seems promising.',
    photo: '',
    interactions: [{ date: '2024-09-17', action: 'Intro requested' }],
  },
  {
    id: 5,
    name: 'Diego Ramirez',
    service: 'Meal Prep',
    location: 'Envigado',
    status: 'hired',
    lastInteraction: 'Hired 1 week ago',
    dateRequested: '2024-09-15',
    rating: 5,
    notes: 'Excellent chef! Makes amazing Colombian dishes.',
    photo: '',
    interactions: [
      { date: '2024-09-15', action: 'Intro requested' },
      { date: '2024-09-15', action: 'Provider responded' },
      { date: '2024-09-16', action: 'Trial meal prepared' },
      { date: '2024-09-17', action: 'You hired provider' },
      { date: '2024-09-22', action: 'You rated 5 stars' },
    ],
  },
]

export default function MatchesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [userNotes, setUserNotes] = useState<Record<number, string>>({})

  // Initialize notes from mock data
  useEffect(() => {
    const initialNotes: Record<number, string> = {}
    MOCK_MATCHES.forEach((match) => {
      initialNotes[match.id] = match.notes
    })
    setUserNotes(initialNotes)
  }, [])

  // Detect screen size for responsive view
  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth >= 768 ? 'table' : 'cards')
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Filter and sort matches
  const filteredMatches = MOCK_MATCHES.filter((match) => {
    if (
      searchQuery &&
      !match.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !match.service.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    if (statusFilter !== 'all' && match.status !== statusFilter) {
      return false
    }
    return true
  }).sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.dateRequested).getTime() - new Date(a.dateRequested).getTime()
    } else {
      return a.name.localeCompare(b.name)
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'border-dashed border-2 border-gray-400 px-2 py-1 text-xs'
      case 'hired':
        return 'border-dashed border-2 border-gray-700 bg-gray-100 px-2 py-1 text-xs'
      case 'archived':
        return 'border-dashed border-2 border-gray-300 px-2 py-1 text-xs text-gray-500'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 border-b-2 border-dashed border-gray-400 pb-1 inline-block">
            My Matches
          </h1>
          <p className="text-sm italic text-gray-600 mt-2">Track your intros, reviews, and hires</p>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-dashed border-gray-300">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matches..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50"
            >
              Status:{' '}
              {statusFilter === 'all'
                ? 'All'
                : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <ChevronDown className="h-4 w-4" />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full mt-1 w-48 bg-white border border-gray-300 rounded shadow-sm z-10">
                {['all', 'pending', 'hired', 'archived'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status)
                      setShowStatusDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm capitalize"
                  >
                    {status === 'all' ? 'All Statuses' : status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="px-4 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50"
            >
              Sort: {sortBy === 'recent' ? 'Recent' : 'Alphabetical'}
              <ChevronDown className="h-4 w-4" />
            </button>
            {showSortDropdown && (
              <div className="absolute top-full mt-1 w-48 bg-white border border-gray-300 rounded shadow-sm z-10">
                <button
                  onClick={() => {
                    setSortBy('recent')
                    setShowSortDropdown(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Most Recent
                </button>
                <button
                  onClick={() => {
                    setSortBy('alphabetical')
                    setShowSortDropdown(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Alphabetical
                </button>
              </div>
            )}
          </div>

          {/* Add Note Button */}
          <button className="px-4 py-2 border border-dashed border-gray-400 rounded hover:bg-gray-50">
            Add Note
          </button>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredMatches.length} of {MOCK_MATCHES.length} matches
        </p>

        {/* Matches Display */}
        {filteredMatches.length > 0 ? (
          <>
            {/* Table View (Desktop) */}
            {viewMode === 'table' && (
              <div className="border border-gray-300 rounded overflow-hidden mb-8">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Last Interaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMatches.map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 border border-dashed border-gray-400 rounded" />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{match.name}</div>
                              <div className="text-xs text-gray-500">{match.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {match.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(match.status)}>
                            {match.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {match.lastInteraction}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedMatch(match)}
                            className="text-gray-700 hover:text-gray-900 underline mr-3"
                          >
                            View Details
                          </button>
                          {match.status === 'hired' && !match.rating && (
                            <button className="text-gray-700 hover:text-gray-900 underline">
                              Rate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Card View (Mobile) */}
            {viewMode === 'cards' && (
              <div className="space-y-4 mb-8">
                {filteredMatches.map((match) => (
                  <div key={match.id} className="border border-gray-300 rounded p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 border border-dashed border-gray-400 rounded" />
                        <div>
                          <h3 className="font-medium text-gray-900">{match.name}</h3>
                          <p className="text-xs text-gray-500">{match.location}</p>
                        </div>
                      </div>
                      <span className={getStatusBadge(match.status)}>
                        {match.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{match.service}</p>
                    <p className="text-xs text-gray-600 mb-3">{match.lastInteraction}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedMatch(match)}
                        className="text-gray-700 hover:text-gray-900 underline text-sm"
                      >
                        View Details
                      </button>
                      {match.status === 'hired' && !match.rating && (
                        <button className="text-gray-700 hover:text-gray-900 underline text-sm">
                          Rate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-32 h-32 border-2 border-dashed border-gray-400 rounded mx-auto mb-4" />
            <p className="text-gray-700 mb-4">No matches yet—start exploring in Directory!</p>
            <button className="px-6 py-2 border-2 border-gray-700 text-gray-700 rounded hover:bg-gray-50">
              Browse Directory →
            </button>
          </div>
        )}

        {/* Details Modal */}
        {selectedMatch && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-dashed border-gray-400 rounded max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-dashed border-gray-300">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 border border-dashed border-gray-400 rounded" />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedMatch.name}</h2>
                      <p className="text-sm text-gray-600">{selectedMatch.location}</p>
                      <p className="text-sm text-gray-700 mt-1">{selectedMatch.service}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                  <span className={`inline-block ${getStatusBadge(selectedMatch.status)}`}>
                    STATUS: {selectedMatch.status.toUpperCase()}
                  </span>
                  {selectedMatch.rating && (
                    <span className="ml-3 text-sm text-gray-600">
                      Rated: {'★'.repeat(selectedMatch.rating)}
                    </span>
                  )}
                </div>

                {/* Interaction Timeline */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Interaction History</h3>
                  <div className="space-y-2 pl-4 border-l-2 border-dashed border-gray-300">
                    {selectedMatch.interactions.map((interaction: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-gray-400 rounded-full mt-1.5" />
                        <div>
                          <p className="text-sm text-gray-700">{interaction.action}</p>
                          <p className="text-xs text-gray-500">{interaction.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes Section */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Your Notes</h3>
                  <textarea
                    value={userNotes[selectedMatch.id] || ''}
                    onChange={(e) =>
                      setUserNotes({
                        ...userNotes,
                        [selectedMatch.id]: e.target.value,
                      })
                    }
                    placeholder="Add notes about this provider..."
                    className="w-full p-3 border border-gray-300 rounded text-sm"
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 py-2 border border-gray-700 text-gray-700 rounded hover:bg-gray-50">
                    Send Message (WhatsApp)
                  </button>
                  {selectedMatch.status !== 'archived' && (
                    <button className="px-6 py-2 border border-dashed border-gray-400 text-gray-600 rounded hover:bg-gray-50">
                      Archive
                    </button>
                  )}
                </div>

                {/* Premium Nudge */}
                <p className="text-xs text-center text-gray-500 mt-4 pt-4 border-t border-dashed border-gray-300">
                  Upgrade to Premium for unlimited match history and priority re-engagement
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
