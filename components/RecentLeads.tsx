'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSession } from '@/hooks/useSession'
import type { Database } from '@/types/database'
import { calculateLeadScore } from '@/utils/lead-scoring'
import {
  Phone,
  MapPin,
  Download,
  ArrowUpDown,
  Filter,
  MoreVertical,
  Mail,
  ChevronUp,
  ChevronDown,
  Calendar
} from 'lucide-react'

type Lead = Database['public']['Tables']['illia_leads']['Row']

// Sample data for empty state
const SAMPLE_LEAD = {
  id: 'sample-1',
  name: "Bob's Emergency Plumbing",
  niche: 'plumbers',
  score: 92,
  email: 'contact@bobsplumbing.com',
  phone: '(843) 555-0123',
  zip_code: '29401',
  status: 'new',
  notes: 'High-intent: "24/7 emergency service" mentioned 5x in reviews',
  created_at: new Date().toISOString(),
  hasWebsite: true,
  reviewCount: 75,
  rating: 4.7
}

type SortField = 'name' | 'score' | 'created_at' | 'zip_code'
type SortOrder = 'asc' | 'desc'

export default function RecentLeads() {
  const { user } = useSession()
  const supabase = createClient()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filterNiche] = useState<string>('')
  const [showActions, setShowActions] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    if (!user?.email) return

    try {
      const { data, error } = await supabase
        .from('illia_leads')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.email, supabase])

  useEffect(() => {
    if (user?.email) {
      fetchLeads()
    } else {
      setLoading(false)
    }
  }, [user, fetchLeads])

  const exportToCSV = () => {
    const headers = ['Name', 'Score', 'Email', 'Phone', 'ZIP', 'Niche', 'Status', 'Notes']
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        lead.name,
        lead.score,
        lead.email || '',
        lead.phone || '',
        lead.zip_code,
        lead.niche,
        lead.status || 'new',
        `"${lead.notes || ''}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `illia-leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const sortedLeads = [...leads].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  const filteredLeads = filterNiche
    ? sortedLeads.filter(lead => lead.niche === filterNiche)
    : sortedLeads

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-gray-400" />
    return sortOrder === 'asc'
      ? <ChevronUp className="h-3 w-3 text-teal-600" />
      : <ChevronDown className="h-3 w-3 text-teal-600" />
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Leads</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Recent Leads</h3>
          <button
            onClick={exportToCSV}
            disabled
            className="flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export CSV
          </button>
        </div>

        {/* Sample Lead Preview */}
        <div className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Sample Lead Preview:</p>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{SAMPLE_LEAD.name}</h4>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="flex items-center text-gray-600">
                    <Mail className="h-3 w-3 mr-1" />
                    {SAMPLE_LEAD.email}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Phone className="h-3 w-3 mr-1" />
                    {SAMPLE_LEAD.phone}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {SAMPLE_LEAD.zip_code}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                Score: {SAMPLE_LEAD.score}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">{SAMPLE_LEAD.notes}</p>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-gray-500 mb-4">Start generating leads to see them here</p>
          <button className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            Generate Your First Leads
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Recent Leads</h3>
            <p className="text-sm text-gray-600 mt-0.5">{leads.length} leads from last generation</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <div className="relative">
              <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-1.5" />
                Filter
              </button>
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="flex items-center px-3 py-1.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  <span>Name</span>
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('score')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  <span>Score</span>
                  <SortIcon field="score" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('zip_code')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  <span>Location</span>
                  <SortIcon field="zip_code" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.niche}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      lead.score >= 85 ? 'bg-green-100 text-green-800' :
                      lead.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.score}
                      {lead.score >= 85 && ' 🔥'}
                    </span>
                    {(() => {
                      const leadScore = calculateLeadScore({
                        name: lead.name,
                        niche: lead.niche,
                        zipCode: lead.zip_code,
                        hasWebsite: true,
                        reviewCount: 50,
                        rating: 4.5
                      });
                      return leadScore.eventContext ? (
                        <div className="flex items-center gap-1 text-xs text-teal-600">
                          <Calendar className="h-3 w-3" />
                          <span className="truncate max-w-[120px]" title={leadScore.eventContext}>
                            {leadScore.eventContext}
                          </span>
                          {leadScore.eventBoost > 0 && (
                            <span className="text-teal-700 font-medium">+{leadScore.eventBoost}</span>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col space-y-1">
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center text-teal-600 hover:text-teal-700 group"
                      >
                        <Mail className="h-3 w-3 mr-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs truncate max-w-[150px]">{lead.email}</span>
                      </a>
                    )}
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center text-teal-600 hover:text-teal-700 group"
                      >
                        <Phone className="h-3 w-3 mr-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs">{lead.phone}</span>
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1.5 text-gray-400" />
                    <span className="text-sm text-gray-600">{lead.zip_code}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                    lead.status === 'contacted' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    lead.status === 'converted' ? 'bg-green-50 text-green-700 border border-green-200' :
                    'bg-gray-50 text-gray-700 border border-gray-200'
                  }`}>
                    {lead.status || 'new'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="relative">
                    <button
                      onClick={() => setShowActions(showActions === lead.id ? null : lead.id)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </button>
                    {showActions === lead.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-10">
                        <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50">
                          Mark as Contacted
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50">
                          Add Note
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 text-red-600">
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing {Math.min(10, leads.length)} of {leads.length} leads
          </span>
          <a
            href="/dashboard/leads"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            View All Leads →
          </a>
        </div>
      </div>
    </div>
  )
}