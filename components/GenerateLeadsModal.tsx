'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSession } from '@/hooks/useSession'
import { X, Loader2, Sparkles } from 'lucide-react'

interface GenerateLeadsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function GenerateLeadsModal({ isOpen, onClose, onSuccess }: GenerateLeadsModalProps) {
  const { user } = useSession()
  const supabase = createClient()

  const [niche, setNiche] = useState('plumbers')
  const [location, setLocation] = useState('Charleston, SC')
  const [zipCode, setZipCode] = useState('29401')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleGenerate = async () => {
    if (!user?.email) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche,
          location,
          zipCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate leads')
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message || 'Failed to generate leads')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Generate Leads</h2>
              <p className="text-sm text-gray-500">Find high-quality leads for your business</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Niche
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., plumbers, electricians, restaurants"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Charleston, SC"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="e.g., 29401"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                disabled={loading}
              />
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm">
              <p className="text-teal-800">
                <strong>Tip:</strong> Be specific with your niche for better results.
                For example, "emergency plumbers" instead of just "plumbers".
              </p>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
              disabled={loading || !niche || !location || !zipCode}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Leads'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}