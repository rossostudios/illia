'use client'

import {
  type ColumnDef,
  type ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Loader2,
  MapPin,
  Search,
  Shield,
  Star,
  Users,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ProviderDetailModal } from '@/components/providers/ProviderDetailModal'
import { useSessionContext } from '@/components/SessionProvider'
import { useMatches } from '@/hooks/use-matches'
import { useProviders } from '@/hooks/use-providers'
import type { Database } from '@/types/database'

type ServiceProvider = Database['public']['Tables']['service_providers']['Row']

// Define table columns
const columnHelper = createColumnHelper<ServiceProvider>()

export default function DirectoryPage() {
  const router = useRouter()
  const { user } = useSessionContext()
  const { createMatch } = useMatches()

  // Table states
  const [sorting, setSorting] = useState<SortingState>([{ id: 'rating_avg', desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Filters for the useProviders hook
  const [cityFilter, setCityFilter] = useState<string>('all')
  const [serviceFilter, setServiceFilter] = useState<string>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  // Modal state
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Memoize the filters object to prevent re-renders
  const providerFilters = useMemo(
    () => ({
      city: cityFilter === 'all' ? undefined : cityFilter,
      service: serviceFilter === 'all' ? undefined : serviceFilter,
      verified: verifiedOnly,
    }),
    [cityFilter, serviceFilter, verifiedOnly]
  )

  // Fetch providers
  const { providers, loading, error, totalCount } = useProviders(providerFilters)

  // Define handlers
  const handleContact = useCallback(async (provider: ServiceProvider) => {
    if (!user) {
      toast.error('Please sign in to contact providers')
      router.push('/login')
      return
    }

    const result = await createMatch(provider.id)
    if (result.success) {
      toast.success(`Connected with ${provider.name}`)
      router.push('/dashboard/messages')
    } else {
      toast.error(result.error || 'Failed to contact provider')
    }
  }, [user, createMatch, router])

  const handleSave = useCallback(async (provider: ServiceProvider) => {
    if (!user) {
      toast.error('Please sign in to save providers')
      router.push('/login')
      return
    }

    const result = await createMatch(provider.id)
    if (result.success) {
      toast.success(`${provider.name} saved to matches`)
    } else {
      toast.error(result.error || 'Failed to save provider')
    }
  }, [user, createMatch, router])

  // Define columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Provider
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                alt={String(info.getValue())}
                className="h-10 w-10 rounded-full object-cover"
                src={
                  info.row.original.avatar_url ||
                  `https://i.pravatar.cc/150?u=${info.row.original.id}`
                }
              />
              {info.row.original.status === 'verified' && (
                <Shield className="-bottom-1 -right-1 absolute h-4 w-4 rounded-full bg-white text-teal-600" />
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{String(info.getValue())}</div>
              <div className="text-gray-500 text-sm dark:text-gray-400">
                {info.row.original.email}
              </div>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('service_type', {
        header: 'Services',
        cell: (info) => (
          <div className="flex flex-wrap gap-1">
            {(info.getValue() as string[] | undefined)
              ?.slice(0, 2)
              .map((service: string) => (
                <span
                  className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 font-medium text-teal-700 text-xs dark:bg-teal-900/30 dark:text-teal-300"
                  key={service}
                >
                  {service}
                </span>
              ))}
            {((info.getValue() as string[] | undefined)?.length || 0) > 2 && (
              <span className="text-gray-500 text-xs">
                +{((info.getValue() as string[] | undefined)?.length || 0) - 2} more
              </span>
            )}
          </div>
        ),
      }),
      columnHelper.accessor('location', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <MapPin className="h-4 w-4" />
            Location
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: (info) => (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="capitalize">{String(info.getValue() || 'Unknown')}</span>
          </div>
        ),
      }),
      columnHelper.accessor('rating_avg', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <Star className="h-4 w-4" />
            Rating
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: (info) => {
          const rating = (info.getValue() as number) || 0
          const reviews = info.row.original.reviews_count || 0
          return (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-500 text-sm">({reviews})</span>
            </div>
          )
        },
      }),
      columnHelper.accessor('hourly_rate', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <DollarSign className="h-4 w-4" />
            Rate
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: (info) => {
          const hourly = info.getValue() as number | null | undefined
          const monthly = undefined
          return (
            <div className="text-sm">
              {hourly && <div className="font-medium">${hourly}/hr</div>}
              {monthly && <div className="text-gray-500">${monthly}/mo</div>}
              {!(hourly || monthly) && <span className="text-gray-400">Contact for rates</span>}
            </div>
          )
        },
      }),
      columnHelper.accessor('years_experience', {
        header: 'Experience',
        cell: (info) => {
          const years = info.getValue() as number | null | undefined
          if (!years) {
            return <span className="text-gray-400">-</span>
          }
          return (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>
                {years} {years === 1 ? 'year' : 'years'}
              </span>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex gap-2">
            <button
              className="rounded-lg bg-teal-600 px-3 py-1 font-medium text-sm text-white transition-colors hover:bg-teal-700"
              onClick={() => handleContact(info.row.original)}
            >
              Contact
            </button>
            <button
              className="rounded-lg border border-gray-300 px-3 py-1 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => handleSave(info.row.original)}
            >
              Save
            </button>
          </div>
        ),
      }),
    ],
    [handleContact, handleSave]
  )

  // Create table instance
  const table = useReactTable({
    data: providers,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    manualPagination: false,
  })

  const handleProviderClick = (provider: ServiceProvider) => {
    setSelectedProvider(provider)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-gray-200 border-b bg-white px-4 py-6 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2 font-bold text-3xl text-gray-900 dark:text-white">
                <Users className="h-8 w-8 text-teal-600" />
                Service Provider Directory
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Find and connect with verified home service providers
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-bold text-2xl text-gray-900 dark:text-white">{totalCount}</p>
              <p className="text-gray-600 text-sm dark:text-gray-400">Available Providers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-gray-200 border-b bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative max-w-2xl flex-1">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
              <input
                className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search providers by name, service, or location..."
                type="text"
                value={globalFilter}
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <select
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                onChange={(e) => setCityFilter(e.target.value)}
                value={cityFilter}
              >
                <option value="all">All Cities</option>
                <option value="medellin">Medellín</option>
                <option value="florianopolis">Florianópolis</option>
              </select>

              <select
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                onChange={(e) => setServiceFilter(e.target.value)}
                value={serviceFilter}
              >
                <option value="all">All Services</option>
                <option value="cleaning">Cleaning</option>
                <option value="cooking">Cooking</option>
                <option value="childcare">Childcare</option>
                <option value="tutoring">Tutoring</option>
                <option value="maintenance">Maintenance</option>
              </select>

              <button
                className={`rounded-lg border px-3 py-2 font-medium text-sm transition-colors ${
                  verifiedOnly
                    ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
                onClick={() => setVerifiedOnly(!verifiedOnly)}
              >
                <Shield className="mr-1 inline-block h-4 w-4" />
                Verified Only
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal-600" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading providers...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">Error: {error}</p>
            <button
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : providers.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 font-medium text-gray-900 text-lg dark:text-white">
              No providers found
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search criteria
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-gray-200 border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider dark:text-gray-400"
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                      key={row.id}
                      onClick={() => handleProviderClick(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          className="whitespace-nowrap px-6 py-4 text-gray-900 text-sm dark:text-white"
                          key={cell.id}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-gray-200 border-t bg-white px-4 py-3 sm:px-6 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                >
                  Previous
                </button>
                <button
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    Showing{' '}
                    <span className="font-medium">
                      {table.getState().pagination.pageIndex *
                        table.getState().pagination.pageSize +
                        1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(
                        (table.getState().pagination.pageIndex + 1) *
                          table.getState().pagination.pageSize,
                        totalCount
                      )}
                    </span>{' '}
                    of <span className="font-medium">{totalCount}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    aria-label="Pagination"
                    className="-space-x-px isolate inline-flex rounded-md shadow-sm"
                  >
                    <button
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-700 dark:hover:bg-gray-800"
                      disabled={!table.getCanPreviousPage()}
                      onClick={() => table.previousPage()}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Page numbers */}
                    {[...new Array(table.getPageCount())].slice(0, 5).map((_, index) => (
                      <button
                        className={clsx(
                          'relative inline-flex items-center px-4 py-2 font-semibold text-sm',
                          table.getState().pagination.pageIndex === index
                            ? 'z-10 bg-teal-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 focus-visible:outline-offset-2'
                            : 'text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-800'
                        )}
                        key={index}
                        onClick={() => table.setPageIndex(index)}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-700 dark:hover:bg-gray-800"
                      disabled={!table.getCanNextPage()}
                      onClick={() => table.nextPage()}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Provider Detail Modal */}
      <ProviderDetailModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedProvider(null)
        }}
        onContact={handleContact}
        onSave={handleSave}
        provider={selectedProvider}
      />
    </div>
  )
}

function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
