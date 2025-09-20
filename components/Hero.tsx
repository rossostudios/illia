'use client'

import { useState } from 'react'
import { ArrowRight, Zap, Search, TrendingUp, Sparkles } from 'lucide-react'

export default function Hero() {
  const [url, setUrl] = useState('')
  const [activeTab, setActiveTab] = useState('scrape')
  const [niche, setNiche] = useState('')
  const [zipCode, setZipCode] = useState('29401')
  const [recentLeads, setRecentLeads] = useState([
    { name: 'Sample Plumber', score: 95 },
    { name: 'Charleston HVAC Pro', score: 92 },
    { name: 'Lowcountry Electric', score: 88 }
  ])

  const handleGenerateLeads = () => {
    // Mock lead generation - replace with actual API call
    if (niche && zipCode) {
      const newLead = {
        name: `${niche} in ${zipCode}`,
        score: Math.floor(Math.random() * 20) + 80
      }
      setRecentLeads([newLead, ...recentLeads.slice(0, 2)])
      setNiche('')
    }
  }

  const codeExample = {
    scrape: `{
  "url": "https://example.com",
  "markdown": "# Example Page\\n\\nThis is the page content...",
  "content": "Example Page This is the page content...",
  "html": "<html>...</html>",
  "rawHtml": "<!DOCTYPE html>...",
  "links": [...],
  "screenshot": "https://...",
  "metadata": {...}
}`,
    search: `[
  {
    "url": "https://example.com/page1",
    "content": "Relevant search result 1..."
  },
  {
    "url": "https://example.com/page2",
    "content": "Relevant search result 2..."
  }
]`,
    map: `{
  "url": "https://example.com",
  "links": [
    "https://example.com/about",
    "https://example.com/products",
    "https://example.com/contact"
  ],
  "sitemapUrl": "https://example.com/sitemap.xml"
}`,
    crawl: `[
  {
    "url": "https://example.com",
    "markdown": "# Home Page..."
  },
  {
    "url": "https://example.com/about",
    "markdown": "# About Page..."
  },
  {
    "url": "https://example.com/products",
    "markdown": "# Products..."
  }
]`
  }

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 pt-16 pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-20 w-64 h-64 bg-orange-100 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 top-40 w-96 h-96 bg-orange-50 rounded-full opacity-30 blur-3xl animate-pulse" />
      </div>

      {/* Decorative elements */}
      <div className="absolute left-10 top-32 text-orange-500 text-4xl animate-bounce">+</div>
      <div className="absolute right-10 top-32 text-orange-500 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>+</div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center rounded-full bg-gray-900 px-4 py-1.5 text-sm text-white hover:bg-gray-800 transition-colors cursor-pointer" role="banner" aria-label="Promotional offer">
            <span className="mr-2" aria-hidden="true">⏰</span>
            2 Months Free — Annually
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="w-full bg-teal-50 rounded-xl px-8 py-10 mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-teal-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Welcome to Illia: Your Lowcountry Lead Hub
            </h1>
            <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto">
              Power your Charleston business with AI-scored leads—start generating now.
            </p>
          </div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-100 rounded-full opacity-50 blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-teal-100 rounded-full opacity-50 blur-2xl"></div>
        </div>

        {/* Main heading */}
        <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
          Turn websites into
          <br />
          <span className="text-orange-500">LLM-ready</span> data
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-center text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Power your AI apps with clean data crawled
          <br className="hidden sm:block" />
          from any website. It&apos;s also open source.
        </p>

        {/* Demo section */}
        <div className="mt-12 mx-auto max-w-3xl">
          <div className="rounded-xl border bg-white shadow-lg">
            <div className="p-6">
              {/* URL Input */}
              <div className="flex items-center space-x-3 mb-4">
                <label htmlFor="url-input" className="sr-only">Enter website URL to scrape</label>
                <div className="flex items-center flex-1 rounded-lg border bg-gray-50 px-4 py-2">
                  <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    aria-describedby="url-description"
                  />
                </div>
              </div>
              <div id="url-description" className="sr-only">Enter a website URL to scrape its content using the selected endpoint</div>

              {/* Tabs */}
              <div className="flex items-center space-x-2 sm:space-x-4 mb-4 overflow-x-auto" role="tablist" aria-label="API endpoint selection">
                <button
                  onClick={() => setActiveTab('scrape')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'scrape'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  role="tab"
                  aria-selected={activeTab === 'scrape'}
                  aria-controls="code-preview"
                  aria-label="Scrape endpoint - Get content from a single page"
                >
                  <span className="text-base sm:text-lg" aria-hidden="true">📜</span>
                  <span className="hidden sm:inline">Scrape</span>
                  <span className="sr-only sm:hidden">Scrape</span>
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'search'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  role="tab"
                  aria-selected={activeTab === 'search'}
                  aria-controls="code-preview"
                  aria-label="Search endpoint - Search the web and get full content from results"
                >
                  <span className="text-base sm:text-lg" aria-hidden="true">🔍</span>
                  <span className="hidden sm:inline">Search</span>
                  <span className="sr-only sm:hidden">Search</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded ml-1" aria-label="New feature">New</span>
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'map'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  role="tab"
                  aria-selected={activeTab === 'map'}
                  aria-controls="code-preview"
                  aria-label="Map endpoint - Get all links from a website"
                >
                  <span className="text-base sm:text-lg" aria-hidden="true">🗺️</span>
                  <span className="hidden sm:inline">Map</span>
                  <span className="sr-only sm:hidden">Map</span>
                </button>
                <button
                  onClick={() => setActiveTab('crawl')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'crawl'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  role="tab"
                  aria-selected={activeTab === 'crawl'}
                  aria-controls="code-preview"
                  aria-label="Crawl endpoint - Crawl all pages on a website"
                >
                  <span className="text-base sm:text-lg" aria-hidden="true">🕸️</span>
                  <span className="hidden sm:inline">Crawl</span>
                  <span className="sr-only sm:hidden">Crawl</span>
                </button>
              </div>

              {/* Submit button */}
              <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                aria-label={`Execute ${activeTab} on the entered URL`}
                type="submit"
              >
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Execute {activeTab}</span>
              </button>
            </div>

            {/* Code preview */}
            <div className="border-t bg-gray-50 p-6 rounded-b-xl" role="tabpanel" id="code-preview" aria-labelledby={`${activeTab}-tab`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Output</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-orange-500 font-mono bg-orange-50 px-2 py-0.5 rounded" aria-label="Output format">JSON</span>
                </div>
              </div>
              <pre className="text-xs text-gray-700 font-mono overflow-x-auto bg-white p-4 rounded-lg border" aria-label={`Example ${activeTab} API response`}>
                <code>{codeExample[activeTab as keyof typeof codeExample]}</code>
              </pre>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <span>url</span>
              <span className="text-orange-500 font-mono">https://example.com</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Scrapes, crawls, and extracts data from a URL.
            </div>
          </div>
        </div>

        {/* Four Action Cards Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Top-Left Card - Quick Generate */}
          <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-teal-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-3">
              <Zap className="h-6 w-6 text-teal-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Quick Generate</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Get ready-to-call leads from Charleston ZIPs.</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Niche (e.g., plumbers)"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleGenerateLeads}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Go
              </button>
            </div>
          </div>

          {/* Top-Right Card - Recent Leads */}
          <div className="bg-white rounded-lg p-6 shadow-lg border-r-4 border-teal-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-3">
              <Search className="h-6 w-6 text-teal-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Top 3 from your last run.</p>
            <ul className="space-y-2 mb-4">
              {recentLeads.map((lead, index) => (
                <li key={index} className="text-sm text-gray-700">
                  • {lead.name} ({lead.score} score)
                </li>
              ))}
            </ul>
            <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              View All & Export CSV →
            </button>
          </div>

          {/* Bottom-Left Card - Analytics */}
          <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-teal-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-3">
              <TrendingUp className="h-6 w-6 text-teal-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Track your Lowcountry ROI.</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">25%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
              <div className="mt-2 text-xs text-gray-500">Last 30 days</div>
            </div>
          </div>

          {/* Bottom-Right Card - Upgrade */}
          <div className="bg-white rounded-lg p-6 shadow-lg border-r-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-3">
              <Sparkles className="h-6 w-6 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Upgrade</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Unlock Pro for 30+ leads.</p>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-700">✓ Unlimited leads</div>
              <div className="text-sm text-gray-700">✓ Advanced scoring</div>
              <div className="text-sm text-gray-700">✓ Priority support</div>
            </div>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Go Pro
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}