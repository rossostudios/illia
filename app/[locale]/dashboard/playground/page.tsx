'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PlaygroundPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new Service Finder page
    router.replace('/dashboard/service-finder')
  }, [router])

  return null
}

/* Old code - commented out as playground redirects to service-finder
import {
  Calendar,
  CheckCircle,
  Copy,
  Download,
  FileText,
  Info,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Star
} from 'lucide-react'

function OldPlaygroundPage() {
  const { user } = useSession()
  const { recentLeads, loading: leadsLoading, refetch: fetchRecentLeads } = useRecentLeads()

  const [inputValue, setInputValue] = useState('plumbers, 29401')
  const [format, setFormat] = useState('preview')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showInfoTooltip, setShowInfoTooltip] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)

  // Parse input to extract niche and ZIP
  const parseInput = (input: string) => {
    const parts = input.split(',').map(p => p.trim())
    if (parts.length >= 2) {
      const zipMatch = parts[parts.length - 1].match(/\d{5}/)
      if (zipMatch) {
        return {
          niche: parts.slice(0, -1).join(', '),
          zipCode: zipMatch[0],
          location: 'Charleston, SC'
        }
      }
    }
    // Default fallback
    return {
      niche: parts[0] || 'plumbers',
      zipCode: '29401',
      location: 'Charleston, SC'
    }
  }

  const handleGenerateLeads = async () => {
    if (!user?.email) {
      setError('Please log in to generate leads')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    const { niche, zipCode, location } = parseInput(inputValue)

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
          radius: 5,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate leads')
      }

      // Format the leads for display
      const formattedLeads = data.leads?.map((lead: any) => ({
        ...lead,
        score: calculateLeadScore({
          name: lead.name,
          niche: lead.niche,
          zipCode: lead.zip_code,
          hasWebsite: true,
          reviewCount: Math.floor(Math.random() * 100) + 10,
          rating: 3.5 + Math.random() * 1.5
        })
      })) || []

      setResult({
        leads: formattedLeads,
        count: formattedLeads.length,
        niche,
        zipCode
      })

      // Refresh recent leads
      fetchRecentLeads()
    } catch (error) {
      setError((error as Error).message || 'Failed to generate leads')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetCode = () => {
    const { niche, zipCode } = parseInput(inputValue)
    const code = `// Using Illia API to generate leads
const response = await fetch('https://api.illia.dev/v1/generate-leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    niche: '${niche}',
    zipCode: '${zipCode}',
    location: 'Charleston, SC',
    radius: 5
  })
})

const leads = await response.json()`

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).catch((err) => {
        console.error('Failed to copy code:', err)
      })
    }
  }

  const handleExport = () => {
    if (!result || !result.leads) return

    if (format === 'csv') {
      const headers = ['Name', 'Score', 'Email', 'Phone', 'ZIP', 'Niche', 'Intent']
      const csvContent = [
        headers.join(','),
        ...result.leads.map((lead: any) => [
          lead.name,
          lead.score?.finalScore || lead.score || 0,
          lead.email || '',
          lead.phone || '',
          lead.zip_code || lead.zipCode || '',
          lead.niche || '',
          lead.score?.intent || 'medium'
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `illia-leads-${result.niche}-${result.zipCode}.csv`
      a.click()
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(result.leads, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `illia-leads-${result.niche}-${result.zipCode}.json`
      a.click()
    }
  }

  const handlePersonaSelect = (personaId: string) => {
    const persona = CHARLESTON_PERSONAS.find(p => p.id === personaId)
    if (persona) {
      setInputValue(`${persona.niche}, ${persona.zipCode}`)
      setSelectedPersona(personaId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-teal-600 mb-2 flex items-center justify-center relative">
          <MapPin className="h-8 w-8 mr-2" />
          Lead Playground
          <button type="button"
            className="ml-2 relative"
            onMouseEnter={() = > setShowInfoTooltip(true)}
            onMouseLeave={() => setShowInfoTooltip(false)}
          >
            <Info className="h-5 w-5 text-gray-700 hover:text-gray-600" />
            {showInfoTooltip && (
              <div className="absolute z-10 left-1/2 -translate-x-1/2 top-8 w-80 bg-gray-900 text-white text-sm rounded-lg p-4 shadow-xl">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-gray-900"></div>
                <h4 className="font-semibold mb-2">🎯 What is Lead Playground?</h4>
                <p className="mb-3 text-gray-200">
                  A testing environment to experiment with lead generation before running full campaigns.
                </p>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Test different niches and ZIP codes instantly</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Preview lead quality with AI scoring</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Export results in CSV or JSON format</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>No credits used for playground testing</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-700">
                    💡 Tip: Try "plumbers, 29401" or select a Charleston persona below
                  </p>
                </div>
              </div>
            )}
          </button>
        </h1>
        <p className="text-gray-700">Test & Generate Leads in One Place</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Start with Charleston Personas:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CHARLESTON_PERSONAS.slice(0, 8).map((persona) => (
              <button type="button"
                key={persona.id}
                onClick={() => handlePersonaSelect(persona.id)}
                className={`p-2 rounded-lg border text-xs transition-all ${
                  selectedPersona === persona.id
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{persona.icon}</span>
                  <span className="font-medium truncate">{persona.niche}</span>
                  <span className="text-gray-500">{persona.zipCode}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-1 flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-teal-600" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 text-gray-900 bg-gray-100 px-3 py-2 rounded-md outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
                placeholder="plumbers, 29401"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Format:</span>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="text-sm font-medium text-gray-900 bg-transparent border rounded px-2 py-1 outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="preview">Preview</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button type="button"
                onClick={handleGetCode}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" 
              >
                <Copy className="h-4 w-4" />
                <span className="text-sm font-medium">Get Code</span>
              </button>
              {result && (
                <button type="button"
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors" 
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm font-medium">Export</span>
                </button>
              )}
              <button type="button"
                onClick={handleGenerateLeads}
                disabled={isLoading || !user}
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

      {result && result.leads && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Generated {result.count} Leads - {result.niche} in {result.zipCode}
                </h3>
                <div className="flex items-center gap-2">
                  {result.leads[0]?.score?.eventContext && (
                    <div className="flex items-center gap-1 text-sm text-teal-600">
                      <Calendar className="h-4 w-4" />
                      <span>{result.leads[0].score.eventContext}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {format === 'preview' ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {result.leads.slice(0, 6).map((lead: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                          <p className="text-sm text-gray-500">{lead.niche}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            lead.score?.finalScore >= 85 || lead.score >= 85 ? 'bg-green-100 text-green-800' :
                            lead.score?.finalScore >= 60 || lead.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            Score: {lead.score?.finalScore || lead.score || 0}
                          </span>
                          {lead.score?.intent && (
                            <span className={`text-xs font-medium ${
                              lead.score.intent === 'high' ? 'text-green-600' :
                              lead.score.intent === 'medium' ? 'text-yellow-600' :
                              'text-gray-600'
                            }`}>
                              {lead.score.intent} intent
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {lead.email && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{lead.zip_code || lead.zipCode}</span>
                        </div>
                        {lead.rating && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Star className="h-3.5 w-3.5" />
                            <span>{lead.rating}★</span>
                          </div>
                        )}
                      </div>

                      {lead.score?.scoringFactors && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-gray-500">
                            {lead.score.scoringFactors.slice(0, 2).join(' • ')}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
                  {format === 'json'
                    ? JSON.stringify(result.leads, null, 2)
                    : `Name,Score,Email,Phone,ZIP,Niche\n${result.leads.map((l: any) =>
                        `${l.name},${l.score?.finalScore || l.score || 0},${l.email || ''},${l.phone || ''},${l.zip_code || l.zipCode},${l.niche}`
                      ).join('\n')}`
                  }
                </pre>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <LocalSEOWidget
              niche={result.niche}
              zipCode={result.zipCode}
              leadCount={result.count}
            />
            <LowcountryROICalculator
              leadCount={result.count}
              niche={result.niche}
              zipCode={result.zipCode}
            />
          </div>
        </div>
      )}

      {!result && !isLoading && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Generations</h2>
          <div className="bg-white rounded-xl border">
            {leadsLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading recent generations...</p>
              </div>
            ) : recentLeads.length > 0 ? (
              <div className="divide-y">
                {recentLeads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-gray-900 font-medium">
                            {lead.niche}, {lead.zip_code}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">Score</span>
                            <span className="font-medium text-teal-600">
                              {lead.score}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">Status</span>
                            <span className="flex items-center">
                              <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5" />
                              <span className="font-medium text-green-600">Success</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">Generated</span>
                            <span className="font-medium">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-gray-700">
                              {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">No recent generations yet</p>
                <p className="text-sm text-gray-700">Generate your first leads to see them here</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
*/
