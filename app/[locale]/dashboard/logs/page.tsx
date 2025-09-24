'use client'

import {
  BarChart3,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileCode,
  FileText,
  Filter,
  HelpCircle,
  Home,
  Key,
  MessageSquare,
  Play,
  Search,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ActivityLogsPage() {
  const [showExtractMenu, setShowExtractMenu] = useState(false)
  const [showWhatsNew, setShowWhatsNew] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('All Generations')
  const [dateRange, setDateRange] = useState('Last 7 days')
  const [showEndpointDropdown, setShowEndpointDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [hasLogs, setHasLogs] = useState(true)
  const [_selectedStartDate, _setSelectedStartDate] = useState<Date | null>(null)
  const [_selectedEndDate, _setSelectedEndDate] = useState<Date | null>(null)

  const endpoints = ['All Generations', 'Basic', 'Advanced', 'Schema', 'Agent', 'ZIP search']

  const dateRanges = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All Time', 'Custom range']

  const activityLogs = [
    {
      mode: 'Schema',
      query: 'plumbers 29401',
      status: 'Success',
      leads: 18,
      date: 'Sep 20, 25',
      time: '09:57 AM',
    },
    {
      mode: 'Agent',
      query: 'hvac contractors 29403',
      status: 'Success',
      leads: 12,
      date: 'Sep 19, 25',
      time: '03:38 PM',
    },
    {
      mode: 'ZIP search',
      query: 'cafes King St',
      status: 'Success',
      leads: 15,
      date: 'Sep 18, 25',
      time: '07:46 AM',
    },
    {
      mode: 'Basic',
      query: 'roofing companies Charleston',
      status: 'Success',
      leads: 22,
      date: 'Sep 17, 25',
      time: '11:23 AM',
    },
    {
      mode: 'Advanced',
      query: 'dentists Mount Pleasant',
      status: 'Success',
      leads: 8,
      date: 'Sep 16, 25',
      time: '02:15 PM',
    },
    {
      mode: 'Schema',
      query: 'auto repair 29407',
      status: 'Success',
      leads: 14,
      date: 'Sep 15, 25',
      time: '09:30 AM',
    },
    {
      mode: 'Agent',
      query: 'law firms downtown Charleston',
      status: 'Success',
      leads: 25,
      date: 'Sep 14, 25',
      time: '04:45 PM',
    },
    {
      mode: 'ZIP search',
      query: 'pet services 29412',
      status: 'Failed',
      leads: 0,
      date: 'Sep 13, 25',
      time: '10:20 AM',
    },
    {
      mode: 'Basic',
      query: 'landscaping services James Island',
      status: 'Failed',
      leads: 0,
      date: 'Sep 12, 25',
      time: '08:15 AM',
    },
    {
      mode: 'Schema',
      query: 'real estate agents 29401',
      status: 'Success',
      leads: 30,
      date: 'Sep 11, 25',
      time: '01:30 PM',
    },
    {
      mode: 'Advanced',
      query: 'fitness centers West Ashley',
      status: 'Success',
      leads: 11,
      date: 'Sep 10, 25',
      time: '05:00 PM',
    },
  ]

  const sidebarItems = [
    { icon: Home, label: 'Overview', href: '/dashboard' },
    { icon: Play, label: 'Playground', href: '/dashboard/playground' },
    {
      icon: FileText,
      label: 'Extract',
      href: '/dashboard/extract',
      hasSubmenu: true,
      isOpen: showExtractMenu,
      submenu: [
        { label: 'Overview', href: '/dashboard/extract' },
        { label: 'Playground', href: '/dashboard/extract/playground' },
      ],
    },
    { icon: BarChart3, label: 'Activity Logs', href: '/dashboard/logs', active: true },
    { icon: BarChart3, label: 'Usage', href: '/dashboard/usage' },
    { icon: Key, label: 'API Keys', href: '/dashboard/api-keys' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

  const filteredLogs =
    selectedEndpoint === 'All Generations'
      ? activityLogs
      : activityLogs.filter((log) => log.mode === selectedEndpoint)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-56 border-r bg-white">
        {/* Logo */}
        <div className="border-b p-4">
          <Link className="group flex items-center space-x-2" href="/dashboard">
            <span className="font-bold text-teal-800 text-xl drop-shadow-sm transition-all group-hover:text-teal-900 group-hover:drop-shadow-md md:text-2xl">
              Illia
            </span>
          </Link>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-700" />
            <input
              className="w-full rounded-lg border border-gray-300 bg-gray-200 py-2 pr-3 pl-9 text-gray-900 text-sm placeholder:text-gray-500 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Search"
              type="text"
            />
            <kbd className="absolute top-2 right-2 rounded border bg-white px-1 text-xs">⌘K</kbd>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <div key={item.label}>
              <Link
                className={`flex items-center justify-between rounded-lg px-3 py-2 font-medium text-sm transition-colors ${
                  item.active ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
                href={item.href}
                onClick={(e) => {
                  if (item.hasSubmenu) {
                    e.preventDefault()
                    setShowExtractMenu(!showExtractMenu)
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.hasSubmenu && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${item.isOpen ? 'rotate-180' : ''}`}
                  />
                )}
              </Link>
              {item.hasSubmenu && item.isOpen && (
                <div className="mt-1 ml-7 space-y-1">
                  {item.submenu?.map((subitem) => (
                    <Link
                      className="block rounded-lg px-3 py-2 text-gray-600 text-sm hover:bg-gray-50 hover:text-gray-900"
                      href={subitem.href}
                      key={subitem.label}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* What's New */}
        {showWhatsNew && (
          <div className="absolute right-4 bottom-4 left-4">
            <div className="rounded-lg bg-teal-50 p-3">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-teal-600 text-xs">What&apos;s New (5)</span>
                </div>
                <button
                  className="text-gray-700 hover:text-gray-600"
                  onClick={() => setShowWhatsNew(false)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-gray-600 text-xs">View our latest update</p>
            </div>

            {/* User email */}
            <div className="mt-4 px-3 py-2 text-gray-500 text-xs">samlee@content-mobbin.com</div>

            {/* Collapse button */}
            <button className="mt-2 flex items-center space-x-2 text-gray-600 text-xs hover:text-gray-900">
              <ChevronLeft className="h-3 w-3" />
              <span>Collapse</span>
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="ml-56">
        {/* Header */}
        <header className="border-b bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 rounded-lg bg-teal-100 px-3 py-1 text-teal-700">
                <Users className="h-4 w-4" />
                <span className="font-medium text-sm">Personal Team</span>
                {hasLogs && (
                  <span className="rounded-full bg-teal-600 px-1.5 py-0.5 text-white text-xs">
                    1
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative rounded-lg p-2 hover:bg-gray-100" type="button">
                <Bell className="h-5 w-5 text-gray-600" />
                {hasLogs && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-teal-600" />
                )}
              </button>
              <button className="rounded-lg p-2 hover:bg-gray-100" type="button">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </button>
              <Link
                className="flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100"
                href="/docs"
              >
                <FileCode className="h-4 w-4" />
                <span className="font-medium text-sm">Docs</span>
              </Link>
              <button className="rounded-lg bg-orange-500 px-4 py-1.5 font-medium text-sm text-white transition-colors hover:bg-orange-600">
                Upgrade
              </button>
            </div>
          </div>
        </header>

        {/* Activity Logs content */}
        <div className="p-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className="mb-2 font-bold text-2xl text-teal-600">Lead Activity Logs</h1>
            <p className="text-gray-700">Take a look at your lead generations activity</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex items-center space-x-4">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-700" />
              <input
                className="w-full rounded-lg border border-gray-300 bg-gray-200 py-2 pr-3 pl-10 text-gray-900 text-sm placeholder:text-gray-600 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lead queries (e.g., plumbers 29401)"
                type="text"
                value={searchQuery}
              />
            </div>

            {/* Endpoint Filter */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  setShowEndpointDropdown(!showEndpointDropdown)
                  setShowDateDropdown(false)
                }}
              >
                <Filter className="h-4 w-4 text-gray-600" />
                <span>{selectedEndpoint}</span>
                <ChevronDown className="h-4 w-4 text-gray-700" />
              </button>
              {showEndpointDropdown && (
                <div className="absolute z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="border-b p-2">
                    <p className="px-2 text-gray-500 text-xs">Filter by Generation Type</p>
                  </div>
                  <div className="p-2">
                    {endpoints.map((endpoint) => (
                      <button
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                          selectedEndpoint === endpoint ? 'text-teal-600' : 'text-gray-700'
                        }`}
                        key={endpoint}
                        onClick={() => {
                          setSelectedEndpoint(endpoint)
                          setShowEndpointDropdown(false)
                          setHasLogs(true)
                        }}
                      >
                        <span>{endpoint}</span>
                        {selectedEndpoint === endpoint && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date Range Filter */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  setShowDateDropdown(!showDateDropdown)
                  setShowEndpointDropdown(false)
                }}
              >
                <Calendar className="h-4 w-4 text-gray-600" />
                <span>{dateRange}</span>
                <ChevronDown className="h-4 w-4 text-gray-700" />
              </button>
              {showDateDropdown && (
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="border-b p-2">
                    <p className="px-2 text-gray-500 text-xs">Date Range</p>
                    <button
                      className="absolute top-2 right-2 text-gray-700 hover:text-gray-600"
                      onClick={() => setShowDateDropdown(false)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="p-2">
                    {dateRanges.map((range) => (
                      <button
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                          dateRange === range ? 'text-teal-600' : 'text-gray-700'
                        }`}
                        key={range}
                        onClick={() => {
                          if (range === 'Custom range') {
                            setShowCalendar(true)
                            setShowDateDropdown(false)
                          } else {
                            setDateRange(range)
                            setShowDateDropdown(false)
                          }
                        }}
                      >
                        <span>{range}</span>
                        {dateRange === range && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Custom Date Range Calendar Modal */}
          {showCalendar && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="max-w-3xl rounded-xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Date Range</h3>
                  <button
                    className="text-gray-700 hover:text-gray-600"
                    onClick={() => setShowCalendar(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* September 2025 */}
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <button className="text-gray-700 hover:text-gray-600" type="button">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <h4 className="font-medium">September 2025</h4>
                      <div />
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                        <div className="p-2 text-center text-gray-500" key={day}>
                          {day}
                        </div>
                      ))}
                      {/* September calendar days */}
                      {[
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                        22, 23, 24, 25, 26, 27, 28, 29, 30,
                      ].map((day) => (
                        <button
                          className={`rounded p-2 text-sm hover:bg-gray-100 ${
                            day === 8 ? 'bg-teal-500 text-white hover:bg-teal-600' : ''
                          }`}
                          key={day}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* October 2025 */}
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div />
                      <h4 className="font-medium">October 2025</h4>
                      <button className="text-gray-700 hover:text-gray-600" type="button">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                        <div className="p-2 text-center text-gray-500" key={day}>
                          {day}
                        </div>
                      ))}
                      {/* October calendar days */}
                      <div className="col-span-2" />
                      {[
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                        22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                      ].map((day) => (
                        <button className="rounded p-2 text-sm hover:bg-gray-100" key={day}>
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-3">
                  <button
                    className="px-4 py-2 text-gray-600 text-sm hover:text-gray-900"
                    onClick={() => setShowCalendar(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-lg bg-teal-500 px-4 py-2 text-sm text-white hover:bg-teal-600"
                    onClick={() => {
                      setDateRange('Custom range')
                      setShowCalendar(false)
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Logs Table */}
          {hasLogs ? (
            <div className="overflow-hidden rounded-xl border bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                        Mode
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                        Query
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                        Leads Found
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                        Started
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredLogs.map((log, index) => (
                      <tr
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        key={index}
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                          {log.mode}
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-sm">
                          <span className="block max-w-md truncate">{log.query}</span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
                              log.status === 'Success'
                                ? 'bg-teal-100 text-teal-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <span
                              className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                log.status === 'Success' ? 'bg-teal-500' : 'bg-red-500'
                              }`}
                            />
                            {log.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-900 text-sm">
                          {log.leads}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                          <div>
                            <div>{log.date}</div>
                            <div className="text-gray-700 text-xs">{log.time}</div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-gray-500 text-sm">
                          <button className="text-gray-700 hover:text-gray-600" type="button">
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t px-6 py-3">
                <div className="text-gray-500 text-sm">Page 1</div>
                <div className="flex items-center space-x-2">
                  <button className="rounded p-1 text-gray-700 hover:bg-gray-100" type="button">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="rounded p-1 text-gray-700 hover:bg-gray-100" type="button">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border bg-white p-16">
              <div className="flex flex-col items-center justify-center">
                <Clock className="mb-4 h-12 w-12 text-teal-300" />
                <h3 className="mb-2 font-medium text-gray-900 text-lg">No lead generations yet?</h3>
                <p className="mb-1 text-gray-500 text-sm">
                  Your runs will appear here once you start in Playground.
                </p>
                <p className="text-gray-500 text-sm">
                  Track queries, scores, and exports from Charleston ZIPs.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Intercom Chat */}
      <button className="fixed right-4 bottom-4 rounded-full bg-teal-500 p-4 text-white shadow-lg hover:bg-teal-600">
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      aria-label="icon"
      className={className}
      fill="none"
      role="img"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
