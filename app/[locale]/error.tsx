'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // You can also send this to an error tracking service like Sentry
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error)
    // }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg
            aria-hidden="true"
            className="h-10 w-10 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>

        <h1 className="mb-2 font-bold text-2xl text-gray-900 dark:text-gray-100">
          Something went wrong!
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>

        {error.digest && (
          <p className="mb-6 font-mono text-gray-500 text-xs dark:text-gray-500">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            className="rounded-lg bg-teal-600 px-6 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-teal-500 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-900 dark:hover:bg-teal-600"
            onClick={() => reset()}
            type="button"
          >
            Try again
          </button>

          <button
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:ring-teal-400 dark:focus:ring-offset-gray-900 dark:hover:bg-gray-700"
            onClick={() => router.push('/')}
            type="button"
          >
            Go to homepage
          </button>
        </div>
      </div>
    </div>
  )
}
