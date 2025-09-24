'use client'

import React, { type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback?: ReactNode
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

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {}

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-4 font-semibold text-2xl text-gray-900 dark:text-white">
              Oops! Something went wrong
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              We're sorry for the inconvenience. Please try refreshing the page or contact support
              if the problem persists.
            </p>
            <button
              className="rounded-lg bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-gray-500 text-sm hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-gray-900 text-xs dark:bg-gray-900 dark:text-gray-100">
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
