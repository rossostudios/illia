'use client'

import {
  BarChart3,
  Bell,
  ChevronDown,
  ChevronLeft,
  Download,
  ExternalLink,
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

export default function ExtractPage() {
  const [showExtractMenu, setShowExtractMenu] = useState(true)
  const [showWhatsNew, setShowWhatsNew] = useState(true)

  const sidebarItems = [
    { icon: Home, label: 'Overview', href: '/dashboard' },
    { icon: Play, label: 'Playground', href: '/dashboard/playground' },
    {
      icon: FileText,
      label: 'Extract',
      href: '/dashboard/extract',
      active: true,
      hasSubmenu: true,
      isOpen: showExtractMenu,
      submenu: [
        { label: 'Overview', href: '/dashboard/extract', active: true },
        { label: 'Playground', href: '/dashboard/extract/playground' },
      ],
    },
    { icon: BarChart3, label: 'Activity Logs', href: '/dashboard/logs' },
    { icon: BarChart3, label: 'Usage', href: '/dashboard/usage' },
    { icon: Key, label: 'API Keys', href: '/dashboard/api-keys' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

  const extractLogs = [
    {
      id: 1,
      query: 'plumbers 29401',
      date: 'Sep 08',
      time: '10:15 AM',
      leads: 12,
      hasLink: true,
    },
    {
      id: 2,
      query: 'cafes King St',
      date: 'Sep 20',
      time: '3:38 PM',
      leads: 8,
      hasLink: true,
    },
  ]

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
              placeholder="Search past leads..."
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
                      className={`block px-3 py-2 text-sm rounded-lg ${
                        subitem.active
                          ? 'text-teal-600 bg-teal-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
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
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </header>

        {/* Extract content */}
        <div className="p-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-teal-600 mb-2 flex items-center">
              <Download className="h-6 w-6 mr-2" />
              Lead Extract Overview
            </h1>
            <p className="text-gray-700">
              Extract structured leads from single niches, multiple ZIPs, or entire Charleston areas
              with AI.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Lead Docs Card */}
            <Link
              href="/docs/extract"
              className="bg-white rounded-xl border border-teal-200 p-6 hover:border-teal-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <FileText className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Lead Docs</h3>
              </div>
              <p className="text-sm text-gray-600">Explore lead gen reference and guides</p>
            </Link>

            {/* Lead Playground Card */}
            <Link
              href="/dashboard/playground"
              className="bg-white rounded-xl border border-teal-200 p-6 hover:border-teal-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <Play className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Lead Playground</h3>
              </div>
              <p className="text-sm text-gray-600">Easily get structured leads</p>
            </Link>

            {/* Integrations Card */}
            <Link
              href="/integrations/zapier"
              className="bg-white rounded-xl border border-teal-200 p-6 hover:border-teal-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <svg className="h-5 w-5 text-teal-600" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Integrations</h3>
              </div>
              <p className="text-sm text-gray-600">Integrate to automate workflows</p>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Usage Section */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Usage</h2>
                <span className="text-2xl font-bold text-teal-600">7%</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Leads Extracted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-semibold text-gray-900">
                      {extractLogs.length > 0 ? '35' : '0'}
                    </span>
                    <span className="text-sm text-gray-500">/ 500 leads</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: '7%' }}></div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Bonus leads from promo (ZIP 29401 focus)
                    </span>
                    <span className="text-sm font-medium">15</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Billing via Stripe—
                    <Link href="/manage" className="text-teal-600 hover:underline">
                      Pro unlocks unlimited
                    </Link>
                  </p>
                </div>
              </div>

              {/* Recent Lead Pulls */}
              {extractLogs.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Recent Lead Pulls</h3>
                  <div className="space-y-3">
                    {extractLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-teal-700 font-medium flex items-center">
                            {log.query}
                            {log.hasLink && <ExternalLink className="h-3 w-3 ml-1 text-teal-600" />}
                          </span>
                          <button
                            className="text-teal-600 hover:text-teal-700"
                            title="Download leads"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            <span className="text-gray-500">
                              {log.date} • {log.time}
                            </span>
                          </div>
                          <span className="text-green-600 font-medium">{log.leads} leads</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">Showing 1-2 of 2 items • Page 1</p>
                  </div>
                </div>
              )}

              {extractLogs.length === 0 && (
                <div className="mt-8 text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No extract logs yet</p>
                </div>
              )}
            </div>

            {/* Lead Extraction Pricing */}
            <div className="bg-teal-50 rounded-xl border border-teal-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Lead Extraction Pricing</h2>
                <Link
                  href="/pricing"
                  className="text-sm text-teal-700 hover:text-teal-900 flex items-center"
                >
                  <span>View plans</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </div>

              <p className="text-sm text-gray-700 mb-6">
                Unlock more extractions and higher limits with Pro subscription.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Unlimited Charleston area searches</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Advanced lead scoring</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">CRM integration</span>
                </div>
              </div>

              <Link
                href="/pricing"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
              >
                View Plans
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
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
