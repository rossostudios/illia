'use client'

type BookingStatsProps = {
  stats: {
    total: number
    upcoming: number
    pending: number
    completed: number
  }
}

export function BookingStats({ stats }: BookingStatsProps) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 text-sm dark:text-gray-400">Total Bookings</p>
        <p className="mt-1 font-bold text-2xl text-gray-900 dark:text-white">{stats.total}</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 text-sm dark:text-gray-400">Upcoming</p>
        <p className="mt-1 font-bold text-2xl text-teal-600 dark:text-teal-400">{stats.upcoming}</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 text-sm dark:text-gray-400">Pending</p>
        <p className="mt-1 font-bold text-2xl text-yellow-600 dark:text-yellow-400">
          {stats.pending}
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 text-sm dark:text-gray-400">Completed</p>
        <p className="mt-1 font-bold text-2xl text-blue-600 dark:text-blue-400">
          {stats.completed}
        </p>
      </div>
    </div>
  )
}
