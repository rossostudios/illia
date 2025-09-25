import BookingManagementTable from '@/components/admin/bookings/BookingManagementTable'
import BookingStats from '@/components/admin/bookings/BookingStats'
// import { createClient } from '@/lib/supabase/server'

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; provider?: string; user?: string }>
}) {
  const params = await searchParams
  // const supabase = await createClient()

  // TODO: Create bookings table in database before enabling this functionality
  // The bookings table doesn't exist yet
  const bookings: any[] = []

  // Mock statistics for now
  const statsData: any[] = []

  const stats = {
    total: statsData?.length || 0,
    pending: statsData?.filter((b) => b.status === 'pending').length || 0,
    confirmed: statsData?.filter((b) => b.status === 'confirmed').length || 0,
    completed: statsData?.filter((b) => b.status === 'completed').length || 0,
    cancelled: statsData?.filter((b) => b.status === 'cancelled').length || 0,
    totalRevenue: statsData?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Booking Administration</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage all platform bookings and transactions
        </p>
      </div>

      <BookingStats stats={stats} />

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            defaultValue={params.status || 'all'}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search)
              if (e.target.value === 'all') {
                params.delete('status')
              } else {
                params.set('status', e.target.value)
              }
              window.location.href = `/admin/bookings?${params.toString()}`
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <BookingManagementTable bookings={bookings || []} />
    </div>
  )
}
