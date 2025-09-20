'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Home,
  Play,
  FileText,
  BarChart3,
  Key,
  Settings,
  ChevronDown,
  Bell,
  HelpCircle,
  FileCode,
  X,
  Sparkles,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react'

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
        { label: 'Playground', href: '/dashboard/extract/playground' }
      ]
    },
    { icon: BarChart3, label: 'Activity Logs', href: '/dashboard/logs' },
    { icon: BarChart3, label: 'Usage', href: '/dashboard/usage', active: true },
    { icon: Key, label: 'API Keys', href: '/dashboard/api-keys' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-56 bg-white border-r">
        {/* Logo */}
        <div className="p-4 border-b">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">🔥</span>
            <span className="text-xl font-semibold">Firecrawl</span>
          </Link>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  item.active
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
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
                  <ChevronDown className={`h-4 w-4 transition-transform ${item.isOpen ? 'rotate-180' : ''}`} />
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
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-600">What's New</span>
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
            <div className="mt-4 px-3 py-2 text-xs text-gray-500">
              samlee@content-mobbin.com
            </div>

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
              <div className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-lg">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Personal Team</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
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

        {/* Usage content */}
        <div className="p-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Usage</h1>
            <p className="text-gray-600">Monitor your API usage and track performance</p>
          </div>

          {/* Billing Cycle Tabs */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 border-b">
              <button
                onClick={() => setBillingCycle('current')}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  billingCycle === 'current'
                    ? 'text-orange-600 border-orange-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">1</span>
                  <span className="text-xs text-gray-400">/ 3 |</span>
                  <span>CURRENT BILLING CYCLE</span>
                </span>
              </button>
              <button
                onClick={() => setBillingCycle('historical')}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  billingCycle === 'historical'
                    ? 'text-orange-600 border-orange-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">2</span>
                  <span className="text-xs text-gray-400">/ 3 |</span>
                  <span>HISTORICAL USAGE</span>
                </span>
              </button>
            </div>
          </div>

          {billingCycle === 'current' ? (
            <>
              {/* Note */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  Note: Usage data may take at least one hour to reflect recent activity.
                </p>
              </div>

              {/* Usage Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Credit Usage */}
                <div className="bg-white rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Credit Usage</h3>
                    <span className="text-2xl font-bold">4%</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Credits Used</p>
                      <div className="flex items-end space-x-2">
                        <span className="text-2xl font-bold">21</span>
                        <span className="text-sm text-gray-500">/ 525 credits</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: '4%' }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Additional credits remaining (coupon)</span>
                        <span className="font-medium">4</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Credits reset on undefined{' '}
                        <Link href="/manage" className="text-orange-600 hover:underline">
                          Manage plan
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Extract Tokens Usage */}
                <div className="bg-white rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Extract Tokens Usage</h3>
                    <span className="text-2xl font-bold">0%</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Tokens Used</p>
                      <div className="flex items-end space-x-2">
                        <span className="text-2xl font-bold">358</span>
                        <span className="text-sm text-gray-500">/ 500,000 tokens</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Additional tokens remaining (coupon)</span>
                        <span className="font-medium">0</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Credit billing is via Stripe{' '}
                        <Link href="/manage" className="text-orange-600 hover:underline">
                          Manage plan
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex justify-end mb-4">
                <div className="flex bg-white border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setChartView('weekly')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      chartView === 'weekly'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setChartView('monthly')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      chartView === 'monthly'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Usage Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* API Credits Chart */}
                <div className="bg-white rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">API Credits</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Sep 2025 - Sep 2025 (by {chartView === 'weekly' ? 'week' : 'month'})
                      </p>
                    </div>
                    <span className="text-2xl font-bold">21 credits</span>
                  </div>

                  <div className="h-48 relative">
                    <div className="absolute inset-0">
                      {/* Chart area with background gradient */}
                      <svg className="w-full h-full">
                        <defs>
                          <linearGradient id="creditGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#fb923c" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 140 L 100 138 L 200 135 L 300 120 L 400 100 L 400 180 L 0 180 Z"
                          fill="url(#creditGradient)"
                        />
                        <path
                          d="M 0 140 L 100 138 L 200 135 L 300 120 L 400 100"
                          stroke="#fb923c"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                      <span>Week 1, Sep 2025</span>
                      <span>Week 2, Sep 2025</span>
                    </div>
                  </div>
                </div>

                {/* Extract Tokens Chart */}
                <div className="bg-white rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Extract Tokens</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Sep 2025 - Sep 2025 (by {chartView === 'weekly' ? 'week' : 'month'})
                      </p>
                    </div>
                    <span className="text-2xl font-bold">358 tokens</span>
                  </div>

                  <div className="h-48 relative flex items-end justify-center">
                    <div className="h-2 w-2 bg-orange-500 rounded-full" />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                      <span>Week 2, Sep 2025</span>
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
                    onClick={() => setHistoricalView('browser')}
                    className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                      historicalView === 'browser'
                        ? 'text-orange-600 border-orange-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-lg">3</span>
                      <span className="text-xs text-gray-400">/ 3 |</span>
                      <span>HISTORICAL BROWSER CONCURRENCY</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Concurrency Chart */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-medium text-gray-700">MAX CONCURRENCY: 2</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>2</span>
                    <span className="border-l h-4" />
                    <span>1.5</span>
                    <span className="border-l h-4" />
                    <span>1</span>
                    <span className="border-l h-4" />
                    <span>0.5</span>
                    <span className="border-l h-4" />
                    <span>0</span>
                  </div>
                </div>

                <div className="h-64 relative">
                  <div className="absolute top-0 left-0 right-0 border-t-2 border-dashed border-gray-300" style={{ top: '0%' }}>
                    <span className="absolute -top-3 -left-8 text-xs text-gray-500">2</span>
                  </div>

                  <div className="absolute bottom-0 right-10 w-1 bg-orange-500" style={{ height: '60%' }} />

                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pt-2 border-t">
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
      <button className="fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg">
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}