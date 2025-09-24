type LoadingSpinnerProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray'
  className?: string
}

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  const colorClasses = {
    primary: 'text-teal-600',
    white: 'text-white',
    gray: 'text-gray-600',
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`} role="status">
      <svg
        aria-hidden="true"
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          fill="currentColor"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

type LoadingOverlayProps = {
  message?: string
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-3 rounded-lg bg-white p-6 shadow-xl">
        <LoadingSpinner size="lg" />
        <p className="font-medium text-gray-700 text-sm">{message}</p>
      </div>
    </div>
  )
}

type InlineLoadingProps = {
  text?: string
}

export function InlineLoading({ text = 'Loading' }: InlineLoadingProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <LoadingSpinner size="sm" />
      <span className="text-gray-600 text-sm">{text}</span>
    </div>
  )
}
