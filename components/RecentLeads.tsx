'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSession } from '@/hooks/useSession'
import type { Database } from '@/types/database'
import { Phone, Globe, MapPin } from 'lucide-react'

type Lead = Database['public']['Tables']['illia_leads']['Row']

export default function RecentLeads() {
  const { user } = useSession()
  const supabase = createClient()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      fetchLeads()
    }
  }, [user])

  const fetchLeads = async () => {
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
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Leads</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Leads</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No leads generated yet</p>
          <a
            href="/dashboard/generate"
            className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Generate Your First Leads
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Recent Leads</h3>
        <span className="text-sm text-gray-500">{leads.length} leads</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niche
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-3 py-3 text-sm">
                  <div className="font-medium text-gray-900">{lead.name}</div>
                </td>
                <td className="px-3 py-3 text-sm text-gray-600">
                  {lead.niche}
                </td>
                <td className="px-3 py-3 text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    lead.score >= 85 ? 'bg-green-100 text-green-800' :
                    lead.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.score}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm">
                  <div className="flex flex-col space-y-1">
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center text-teal-600 hover:text-teal-700"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        <span className="text-xs">{lead.phone}</span>
                      </a>
                    )}
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center text-teal-600 hover:text-teal-700"
                      >
                        <Globe className="h-3 w-3 mr-1" />
                        <span className="text-xs">{lead.email}</span>
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <div className="text-xs">{lead.zip_code}</div>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.status || 'new'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center">
        <a
          href="/dashboard/leads"
          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          View All Leads →
        </a>
      </div>
    </div>
  )
}