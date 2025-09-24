'use client'

import {
  BarChart3,
  Bell,
  ChevronDown,
  ChevronLeft,
  FileCode,
  FileText,
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

export default function UsagePage() {
  const [showExtractMenu, setShowExtractMenu] = useState(false)
  const [showWhatsNew, setShowWhatsNew] = useState(true)
  const [billingCycle, setBillingCycle] = useState<'current' | 'historical'>('current')
  const [chartView, setChartView] = useState<'weekly' | 'monthly'>('weekly')
  const [historicalView, setHistoricalView] = useState<'browser' | 'concurrency'>('browser')

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
    { icon: BarChart3, label: 'Activity Logs', href: '/dashboard/logs' },
    { icon: BarChart3, label: 'Usage', href: '/dashboard/usage', active: true },
    { icon: Key, label: 'API Keys', href: '/dashboard/api-keys' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

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
                  <span className="font-semibold text-teal-600 text-xs">What&apos;s New</span>
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
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="rounded-lg p-2 hover:bg-gray-100" type="button">
                <Bell className="h-5 w-5 text-gray-600" />
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

        {/* Usage content */}
        <div className="p-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className="mb-2 font-bold text-2xl text-teal-600">Lead Usage</h1>
            <p className="text-gray-700">Monitor your lead usage and track performance</p>
          </div>

          {/* Billing Cycle Tabs */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 border-b">
              <button
                className={`border-b-2 px-1 pb-2 font-medium text-sm transition-colors ${
                  billingCycle === 'current'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setBillingCycle('current')}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">1</span>
                  <span className="text-gray-700 text-xs">/ 3 |</span>
                  <span>CURRENT CYCLE</span>
                </span>
              </button>
              <button
                className={`border-b-2 px-1 pb-2 font-medium text-sm transition-colors ${
                  billingCycle === 'historical'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setBillingCycle('historical')}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">2</span>
                  <span className="text-gray-700 text-xs">/ 3 |</span>
                  <span>HISTORICAL LEADS</span>
                </span>
              </button>
            </div>
          </div>

          {billingCycle === 'current' ? (
            <>
              {/* Note */}
              <div className="mb-6 rounded-lg border border-yellow-400 bg-yellow-50 p-4">
                <p className="text-gray-700 text-sm">
                  Note: Lead generation data may take at least one hour to reflect recent lead gens.
                  Pro plan: Unlimited leads!
                </p>
              </div>

              {/* Usage Cards */}
              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Credit Usage */}
                <div className="rounded-xl border bg-white p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-lg">Lead Usage</h3>
                    <span className="font-bold text-2xl text-gray-700">4%</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-gray-600 text-sm">Leads Generated</p>
                      <div className="flex items-end space-x-2">
                        <span className="font-bold text-2xl">21</span>
                        <span className="text-gray-500 text-sm">
                          / <span className="font-bold text-teal-600">500</span> leads
                        </span>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-teal-500" style={{ width: '4%' }} />
                      </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Bonus leads from promo (ZIP 29401 focus)
                        </span>
                        <span className="font-medium">4</span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        Leads reset monthly on Pro plan{' '}
                        <Link className="text-teal-600 hover:underline" href="/manage">
                          Manage plan
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Extract Tokens Usage */}
                <div className="rounded-xl border bg-white p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-lg">Extract Quota</h3>
                    <span className="font-bold text-2xl">0%</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-gray-600 text-sm">Leads used this cycle</p>
                      <div className="flex items-end space-x-2">
                        <span className="font-bold text-2xl">0</span>
                        <span className="text-gray-500 text-sm">
                          / <span className="font-bold text-teal-600">500</span> leads
                        </span>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-gray-300">
                        <div className="h-2 rounded-full bg-gray-300" style={{ width: '0%' }} />
                      </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Additional extracts remaining</span>
                        <span className="font-medium">0</span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        Billing via Stripe—{' '}
                        <Link className="text-teal-600 hover:underline" href="/manage">
                          Pro for unlimited
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Toggle */}
              <div className="mb-4 flex justify-end">
                <div className="flex overflow-hidden rounded-lg border bg-white">
                  <button
                    className={`px-4 py-2 font-medium text-sm transition-colors ${
                      chartView === 'weekly'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setChartView('weekly')}
                  >
                    Weekly
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm transition-colors ${
                      chartView === 'monthly'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setChartView('monthly')}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Usage Charts */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* API Credits Chart */}
                <div className="rounded-xl border bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">API Leads</h3>
                      <p className="mt-1 text-gray-500 text-xs">
                        Sep 2025 - Sep 2025 (by {chartView === 'weekly' ? 'week' : 'month'})
                      </p>
                    </div>
                    <span className="font-bold text-2xl">21 leads</span>
                  </div>

                  <div className="relative h-48">
                    <div className="absolute inset-0">
                      {/* Chart area with background gradient */}
                      <svg aria-label="icon" className="h-full w-full" role="img">
                        <defs>
                          <linearGradient id="creditGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        {/* Charleston lead generation spike on Sep 20 */}
                        <path
                          d="M 0 160 L 50 155 L 100 150 L 150 145 L 200 140 L 250 130 L 300 110 L 350 80 L 400 40 L 400 180 L 0 180 Z"
                          fill="url(#creditGradient)"
                        />
                        <path
                          d="M 0 160 L 50 155 L 100 150 L 150 145 L 200 140 L 250 130 L 300 110 L 350 80 L 400 40"
                          fill="none"
                          stroke="#14b8a6"
                          strokeWidth="2"
                        />
                        {/* Orange dot for current day */}
                        <circle cx="400" cy="40" fill="#f97316" r="4" />
                      </svg>
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 flex justify-between text-gray-500 text-xs">
                      <span>Sep 1, 2025</span>
                      <span>Sep 10, 2025</span>
                      <span>Sep 20, 2025</span>
                    </div>
                  </div>
                </div>

                {/* Extract Tokens Chart */}
                <div className="rounded-xl border bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Extract Leads</h3>
                      <p className="mt-1 text-gray-500 text-xs">
                        Sep 2025 - Sep 2025 (by {chartView === 'weekly' ? 'week' : 'month'})
                      </p>
                    </div>
                    <span className="font-bold text-2xl">15 leads</span>
                  </div>

                  <div className="relative h-48">
                    <div className="absolute inset-0">
                      <svg aria-label="icon" className="h-full w-full" role="img">
                        <defs>
                          <linearGradient id="extractGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        {/* Flat line with small spike on weekends */}
                        <path
                          d="M 0 170 L 100 170 L 150 165 L 200 170 L 250 170 L 300 160 L 350 150 L 400 145 L 400 180 L 0 180 Z"
                          fill="url(#extractGradient)"
                        />
                        <path
                          d="M 0 170 L 100 170 L 150 165 L 200 170 L 250 170 L 300 160 L 350 150 L 400 145"
                          fill="none"
                          stroke="#14b8a6"
                          strokeWidth="2"
                        />
                        {/* Orange dot for current day */}
                        <circle cx="400" cy="145" fill="#f97316" r="4" />
                      </svg>
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 flex justify-between text-gray-500 text-xs">
                      <span>Sep 1, 2025</span>
                      <span>Sep 10, 2025</span>
                      <span>Sep 20, 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Historical Usage Tabs */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 border-b">
                  <button
                    className={`border-b-2 px-1 pb-2 font-medium text-sm transition-colors ${
                      historicalView === 'browser'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setHistoricalView('browser')}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-lg">3</span>
                      <span className="text-gray-700 text-xs">/ 3 |</span>
                      <span>LEAD GENERATION TRENDS</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Concurrency Chart */}
              <div className="rounded-xl border bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-medium text-gray-700 text-sm">MAX DAILY LEADS: 50</h3>
                  <div className="flex items-center space-x-2 text-gray-500 text-xs">
                    <span>2</span>
                    <span className="h-4 border-l" />
                    <span>1.5</span>
                    <span className="h-4 border-l" />
                    <span>1</span>
                    <span className="h-4 border-l" />
                    <span>0.5</span>
                    <span className="h-4 border-l" />
                    <span>0</span>
                  </div>
                </div>

                <div className="relative h-64">
                  <div
                    className="absolute top-0 right-0 left-0 border-gray-300 border-t-2 border-dashed"
                    style={{ top: '0%' }}
                  >
                    <span className="-top-3 -left-8 absolute text-gray-500 text-xs">2</span>
                  </div>

                  <div
                    className="absolute right-10 bottom-0 w-1 bg-teal-500"
                    style={{ height: '60%' }}
                  />

                  <div className="absolute right-0 bottom-0 left-0 flex justify-between border-t pt-2 text-gray-500 text-xs">
                    <span>04:00 PM</span>
                    <span>09:00 PM</span>
                    <span>02:00 AM</span>
                    <span>07:00 AM</span>
                    <span>12:00 PM</span>
                    <span>05:00 PM</span>
                    <span>10:00 PM</span>
                    <span>03:00 AM</span>
                    <span>08:00 AM</span>
                  </div>
                </div>
              </div>
            </>
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
