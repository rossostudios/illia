import { AlertCircle, XCircle } from 'lucide-react'
import { getErrorMessage } from '@/lib/constants/errors'

interface ErrorMessageProps {
  error: string | Error | unknown
  variant?: 'inline' | 'banner' | 'field'
  className?: string
  showSuggestion?: boolean
}

export function ErrorMessage({
  error,
  variant = 'inline',
  className = '',
  showSuggestion = true,
}: ErrorMessageProps) {
  const { title, message, suggestion } = getErrorMessage(error)

  if (variant === 'field') {
    return (
      <div className={`mt-1 text-sm text-red-600 ${className}`} role="alert">
        <span>{message}</span>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
        role="alert"
        aria-live="polite"
      >
        <div className="flex">
          <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" aria-hidden="true" />
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">{title}</h3>
            <p className="mt-1 text-sm text-red-700">{message}</p>
            {showSuggestion && suggestion && (
              <p className="mt-2 text-sm text-red-600">{suggestion}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Default inline variant
  return (
    <div
      className={`flex items-start gap-2 text-sm text-red-600 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <span className="font-medium">{title}:</span> {message}
        {showSuggestion && suggestion && (
          <span className="block mt-1 text-red-500">{suggestion}</span>
        )}
      </div>
    </div>
  )
}

interface FieldErrorProps {
  error?: string
  touched?: boolean
}

export function FieldError({ error, touched }: FieldErrorProps) {
  if (!error || !touched) return null

  return (
    <div className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
      <AlertCircle className="h-3 w-3" aria-hidden="true" />
      <span>{error}</span>
    </div>
  )
}
