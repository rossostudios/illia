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
      <div className="fixed inset-y-0 left-0 w-56 bg-white border-r">
        {/* Logo */}
        <div className="p-4 border-b">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <span className="text-xl md:text-2xl font-bold text-teal-800 drop-shadow-sm transition-all group-hover:text-teal-900 group-hover:drop-shadow-md">
              Illia
            </span>
          </Link>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2 bg-gray-200 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <kbd className="absolute right-2 top-2 text-xs bg-white border rounded px-1">⌘K</kbd>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
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
                <div className="ml-7 mt-1 space-y-1">
                  {item.submenu?.map((subitem) => (
                    <Link
                      key={subitem.label}
                      href={subitem.href}
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
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
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-teal-50 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span className="text-xs font-semibold text-teal-600">What&apos;s New (5)</span>
                </div>
                <button
                  onClick={() => setShowWhatsNew(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-xs text-gray-600">View our latest update</p>
            </div>

            {/* User email */}
            <div className="mt-4 px-3 py-2 text-xs text-gray-500">samlee@content-mobbin.com</div>

            {/* Collapse button */}
            <button className="flex items-center space-x-2 mt-2 text-xs text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-3 w-3" />
              <span>Collapse</span>
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="ml-56">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-teal-100 text-teal-700 px-3 py-1 rounded-lg">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Personal Team</span>
                {hasLogs && (
                  <span className="bg-teal-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    1
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {hasLogs && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-teal-600 rounded-full" />
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </button>
              <Link
                href="/docs"
                className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg"
              >
                <FileCode className="h-4 w-4" />
                <span className="text-sm font-medium">Docs</span>
              </Link>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </header>

        {/* Activity Logs content */}
        <div className="p-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-teal-600 mb-2">Lead Activity Logs</h1>
            <p className="text-gray-700">Take a look at your lead generations activity</p>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lead queries (e.g., plumbers 29401)"
                className="w-full pl-10 pr-3 py-2 bg-gray-200 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Endpoint Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowEndpointDropdown(!showEndpointDropdown)
                  setShowDateDropdown(false)
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 text-gray-600" />
                <span>{selectedEndpoint}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {showEndpointDropdown && (
                <div className="absolute z-10 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 border-b">
                    <p className="text-xs text-gray-500 px-2">Filter by Generation Type</p>
                  </div>
                  <div className="p-2">
                    {endpoints.map((endpoint) => (
                      <button
                        key={endpoint}
                        onClick={() => {
                          setSelectedEndpoint(endpoint)
                          setShowEndpointDropdown(false)
                          setHasLogs(true)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between hover:bg-gray-50 ${
                          selectedEndpoint === endpoint ? 'text-teal-600' : 'text-gray-700'
                        }`}
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
                onClick={() => {
                  setShowDateDropdown(!showDateDropdown)
                  setShowEndpointDropdown(false)
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4 text-gray-600" />
                <span>{dateRange}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {showDateDropdown && (
                <div className="absolute z-10 mt-2 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 border-b">
                    <p className="text-xs text-gray-500 px-2">Date Range</p>
                    <button
                      onClick={() => setShowDateDropdown(false)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="p-2">
                    {dateRanges.map((range) => (
                      <button
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
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between hover:bg-gray-50 ${
                          dateRange === range ? 'text-teal-600' : 'text-gray-700'
                        }`}
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Date Range</h3>
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* September 2025 */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <h4 className="font-medium">September 2025</h4>
                      <div />
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                        <div key={day} className="text-center text-gray-500 p-2">
                          {day}
                        </div>
                      ))}
                      {/* September calendar days */}
                      {[
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                        22, 23, 24, 25, 26, 27, 28, 29, 30,
                      ].map((day) => (
                        <button
                          key={day}
                          className={`p-2 text-sm hover:bg-gray-100 rounded ${
                            day === 8 ? 'bg-teal-500 text-white hover:bg-teal-600' : ''
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* October 2025 */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div />
                      <h4 className="font-medium">October 2025</h4>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                        <div key={day} className="text-center text-gray-500 p-2">
                          {day}
                        </div>
                      ))}
                      {/* October calendar days */}
                      <div className="col-span-2" />
                      {[
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
                        22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                      ].map((day) => (
                        <button key={day} className="p-2 text-sm hover:bg-gray-100 rounded">
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end mt-6 space-x-3">
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setDateRange('Custom range')
                      setShowCalendar(false)
                    }}
                    className="px-4 py-2 text-sm bg-teal-500 hover:bg-teal-600 text-white rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Logs Table */}
          {!hasLogs ? (
            <div className="bg-white rounded-xl border p-16">
              <div className="flex flex-col items-center justify-center">
                <Clock className="h-12 w-12 text-teal-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lead generations yet?</h3>
                <p className="text-sm text-gray-500 mb-1">
                  Your runs will appear here once you start in Playground.
                </p>
                <p className="text-sm text-gray-500">
                  Track queries, scores, and exports from Charleston ZIPs.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mode
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Query
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leads Found
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Started
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredLogs.map((log, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.mode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="truncate block max-w-md">{log.query}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              log.status === 'Success'
                                ? 'bg-teal-100 text-teal-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                                log.status === 'Success' ? 'bg-teal-500' : 'bg-red-500'
                              }`}
                            />
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.leads}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>{log.date}</div>
                            <div className="text-xs text-gray-400">{log.time}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-3 border-t flex items-center justify-between">
                <div className="text-sm text-gray-500">Page 1</div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Intercom Chat */}
      <button className="fixed bottom-4 right-4 bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-full shadow-lg">
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
