'use client'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import {
  ArrowUpDown,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  MessageSquare,
  MoreHorizontal,
  Shield,
  Star,
  Trash2,
  User,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import type { Match } from '@/components/matches/types'
import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface MatchesTableProps {
  matches: Match[]
  onAction: (matchId: string, action: string) => void
  onMatchClick: (match: Match) => void
}

const columnHelper = createColumnHelper<Match>()

export function MatchesTable({ matches, onAction, onMatchClick }: MatchesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = [
    columnHelper.accessor('provider', {
      header: 'Provider',
      cell: (info) => {
        const provider = info.getValue()
        if (!provider) return <span className="text-gray-400">Unknown Provider</span>

        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={provider.avatar_url || `https://i.pravatar.cc/100?u=${provider.id}`}
                alt={provider.name}
                fill
                className="object-cover"
              />
              {provider.verified && (
                <Shield className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-white p-0.5 text-teal-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white">{provider.name}</span>
                {provider.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm dark:text-gray-400">
                <span>{provider.service}</span>
                <span className="text-gray-400">•</span>
                <span>{provider.location}</span>
              </div>
            </div>
          </div>
        )
      },
    }),
    columnHelper.accessor('matchScore', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium text-gray-700 hover:bg-transparent dark:text-gray-300"
        >
          Match Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        const score = info.getValue()
        return score ? (
          <div className="flex items-center gap-2">
            <div className="w-20 rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-2 py-0.5 text-center text-white text-xs"
                style={{ width: `${score * 100}%` }}
              >
                {Math.round(score * 100)}%
              </div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )
      },
    }),
    columnHelper.accessor('provider.rating', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium text-gray-700 hover:bg-transparent dark:text-gray-300"
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        const rating = info.getValue()
        return rating && rating > 0 ? (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-yellow-400" />
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
        ) : (
          <span className="text-gray-400">No rating</span>
        )
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue()
        const statusConfig = {
          pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
          contacted: { label: 'Contacted', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: MessageSquare },
          viewed: { label: 'Viewed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: Eye },
          hired: { label: 'Hired', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: CheckCircle },
          dismissed: { label: 'Dismissed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: X },
        }
        const config = statusConfig[status] || statusConfig.pending
        const Icon = config.icon

        return (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${config.color}`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </span>
        )
      },
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium text-gray-700 hover:bg-transparent dark:text-gray-300"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        const date = info.getValue()
        return date ? (
          <span className="text-gray-600 text-sm dark:text-gray-400">
            {format(new Date(date), 'MMM d, yyyy')}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const match = row.original

        return (
          <div className="flex items-center gap-2">
            {match.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAction(match.id, 'contact')
                  }}
                >
                  <MessageSquare className="h-4 w-4" />
                  Contact
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAction(match.id, 'decline')
                  }}
                >
                  Decline
                </Button>
              </>
            )}
            {match.status === 'contacted' && (
              <Button
                size="sm"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction(match.id, 'hire')
                }}
              >
                Hire
              </Button>
            )}
            {match.status === 'viewed' && (
              <Button
                size="sm"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction(match.id, 'message')
                }}
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onMatchClick(match)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onAction(match.id, 'archive')}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    }),
  ] as ColumnDef<Match>[]

  const table = useReactTable({
    data: matches,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search matches..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800"
        />
        <div className="text-gray-600 text-sm dark:text-gray-400">
          {table.getFilteredRowModel().rows.length} of {matches.length} matches
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left font-medium text-gray-900 text-xs uppercase tracking-wider dark:text-white"
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
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500 text-sm">No matches found</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => onMatchClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4 text-gray-600 text-sm dark:text-gray-400">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-800"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}