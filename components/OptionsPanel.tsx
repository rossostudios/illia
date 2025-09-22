'use client'

import { Info, Plus, X } from 'lucide-react'
import { useState } from 'react'

interface OptionsPanelProps {
  isOpen: boolean
  onClose: () => void
  endpoint: string
}

export default function OptionsPanel({ isOpen, onClose, endpoint }: OptionsPanelProps) {
  const [mainContentOnly, setMainContentOnly] = useState(true)
  const [parsePDF, setParsePDF] = useState(true)
  const [stealthMode, setStealthMode] = useState(false)
  const [excludeTags, setExcludeTags] = useState<string[]>([])
  const [includeTags, setIncludeTags] = useState<string[]>([])
  const [waitTime, setWaitTime] = useState('5')
  const [timeout, setTimeout] = useState('30')
  const [maxAge, setMaxAge] = useState('2')
  const [newExcludeTag, setNewExcludeTag] = useState('')
  const [newIncludeTag, setNewIncludeTag] = useState('')
  const [showExcludeTooltip, setShowExcludeTooltip] = useState(false)

  const handleAddExcludeTag = () => {
    if (newExcludeTag.trim()) {
      setExcludeTags([...excludeTags, newExcludeTag.trim()])
      setNewExcludeTag('')
    }
  }

  const handleAddIncludeTag = () => {
    if (newIncludeTag.trim()) {
      setIncludeTags([...includeTags, newIncludeTag.trim()])
      setNewIncludeTag('')
    }
  }

  const handleReset = () => {
    setMainContentOnly(true)
    setParsePDF(true)
    setStealthMode(false)
    setExcludeTags([])
    setIncludeTags([])
    setWaitTime('5')
    setTimeout('30')
    setMaxAge('2')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Options</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Main content only */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Main content only</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500">1 Credit / PDF Page</span>
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
        </div>

        {/* Parse PDF */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
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

        {/* Stealth mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Stealth mode</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500">5 Credits / Page</span>
            <button
              onClick={() => setStealthMode(!stealthMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                stealthMode ? 'bg-orange-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  stealthMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Exclude tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 relative">
              <span className="text-sm font-medium text-gray-700">Exclude tags</span>
              <div className="relative">
                <button
                  onMouseEnter={() => setShowExcludeTooltip(true)}
                  onMouseLeave={() => setShowExcludeTooltip(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Info className="h-4 w-4" />
                </button>
                {showExcludeTooltip && (
                  <div className="absolute left-0 top-6 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
                    Only include tags, classes and ids from the page in the final output. Use comma
                    separated values.
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleAddExcludeTag}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
          {excludeTags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
            >
              <span className="text-sm text-gray-700">{tag}</span>
              <button
                onClick={() => setExcludeTags(excludeTags.filter((_, i) => i !== index))}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <input
            type="text"
            value={newExcludeTag}
            onChange={(e) => setNewExcludeTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddExcludeTag()}
            placeholder="Add tag to exclude..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Include tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Include tags</span>
            <button
              onClick={handleAddIncludeTag}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
          {includeTags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
            >
              <span className="text-sm text-gray-700">{tag}</span>
              <button
                onClick={() => setIncludeTags(includeTags.filter((_, i) => i !== index))}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <input
            type="text"
            value={newIncludeTag}
            onChange={(e) => setNewIncludeTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddIncludeTag()}
            placeholder="Add tag to include..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Wait */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Wait</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={waitTime}
              onChange={(e) => setWaitTime(e.target.value)}
              className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-500">seconds</span>
            <span className="text-xs text-gray-400">ms</span>
          </div>
        </div>

        {/* Timeout */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Timeout</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
              className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-500">seconds</span>
            <span className="text-xs text-gray-400">ms</span>
          </div>
        </div>

        {/* Max age */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Max age</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-500">days</span>
            <span className="text-xs text-gray-400">ms</span>
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
