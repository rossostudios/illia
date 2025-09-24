'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg
                aria-hidden="true"
                className="h-10 w-10 text-red-600"
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

            <h2 className="mb-2 font-bold text-2xl text-gray-900">Critical Application Error</h2>

            <p className="mb-6 text-gray-600">
              The application encountered a critical error and cannot continue.
            </p>

            {error.digest && (
              <p className="mb-6 font-mono text-gray-500 text-xs">Error ID: {error.digest}</p>
            )}

            <button
              className="rounded-lg bg-teal-600 px-6 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-teal-700"
              onClick={() => reset()}
              type="button"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
