'use client'

import { Calendar, Filter, Grid3x3, List, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type BookingFiltersProps = {
  filters: {
    search: string
    status: string
    dateRange: string
  }
  onFiltersChange: (filters: any) => void
  viewMode: 'grid' | 'list' | 'calendar'
  onViewModeChange: (mode: 'grid' | 'list' | 'calendar') => void
  totalBookings: number
}

export function BookingFilters({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  totalBookings,
}: BookingFiltersProps) {
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
              placeholder="Search bookings..."
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
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>

            {/* Date Range Filter */}
            <select
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              onChange={(e) => onFiltersChange({ ...filters, dateRange: e.target.value })}
              value={filters.dateRange}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="next_week">Next Week</option>
              <option value="next_month">Next Month</option>
              <option value="past">Past Bookings</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden gap-1 rounded-lg border border-gray-200 p-1 sm:flex dark:border-gray-700">
              <Button
                onClick={() => onViewModeChange('grid')}
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
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
              <Button
                onClick={() => onViewModeChange('calendar')}
                size="sm"
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-2 text-gray-600 text-sm dark:text-gray-400">
          Showing {totalBookings} booking{totalBookings !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
