import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ProviderApprovalTabs from '@/components/admin/providers/ProviderApprovalTabs'
import type { Database } from '@/lib/database.types'

export default async function ProvidersPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  // Get all providers with different statuses
  const { data: pendingProviders } = await supabase
    .from('users')
    .select(`
      *,
      booking_reviews (rating)
    `)
    .eq('is_provider', true)
    .eq('approval_status', 'pending')
    .order('created_at', { ascending: false })

  const { data: approvedProviders } = await supabase
    .from('users')
    .select(`
      *,
      booking_reviews (rating)
    `)
    .eq('is_provider', true)
    .eq('approval_status', 'approved')
    .order('created_at', { ascending: false })

  const { data: rejectedProviders } = await supabase
    .from('users')
    .select(`
      *,
      booking_reviews (rating)
    `)
    .eq('is_provider', true)
    .eq('approval_status', 'rejected')
    .order('created_at', { ascending: false })

  const { data: suspendedProviders } = await supabase
    .from('users')
    .select(`
      *,
      booking_reviews (rating)
    `)
    .eq('is_provider', true)
    .eq('approval_status', 'suspended')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Provider Management</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Review and manage provider applications
        </p>
      </div>

      <ProviderApprovalTabs
        approvedProviders={approvedProviders || []}
        pendingProviders={pendingProviders || []}
        rejectedProviders={rejectedProviders || []}
        suspendedProviders={suspendedProviders || []}
      />
    </div>
  )
}
