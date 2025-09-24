import { AlertCircle, XCircle } from 'lucide-react'
import { getErrorMessage } from '@/lib/constants/errors'

type ErrorMessageProps = {
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
      <div className={`mt-1 text-red-600 text-sm ${className}`} role="alert">
        <span>{message}</span>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div
        aria-live="polite"
        className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}
        role="alert"
      >
        <div className="flex">
          <XCircle aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-red-400" />
          <div className="ml-3 flex-1">
            <h3 className="font-medium text-red-800 text-sm">{title}</h3>
            <p className="mt-1 text-red-700 text-sm">{message}</p>
            {showSuggestion && suggestion && (
              <p className="mt-2 text-red-600 text-sm">{suggestion}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Default inline variant
  return (
    <div
      aria-live="polite"
      className={`flex items-start gap-2 text-red-600 text-sm ${className}`}
      role="alert"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <div>
        <span className="font-medium">{title}:</span> {message}
        {showSuggestion && suggestion && (
          <span className="mt-1 block text-red-500">{suggestion}</span>
        )}
      </div>
    </div>
  )
}

type FieldErrorProps = {
  error?: string
  touched?: boolean
}

export function FieldError({ error, touched }: FieldErrorProps) {
  if (!(error && touched)) {
    return null
  }

  return (
    <div className="mt-1 flex items-center gap-1 text-red-600 text-sm" role="alert">
      <AlertCircle aria-hidden="true" className="h-3 w-3" />
      <span>{error}</span>
    </div>
  )
}
