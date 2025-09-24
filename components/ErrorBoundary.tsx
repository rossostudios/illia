'use client'

import React, { type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

type State = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // You can also log to an error reporting service here
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     contexts: { react: { componentStack: errorInfo.componentStack } }
    //   })
    // }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }

      return (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">
          <div className="text-center">
            <svg
              aria-hidden="true"
              className="mx-auto mb-4 h-10 w-10 text-red-500 dark:text-red-400"
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
            <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-gray-100">
              Component Error
            </h3>
            <p className="mb-4 text-gray-600 text-sm dark:text-gray-400">
              {this.state.error?.message || 'Something went wrong in this section'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-500 dark:focus:ring-red-400 dark:focus:ring-offset-gray-900 dark:hover:bg-red-600"
                onClick={this.resetError}
                type="button"
              >
                Try Again
              </button>
              <button
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900 dark:hover:bg-gray-700"
                onClick={() => window.location.reload()}
                type="button"
              >
                Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-gray-500 text-sm hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-gray-900 text-xs dark:bg-gray-800 dark:text-gray-100">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
