'use client'

import { useState } from 'react'
import { X, MapPin, Clock, Hash } from 'lucide-react'

interface SearchOptionsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOptionsPanel({ isOpen, onClose }: SearchOptionsPanelProps) {
  const [limit, setLimit] = useState('10')
  const [timeRange, setTimeRange] = useState('')
  const [location, setLocation] = useState('San Francisco, California, United States')
  const [scrapeResults, setScrapeResults] = useState(true)
  const [mainContentOnly, setMainContentOnly] = useState(true)
  const [parsePDF, setParsePDF] = useState(true)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)

  const timeOptions = [
    { label: 'Past hour', value: 'hour' },
    { label: 'Past 24 hours', value: '24hours' },
    { label: 'Past week', value: 'week' },
    { label: 'Past month', value: 'month' },
    { label: 'Past year', value: 'year' }
  ]

  const handleReset = () => {
    setLimit('10')
    setTimeRange('')
    setLocation('San Francisco, California, United States')
    setScrapeResults(true)
    setMainContentOnly(true)
    setParsePDF(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Options</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {/* Limit */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Limit</span>
          </div>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Time-based */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Time-based <span className="text-gray-400">(Optional)</span>
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="w-full px-3 py-2 text-left border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {timeRange ? timeOptions.find(opt => opt.value === timeRange)?.label : 'Select a time'}
              <svg className="absolute right-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showTimeDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTimeRange(option.value)
                      setShowTimeDropdown(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
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
              <span className="text-sm font-medium text-gray-700">
                Location <span className="text-gray-400">(Optional)</span>
              </span>
            </div>
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter location..."
          />
        </div>

        {/* Scrape content from search results */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Scrape content from search results</span>
          </div>
          <button
            onClick={() => setScrapeResults(!scrapeResults)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              scrapeResults ? 'bg-orange-500' : 'bg-gray-200'
            }`}
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
          <p className="text-xs text-gray-500 mb-4">Scrape</p>
        </div>

        {/* Main content only */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Main content only</span>
          </div>
          <button
            onClick={() => setMainContentOnly(!mainContentOnly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              mainContentOnly ? 'bg-orange-500' : 'bg-gray-200'
            }`}
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
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Parse PDF</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500">1 Credit / PDF Page</span>
            <button
              onClick={() => setParsePDF(!parsePDF)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                parsePDF ? 'bg-orange-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  parsePDF ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t">
        <button
          onClick={handleReset}
          className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Reset settings
        </button>
      </div>
    </div>
  )
}