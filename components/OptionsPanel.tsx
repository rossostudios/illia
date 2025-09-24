'use client'

import { Info, Plus, X } from 'lucide-react'
import { useState } from 'react'

type OptionsPanelProps = {
  isOpen: boolean
  onClose: () => void
  endpoint: string
}

export default function OptionsPanel({ isOpen, onClose, endpoint }: OptionsPanelProps) {
  const [mainContentOnly, setMainContentOnly] = useState(true)
  const [parsePdf, setParsePdf] = useState(true)
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
    setParsePdf(true)
    setStealthMode(false)
    setExcludeTags([])
    setIncludeTags([])
    setWaitTime('5')
    setTimeout('30')
    setMaxAge('2')
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-96 flex-col bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h3 className="font-semibold text-gray-900 text-lg">Options</h3>
        <button className="rounded-lg p-1 transition-colors hover:bg-gray-100" onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
        {/* Main content only */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700 text-sm">Main content only</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-500 text-xs">1 Credit / PDF Page</span>
            <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                mainContentOnly ? 'bg-orange-500' : 'bg-gray-200'
              }`} onClick={() => setMainContentOnly(!mainContentOnly)}
              type="button"
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
            <span className="font-medium text-gray-700 text-sm">Parse PDF</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-500 text-xs">1 Credit / PDF Page</span>
            <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                parsePdf ? 'bg-orange-500' : 'bg-gray-200'
              }`} onClick={() => setParsePdf(!parsePdf)}
              type="button"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  parsePdf ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Stealth mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700 text-sm">Stealth mode</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-500 text-xs">5 Credits / Page</span>
            <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                stealthMode ? 'bg-orange-500' : 'bg-gray-200'
              }`} onClick={() => setStealthMode(!stealthMode)}
              type="button"
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
            <div className="relative flex items-center space-x-2">
              <span className="font-medium text-gray-700 text-sm">Exclude tags</span>
              <div className="relative">
                <button className="text-gray-400 hover:text-gray-600" onMouseEnter={() => setShowExcludeTooltip(true)
                  onMouseLeave={() => setShowExcludeTooltip(false)}
                  type="button"
                >
                  <Info className="h-4 w-4" />
                </button>
                {showExcludeTooltip && (
                  <div className="absolute top-6 left-0 z-10 w-48 rounded-lg bg-gray-800 p-2 text-white text-xs shadow-lg">
                    Only include tags, classes and ids from the page in the final output. Use comma
                    separated values.
                  </div>
                )}
              </div>
            </div>
            <button className="flex items-center space-x-1 text-gray-600 text-sm hover:text-gray-900" onClick={handleAddExcludeTag}
              
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
          {excludeTags.map((tag, index) => (
            <div
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
              key={index}
            >
              <span className="text-gray-700 text-sm">{tag}</span>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setExcludeTags(excludeTags.filter((_, i) => i !== index))}
                
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <input
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setNewExcludeTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddExcludeTag()}
            placeholder="Add tag to exclude..."
            type="text"
            value={newExcludeTag}
          />
        </div>

        {/* Include tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700 text-sm">Include tags</span>
            <button className="flex items-center space-x-1 text-gray-600 text-sm hover:text-gray-900" onClick={handleAddIncludeTag}
              
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
          {includeTags.map((tag, index) => (
            <div
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
              key={index}
            >
              <span className="text-gray-700 text-sm">{tag}</span>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setIncludeTags(includeTags.filter((_, i) => i !== index))}
                
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <input
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setNewIncludeTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddIncludeTag()}
            placeholder="Add tag to include..."
            type="text"
            value={newIncludeTag}
          />
        </div>

        {/* Wait */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 text-sm">Wait</span>
          <div className="flex items-center space-x-2">
            <input
              className="w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setWaitTime(e.target.value)}
              type="number"
              value={waitTime}
            />
            <span className="text-gray-500 text-sm">seconds</span>
            <span className="text-gray-400 text-xs">ms</span>
          </div>
        </div>

        {/* Timeout */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 text-sm">Timeout</span>
          <div className="flex items-center space-x-2">
            <input
              className="w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setTimeout(e.target.value)}
              type="number"
              value={timeout}
            />
            <span className="text-gray-500 text-sm">seconds</span>
            <span className="text-gray-400 text-xs">ms</span>
          </div>
        </div>

        {/* Max age */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 text-sm">Max age</span>
          <div className="flex items-center space-x-2">
            <input
              className="w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setMaxAge(e.target.value)}
              type="number"
              value={maxAge}
            />
            <span className="text-gray-500 text-sm">days</span>
            <span className="text-gray-400 text-xs">ms</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4">
        <button className="w-full rounded-lg bg-gray-100 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-200" onClick={handleReset}
          
        >
          Reset settings
        </button>
      </div>
    </div>
  )
}
