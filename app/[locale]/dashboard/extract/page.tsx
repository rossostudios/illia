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
              placeholder="Search past leads..."
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
                      className={`block rounded-lg px-3 py-2 text-sm ${
                        subitem.active
                          ? 'bg-teal-50 text-teal-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
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
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-gray-600 text-xs">View our latest update</p>
            </div>

            {/* User email */}
            <div className="mt-4 px-3 py-2 text-gray-500 text-xs">samlee@content-mobbin.com</div>

            {/* Collapse button */}
            <button
              className="mt-2 flex items-center space-x-2 text-gray-600 text-xs hover:text-gray-900"
              type="button"
            >
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
              <button
                className="rounded-lg bg-teal-500 px-4 py-1.5 font-medium text-sm text-white transition-colors hover:bg-teal-600"
                type="button"
              >
                Upgrade
              </button>
            </div>
          </div>
        </header>

        {/* Extract content */}
        <div className="p-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className="mb-2 flex items-center font-bold text-2xl text-teal-600">
              <Download className="mr-2 h-6 w-6" />
              Lead Extract Overview
            </h1>
            <p className="text-gray-700">
              Extract structured leads from single niches, multiple ZIPs, or entire Charleston areas
              with AI.
            </p>
          </div>

          {/* Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Lead Docs Card */}
            <Link
              className="group rounded-xl border border-teal-200 bg-white p-6 transition-all hover:border-teal-500 hover:shadow-lg"
              href="/docs/extract"
            >
              <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-lg bg-teal-50 p-2">
                  <FileText className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Lead Docs</h3>
              </div>
              <p className="text-gray-600 text-sm">Explore lead gen reference and guides</p>
            </Link>

            {/* Lead Playground Card */}
            <Link
              className="group rounded-xl border border-teal-200 bg-white p-6 transition-all hover:border-teal-500 hover:shadow-lg"
              href="/dashboard/playground"
            >
              <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-lg bg-teal-50 p-2">
                  <Play className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Lead Playground</h3>
              </div>
              <p className="text-gray-600 text-sm">Easily get structured leads</p>
            </Link>

            {/* Integrations Card */}
            <Link
              className="group rounded-xl border border-teal-200 bg-white p-6 transition-all hover:border-teal-500 hover:shadow-lg"
              href="/integrations/zapier"
            >
              <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-lg bg-teal-50 p-2">
                  <svg
                    aria-label="icon"
                    className="h-5 w-5 text-teal-600"
                    fill="none"
                    role="img"
                    viewBox="0 0 24 24"
                  >
                    <title>Icon</title>
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Integrations</h3>
              </div>
              <p className="text-gray-600 text-sm">Integrate to automate workflows</p>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Usage Section */}
            <div className="rounded-xl border bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-lg">Usage</h2>
                <span className="font-bold text-2xl text-teal-600">7%</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Leads Extracted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 text-xl">
                      {extractLogs.length > 0 ? '35' : '0'}
                    </span>
                    <span className="text-gray-500 text-sm">/ 500 leads</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: '7%' }} />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">
                      Bonus leads from promo (ZIP 29401 focus)
                    </span>
                    <span className="font-medium text-sm">15</span>
                  </div>
                  <p className="mt-2 text-gray-500 text-sm">
                    Billing via Stripe—
                    <Link className="text-teal-600 hover:underline" href="/manage">
                      Pro unlocks unlimited
                    </Link>
                  </p>
                </div>
              </div>

              {/* Recent Lead Pulls */}
              {extractLogs.length > 0 && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="mb-4 font-medium text-gray-700 text-sm">Recent Lead Pulls</h3>
                  <div className="space-y-3">
                    {extractLogs.map((log) => (
                      <div
                        className="rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                        key={log.id}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="flex items-center font-medium text-sm text-teal-700">
                            {log.query}
                            {log.hasLink && <ExternalLink className="ml-1 h-3 w-3 text-teal-600" />}
                          </span>
                          <button
                            className="text-teal-600 hover:text-teal-700"
                            title="Download leads"
                            type="button"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-gray-500">
                              {log.date} • {log.time}
                            </span>
                          </div>
                          <span className="font-medium text-green-600">{log.leads} leads</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-gray-500 text-xs">Showing 1-2 of 2 items • Page 1</p>
                  </div>
                </div>
              )}

              {extractLogs.length === 0 && (
                <div className="mt-8 py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <FileText className="h-8 w-8 text-gray-700" />
                  </div>
                  <p className="text-gray-500 text-sm">No extract logs yet</p>
                </div>
              )}
            </div>

            {/* Lead Extraction Pricing */}
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-lg">Lead Extraction Pricing</h2>
                <Link
                  className="flex items-center text-sm text-teal-700 hover:text-teal-900"
                  href="/pricing"
                >
                  <span>View plans</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>

              <p className="mb-6 text-gray-700 text-sm">
                Unlock more extractions and higher limits with Pro subscription.
              </p>

              <div className="mb-6 space-y-3">
                <div className="flex items-center text-sm">
                  <span className="mr-2 text-green-600">✓</span>
                  <span className="text-gray-700">Unlimited Charleston area searches</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="mr-2 text-green-600">✓</span>
                  <span className="text-gray-700">Advanced lead scoring</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="mr-2 text-green-600">✓</span>
                  <span className="text-gray-700">CRM integration</span>
                </div>
              </div>

              <Link
                className="inline-flex w-full items-center justify-center rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700"
                href="/pricing"
              >
                View Plans
                <svg
                  aria-label="icon"
                  className="ml-2 h-4 w-4"
                  fill="none"
                  role="img"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Icon</title>
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Intercom Chat */}
      <button
        className="fixed right-4 bottom-4 rounded-full bg-teal-500 p-4 text-white shadow-lg hover:bg-teal-600"
        type="button"
      >
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
