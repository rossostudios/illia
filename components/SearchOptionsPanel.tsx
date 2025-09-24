'use client'

import { Clock, Hash, MapPin, X } from 'lucide-react'
import { useState } from 'react'

type SearchOptionsPanelProps = {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOptionsPanel({ isOpen, onClose }: SearchOptionsPanelProps) {
  const [limit, setLimit] = useState('10')
  const [timeRange, setTimeRange] = useState('')
  const [location, setLocation] = useState('San Francisco, California, United States')
  const [scrapeResults, setScrapeResults] = useState(true)
  const [mainContentOnly, setMainContentOnly] = useState(true)
  const [parsePdf, setParsePdf] = useState(true)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)

  const timeOptions = [
    { label: 'Past hour', value: 'hour' },
    { label: 'Past 24 hours', value: '24hours' },
    { label: 'Past week', value: 'week' },
    { label: 'Past month', value: 'month' },
    { label: 'Past year', value: 'year' },
  ]

  const handleReset = () => {
    setLimit('10')
    setTimeRange('')
    setLocation('San Francisco, California, United States')
    setScrapeResults(true)
    setMainContentOnly(true)
    setParsePdf(true)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-96 flex-col bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h3 className="font-semibold text-gray-900 text-lg">Options</h3>
        <button className="rounded-lg p-1 transition-colors hover:bg-gray-100" onClick={onClose}>
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
        {/* Limit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-700 text-sm">Limit</span>
          </div>
          <input
            className="w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setLimit(e.target.value)}
            type="number"
            value={limit}
          />
        </div>

        {/* Time-based */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-700 text-sm">
                Time-based <span className="text-gray-400">(Optional)</span>
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            >
              {timeRange
                ? timeOptions.find((opt) => opt.value === timeRange)?.label
                : 'Select a time'}
              <svg
                aria-label="icon"
                className="absolute top-3 right-3 h-4 w-4 text-gray-400"
                fill="none"
                role="img"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Icon</title>
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
            {showTimeDropdown && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                {timeOptions.map((option) => (
                  <button
                    className="w-full px-3 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50"
                    key={option.value}
                    onClick={() => {
                      setTimeRange(option.value)
                      setShowTimeDropdown(false)
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-700 text-sm">
                Location <span className="text-gray-400">(Optional)</span>
              </span>
            </div>
          </div>
          <input
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location..."
            type="text"
            value={location}
          />
        </div>

        {/* Scrape content from search results */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <svg
              aria-label="icon"
              className="h-4 w-4 text-gray-400"
              fill="none"
              role="img"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Icon</title>
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <span className="font-medium text-gray-700 text-sm">
              Scrape content from search results
            </span>
          </div>
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              scrapeResults ? 'bg-orange-500' : 'bg-gray-200'
            }`}
            onClick={() => setScrapeResults(!scrapeResults)}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                scrapeResults ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Divider */}
        <div className="border-t pt-4">
          <p className="mb-4 text-gray-500 text-xs">Scrape</p>
        </div>

        {/* Main content only */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              aria-label="icon"
              className="h-4 w-4 text-gray-400"
              fill="none"
              role="img"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Icon</title>
              <path
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <span className="font-medium text-gray-700 text-sm">Main content only</span>
          </div>
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              mainContentOnly ? 'bg-orange-500' : 'bg-gray-200'
            }`}
            onClick={() => setMainContentOnly(!mainContentOnly)}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mainContentOnly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Parse PDF */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              aria-label="icon"
              className="h-4 w-4 text-gray-400"
              fill="none"
              role="img"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Icon</title>
              <path
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <span className="font-medium text-gray-700 text-sm">Parse PDF</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-500 text-xs">1 Credit / PDF Page</span>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                parsePdf ? 'bg-orange-500' : 'bg-gray-200'
              }`}
              onClick={() => setParsePdf(!parsePdf)}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  parsePdf ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4">
        <button
          className="w-full rounded-lg bg-gray-100 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-200"
          onClick={handleReset}
        >
          Reset settings
        </button>
      </div>
    </div>
  )
}
