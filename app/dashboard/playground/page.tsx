'use client'

import { useState } from 'react'
import Link from 'next/link'
import OptionsPanel from '@/components/OptionsPanel'
import SearchOptionsPanel from '@/components/SearchOptionsPanel'
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
  Globe,
  Map,
  MapPin,
  Sparkles,
  ExternalLink,
  Copy,
  Download,
  Check,
  Loader2,
  MessageSquare,
  ChevronLeft,
  SlidersHorizontal
} from 'lucide-react'

export default function PlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('generate')
  const [url, setUrl] = useState('plumbers, 29401')
  const [format, setFormat] = useState('CSV')
  const [isLoading, setIsLoading] = useState(false)
  const [showExtractMenu, setShowExtractMenu] = useState(false)
  const [showWhatsNew, setShowWhatsNew] = useState(true)
  const [result, setResult] = useState<any>(null)
  const [showRecentRuns, setShowRecentRuns] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const endpoints = [
    { id: 'generate', label: 'Generate', icon: '⚡' },
    { id: 'basic', label: 'Basic', icon: '🔍', badge: 'New' },
    { id: 'advanced', label: 'Advanced', icon: '🎯' },
    { id: 'export', label: 'Export', icon: '📊' }
  ]

  const recentRuns = [
    {
      id: 1,
      query: 'plumbers 29401',
      mode: 'Basic',
      status: 'Success',
      date: 'Sep 20',
      time: '3:38 PM',
      icon: '🔍'
    },
    {
      id: 2,
      query: 'HVAC contractors 29403',
      mode: 'Advanced',
      status: 'Success',
      date: 'Sep 20',
      time: '2:15 PM',
      icon: '🎯'
    },
    {
      id: 3,
      query: 'electricians 29401',
      mode: 'Basic',
      status: 'Success',
      date: 'Sep 19',
      time: '4:22 PM',
      icon: '🔍'
    }
  ]

  const sidebarItems = [
    { icon: Home, label: 'Overview', href: '/dashboard' },
    { icon: Play, label: 'Playground', href: '/dashboard/playground', active: true },
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
    { icon: BarChart3, label: 'Usage', href: '/dashboard/usage' },
    { icon: Key, label: 'API Keys', href: '/dashboard/api-keys' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

  const handleStartScraping = async () => {
    setIsLoading(true)
    setShowRecentRuns(false)

    // Simulate API call
    setTimeout(() => {
      setResult({
        status: 'success',
        data: {
          title: 'Example Domain',
          content: '# Example Domain\n\nThis domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.\n\n[More information...](https://www.iana.org/domains/example)',
          metadata: {
            statusCode: 200,
            contentType: 'text/html',
            timestamp: new Date().toISOString()
          }
        }
      })
      setIsLoading(false)
    }, 2000)
  }

  const handleGetCode = () => {
    // Copy code to clipboard logic
    const code = `fetch('https://api.illia.dev/v1/${selectedEndpoint}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    url: '${url}',
    format: '${format}'
  })
})`
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).catch((err) => {
        console.error('Failed to copy code:', err)
      })
    }
  }

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
                  item.active
                    ? 'bg-teal-50 text-teal-600'
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

        {/* Playground content */}
        <div className="p-8">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-teal-600 mb-2 flex items-center justify-center">
              <MapPin className="h-8 w-8 mr-2" />
              Lead Playground
            </h1>
            <p className="text-gray-700">Lead Playground - Test & Generate in One Place</p>
          </div>

          {/* Endpoint tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex flex-wrap bg-white rounded-lg border p-1">
              {endpoints.map((endpoint) => (
                <button
                  key={endpoint.id}
                  onClick={() => setSelectedEndpoint(endpoint.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedEndpoint === endpoint.id
                      ? 'bg-teal-100 text-teal-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{endpoint.icon}</span>
                  <span>{endpoint.label}</span>
                  {endpoint.badge && (
                    <span className="text-xs bg-teal-100 text-teal-600 px-1.5 py-0.5 rounded-full">
                      {endpoint.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* URL/Search Input and Controls */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-1 flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-teal-600" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 text-gray-900 bg-gray-200 px-3 py-2 rounded-md outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                    placeholder="plumbers, 29401"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                      showOptions ? 'bg-gray-100' : ''
                    }`}
                  >
                    <SlidersHorizontal className="h-4 w-4 text-gray-600" />
                  </button>

                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Format:</span>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="text-sm font-medium text-gray-900 bg-transparent border rounded px-2 py-1 outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="CSV">CSV</option>
                      <option value="JSON">JSON</option>
                      <option value="Preview">Preview</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleGetCode}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="text-sm font-medium">Get code</span>
                  </button>
                  <button
                    onClick={handleStartScraping}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-6 py-2 bg-teal-500 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <span>Generate Leads</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results or Recent Generations */}
          {!result && !isLoading ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Generations</h2>
              <div className="bg-white rounded-xl border">
                <div className="divide-y">
                  {recentRuns.map((run) => (
                    <div key={run.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {run.icon && <span className="text-xl">{run.icon}</span>}
                            <span className="text-gray-900 font-medium">
                              {run.query}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">Mode</span>
                              <span className="font-medium flex items-center">
                                {run.icon} {run.mode}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">Status</span>
                              <span className="flex items-center">
                                <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5" />
                                <span className="font-medium text-green-600">{run.status}</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">Started</span>
                              <span className="font-medium">{run.date}</span>
                              <span className="text-gray-400">{run.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border p-8">
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-500 mb-4" />
                  <p className="text-gray-600">Generating leads...</p>
                </div>
              </div>
            </div>
          ) : result ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Result</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Copy className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Download className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {format === 'markdown' ? result.data.content : JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Options Panel */}
      {selectedEndpoint === 'search' ? (
        <SearchOptionsPanel
          isOpen={showOptions}
          onClose={() => setShowOptions(false)}
        />
      ) : (
        <OptionsPanel
          isOpen={showOptions}
          onClose={() => setShowOptions(false)}
          endpoint={selectedEndpoint}
        />
      )}

      {/* Intercom Chat */}
      <button className="fixed bottom-4 right-4 bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-full shadow-lg">
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