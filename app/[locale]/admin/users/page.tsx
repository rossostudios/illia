import UserFilters from '@/components/admin/users/UserFilters'
import UserManagementTable from '@/components/admin/users/UserManagementTable'
import { createClient } from '@/lib/supabase/server'

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; tier?: string; status?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query with filters
  let query = supabase.from('users').select(`
    *,
    booking_reviews!provider_id (rating),
    bookings!user_id (id)
  `)

  // Apply filters
  if (params.search) {
    query = query.or(
      `username.ilike.%${params.search}%,display_name.ilike.%${params.search}%,email.ilike.%${params.search}%`
    )
  }

  if (params.type === 'providers') {
    query = query.eq('is_provider', true)
  } else if (params.type === 'users') {
    query = query.eq('is_provider', false)
  }

  if (params.tier) {
    query = query.eq('tier', params.tier)
  }

  if (params.status === 'active') {
    query = query.eq('is_deleted', false)
  } else if (params.status === 'deleted') {
    query = query.eq('is_deleted', true)
  }

  const { data: users } = await query.order('created_at', { ascending: false })

  // Get statistics
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: totalProviders } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('is_provider', true)

  const { count: deletedUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('is_deleted', true)

  const stats = {
    total: totalUsers || 0,
    providers: totalProviders || 0,
    users: (totalUsers || 0) - (totalProviders || 0),
    deleted: deletedUsers || 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white">User Management</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage all platform users and providers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-gray-600 text-sm dark:text-gray-400">Total Users</p>
          <p className="mt-1 font-bold text-2xl text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-gray-600 text-sm dark:text-gray-400">Providers</p>
          <p className="mt-1 font-bold text-2xl text-gray-900 dark:text-white">{stats.providers}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-gray-600 text-sm dark:text-gray-400">Regular Users</p>
          <p className="mt-1 font-bold text-2xl text-gray-900 dark:text-white">{stats.users}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-gray-600 text-sm dark:text-gray-400">Deleted</p>
          <p className="mt-1 font-bold text-2xl text-gray-900 dark:text-white">{stats.deleted}</p>
        </div>
      </div>

      <UserFilters currentFilters={params} />

      <UserManagementTable users={users || []} />
    </div>
  )
}
