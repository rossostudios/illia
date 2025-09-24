'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

type UserFiltersProps = {
  currentFilters: {
    search?: string
    type?: string
    tier?: string
    status?: string
  }
}

export default function UserFilters({ currentFilters }: UserFiltersProps) {
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string

    const params = new URLSearchParams(window.location.search)
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search)
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/admin/users?${params.toString()}`)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Search */}
        <form className="flex-1" onSubmit={handleSearch}>
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              defaultValue={currentFilters.search}
              name="search"
              placeholder="Search by username, name, or email..."
              type="text"
            />
          </div>
        </form>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            onChange={(e) => handleFilterChange('type', e.target.value)}
            value={currentFilters.type || 'all'}
          >
            <option value="all">All Types</option>
            <option value="users">Users Only</option>
            <option value="providers">Providers Only</option>
          </select>

          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            onChange={(e) => handleFilterChange('tier', e.target.value)}
            value={currentFilters.tier || 'all'}
          >
            <option value="all">All Tiers</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>

          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            onChange={(e) => handleFilterChange('status', e.target.value)}
            value={currentFilters.status || 'active'}
          >
            <option value="active">Active</option>
            <option value="all">All Status</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </div>
    </div>
  )
}
