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
  const [selectedEndpoint, setSelectedEndpoint] = useState('scrape')
  const [url, setUrl] = useState('https://example.com')
  const [format, setFormat] = useState('markdown')
  const [isLoading, setIsLoading] = useState(false)
  const [showExtractMenu, setShowExtractMenu] = useState(false)
  const [showWhatsNew, setShowWhatsNew] = useState(true)
  const [result, setResult] = useState<any>(null)
  const [showRecentRuns, setShowRecentRuns] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const endpoints = [
    { id: 'scrape', label: 'Scrape', icon: '⚡' },
    { id: 'search', label: 'Search', icon: '🔍', badge: 'New' },
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'crawl', label: 'Crawl', icon: '🕸️' }
  ]

  const recentRuns = [
    {
      id: 1,
      url: 'www.firecrawl.dev/',
      endpoint: 'Map',
      status: 'Success',
      date: 'Sep 4, 2025',
      time: '3:38 PM',
      icon: '🔥'
    },
    {
      id: 2,
      url: 'www.nngroup.com/articles/us...',
      endpoint: 'Scrape',
      status: 'Success',
      date: 'Sep 2, 2025',
      time: '7:46 AM'
    },
    {
      id: 3,
      url: 'www.nngroup.com/articles/us...',
      endpoint: 'Scrape',
      status: 'Success',
      date: 'Sep 2, 2025',
      time: '7:38 AM'
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
    const code = `fetch('https://api.firecrawl.dev/v1/${selectedEndpoint}', {
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
                  <span className="text-xs font-semibold text-orange-600">What's New (5)</span>
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

        {/* Playground content */}
        <div className="p-8">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Playground</h1>
            <p className="text-gray-600">API, Docs and Playground - all in one place</p>
          </div>

          {/* Endpoint tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-lg border p-1">
              {endpoints.map((endpoint) => (
                <button
                  key={endpoint.id}
                  onClick={() => setSelectedEndpoint(endpoint.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedEndpoint === endpoint.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{endpoint.icon}</span>
                  <span>{endpoint.label}</span>
                  {endpoint.badge && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
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
                  {selectedEndpoint === 'search' ? (
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 text-gray-900 outline-none"
                      placeholder="Top restaurants in San Francisco"
                    />
                  ) : (
                    <>
                      <span className="text-gray-500 text-sm">https://</span>
                      <input
                        type="text"
                        value={url.replace('https://', '')}
                        onChange={(e) => setUrl('https://' + e.target.value)}
                        className="flex-1 text-gray-900 outline-none"
                        placeholder="example.com"
                      />
                    </>
                  )}
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
                      className="text-sm font-medium text-gray-900 bg-transparent border rounded px-2 py-1 outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="markdown">Markdown</option>
                      <option value="json">JSON</option>
                      <option value="html">HTML</option>
                      <option value="text">Text</option>
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
                    className="flex items-center space-x-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Scraping...</span>
                      </>
                    ) : (
                      <span>Start scraping</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results or Recent Runs */}
          {!result && !isLoading ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Runs</h2>
              <div className="bg-white rounded-xl border">
                <div className="divide-y">
                  {recentRuns.map((run) => (
                    <div key={run.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {run.icon && <span className="text-xl">{run.icon}</span>}
                            <a href={`https://${run.url}`} className="text-gray-900 hover:text-orange-600 font-medium flex items-center">
                              {run.url}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">Endpoint</span>
                              <span className="font-medium flex items-center">
                                {run.endpoint === 'Map' ? '🗺️' : '⚡'} {run.endpoint}
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
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
                  <p className="text-gray-600">Scraping in progress...</p>
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