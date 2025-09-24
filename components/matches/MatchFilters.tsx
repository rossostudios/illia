'use client'

import { Grid3x3, List, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type MatchFiltersProps = {
  filters: {
    search: string
    status: string
    service: string
  }
  onFiltersChange: (filters: any) => void
  viewMode: 'card' | 'list'
  onViewModeChange: (mode: 'card' | 'list') => void
  totalMatches: number
}

const services = [
  'All Services',
  'House Cleaning',
  'Handyman Services',
  'Dog Walking',
  'Gardening',
  'Personal Chef',
  'Tutoring',
]

export function MatchFilters({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  totalMatches,
}: MatchFiltersProps) {
  return (
    <div className="sticky top-0 z-10 border-gray-200 border-b bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6 dark:border-gray-800 dark:bg-gray-900/95">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-5 w-5 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              placeholder="Search providers..."
              type="text"
              value={filters.search}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <select
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
              value={filters.status}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="hired">Hired</option>
              <option value="archived">Archived</option>
              <option value="declined">Declined</option>
            </select>

            {/* Service Filter */}
            <select
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              onChange={(e) => onFiltersChange({ ...filters, service: e.target.value })}
              value={filters.service}
            >
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="hidden gap-1 rounded-lg border border-gray-200 p-1 sm:flex dark:border-gray-700">
              <Button
                onClick={() => onViewModeChange('card')}
                size="sm"
                variant={viewMode === 'card' ? 'default' : 'ghost'}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => onViewModeChange('list')}
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-2 text-gray-600 text-sm dark:text-gray-400">
          Showing {totalMatches} match{totalMatches !== 1 ? 'es' : ''}
        </div>
      </div>
    </div>
  )
}
