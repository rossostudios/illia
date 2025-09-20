'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const [url, setUrl] = useState('')
  const [activeTab, setActiveTab] = useState('scrape')

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
          <div className="inline-flex items-center rounded-full bg-gray-900 px-4 py-1.5 text-sm text-white hover:bg-gray-800 transition-colors cursor-pointer">
            <span className="mr-2">⏰</span>
            2 Months Free — Annually
          </div>
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
          from any website. It's also open source.
        </p>

        {/* Demo section */}
        <div className="mt-12 mx-auto max-w-3xl">
          <div className="rounded-xl border bg-white shadow-lg">
            <div className="p-6">
              {/* URL Input */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center flex-1 rounded-lg border bg-gray-50 px-4 py-2">
                  <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center space-x-2 sm:space-x-4 mb-4 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('scrape')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'scrape'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="text-base sm:text-lg">📜</span>
                  <span className="hidden sm:inline">Scrape</span>
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'search'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="text-base sm:text-lg">🔍</span>
                  <span className="hidden sm:inline">Search</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded ml-1">New</span>
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'map'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="text-base sm:text-lg">🗺️</span>
                  <span className="hidden sm:inline">Map</span>
                </button>
                <button
                  onClick={() => setActiveTab('crawl')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'crawl'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="text-base sm:text-lg">🕸️</span>
                  <span className="hidden sm:inline">Crawl</span>
                </button>
              </div>

              {/* Submit button */}
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Code preview */}
            <div className="border-t bg-gray-50 p-6 rounded-b-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Output</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-orange-500 font-mono bg-orange-50 px-2 py-0.5 rounded">JSON</span>
                </div>
              </div>
              <pre className="text-xs text-gray-700 font-mono overflow-x-auto bg-white p-4 rounded-lg border">
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
      </div>
    </section>
  )
}