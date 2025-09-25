import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error categories
export enum ErrorCategory {
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  NETWORK = 'network',
  PERMISSION = 'permission',
  BUSINESS_LOGIC = 'business_logic',
  EXTERNAL_SERVICE = 'external_service',
  UNKNOWN = 'unknown',
}

// Custom error class
export class ApplicationError extends Error {
  public readonly severity: ErrorSeverity
  public readonly category: ErrorCategory
  public readonly context?: Record<string, any>
  public readonly timestamp: Date
  public readonly userId?: string

  constructor(
    message: string,
    options: {
      severity?: ErrorSeverity
      category?: ErrorCategory
      context?: Record<string, any>
      userId?: string
    } = {}
  ) {
    super(message)
    this.name = 'ApplicationError'
    this.severity = options.severity || ErrorSeverity.MEDIUM
    this.category = options.category || ErrorCategory.UNKNOWN
    this.context = options.context
    this.timestamp = new Date()
    this.userId = options.userId

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError)
    }
  }
}

// Error logger
class ErrorLogger {
  private static instance: ErrorLogger
  private queue: ApplicationError[] = []
  private isProcessing = false

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  async log(error: ApplicationError | Error) {
    // Convert regular errors to ApplicationError
    const appError =
      error instanceof ApplicationError
        ? error
        : new ApplicationError(error.message, {
            severity: ErrorSeverity.MEDIUM,
            category: ErrorCategory.UNKNOWN,
          })

    // Add to queue
    this.queue.push(appError)

    // Process queue
    if (!this.isProcessing) {
      await this.processQueue()
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${appError.category.toUpperCase()} ERROR`)
      console.error('Message:', appError.message)
      console.error('Severity:', appError.severity)
      console.error('Context:', appError.context)
      console.error('Stack:', appError.stack)
      console.groupEnd()
    }
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false
      return
    }

    this.isProcessing = true

    try {
      const supabase = createClient()
      const errors = [...this.queue]
      this.queue = []

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Batch insert errors to analytics
      const analyticsEvents = errors.map((error) => ({
        user_id: error.userId || user?.id || null,
        event_name: 'error',
        event_category: error.category,
        event_properties: {
          message: error.message,
          severity: error.severity,
          context: error.context,
          stack: error.stack,
          timestamp: error.timestamp.toISOString(),
        },
        page_path: typeof window !== 'undefined' ? window.location.pathname : null,
        page_title: typeof window !== 'undefined' ? document.title : null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      }))

      await supabase.from('analytics_events').insert(analyticsEvents)
    } catch (logError) {
      // Silently fail logging errors to prevent infinite loops
      console.error('Failed to log error to database:', logError)
    } finally {
      this.isProcessing = false

      // Process remaining items if any
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), 1000)
      }
    }
  }
}

// Error handler with user notification
export function handleError(
  error: Error | ApplicationError | unknown,
  options: {
    showToast?: boolean
    toastMessage?: string
    severity?: ErrorSeverity
    category?: ErrorCategory
    context?: Record<string, any>
  } = {}
): void {
  const {
    showToast = true,
    toastMessage,
    severity = ErrorSeverity.MEDIUM,
    category = ErrorCategory.UNKNOWN,
    context,
  } = options

  // Convert to ApplicationError
  let appError: ApplicationError

  if (error instanceof ApplicationError) {
    appError = error
  } else if (error instanceof Error) {
    appError = new ApplicationError(error.message, {
      severity,
      category,
      context: { ...context, originalError: error.name },
    })
  } else {
    appError = new ApplicationError('An unknown error occurred', {
      severity,
      category,
      context: { ...context, error },
    })
  }

  // Log the error
  ErrorLogger.getInstance().log(appError)

  // Show toast notification if requested
  if (showToast) {
    const message = toastMessage || getUserFriendlyMessage(appError)

    switch (appError.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        toast.error(message)
        break
      case ErrorSeverity.MEDIUM:
        toast.warning(message)
        break
      case ErrorSeverity.LOW:
        toast.info(message)
        break
    }
  }
}

// Get user-friendly error messages
function getUserFriendlyMessage(error: ApplicationError): string {
  const defaultMessages: Record<ErrorCategory, string> = {
    [ErrorCategory.DATABASE]: 'We encountered a problem accessing data. Please try again.',
    [ErrorCategory.AUTHENTICATION]: 'Please sign in to continue.',
    [ErrorCategory.VALIDATION]: 'Please check your input and try again.',
    [ErrorCategory.NETWORK]: 'Connection issue. Please check your internet and try again.',
    [ErrorCategory.PERMISSION]: "You don't have permission to perform this action.",
    [ErrorCategory.BUSINESS_LOGIC]: 'This operation cannot be completed at this time.',
    [ErrorCategory.EXTERNAL_SERVICE]: 'An external service is temporarily unavailable.',
    [ErrorCategory.UNKNOWN]: 'Something went wrong. Please try again.',
  }

  // Check for specific error messages
  if (error.message.includes('duplicate')) {
    return 'This item already exists.'
  }

  if (error.message.includes('not found')) {
    return 'The requested item was not found.'
  }

  if (error.message.includes('expired')) {
    return 'Your session has expired. Please sign in again.'
  }

  if (error.message.includes('rate limit')) {
    return 'Too many requests. Please wait a moment and try again.'
  }

  return defaultMessages[error.category] || defaultMessages[ErrorCategory.UNKNOWN]
}

// Error boundary utilities for React
export function logErrorToService(error: Error, errorInfo: any) {
  handleError(error, {
    showToast: false,
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.UNKNOWN,
    context: {
      errorInfo,
      componentStack: errorInfo.componentStack,
    },
  })
}

// Async error wrapper
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options: Parameters<typeof handleError>[1] = {}
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    handleError(error, options)
    return null
  }
}

// API error handler
export function handleApiError(response: Response): never {
  const category = getErrorCategoryFromStatus(response.status)
  const severity = getSeverityFromStatus(response.status)

  throw new ApplicationError(`API Error: ${response.statusText}`, {
    category,
    severity,
    context: {
      status: response.status,
      url: response.url,
    },
  })
}

function getErrorCategoryFromStatus(status: number): ErrorCategory {
  if (status === 401 || status === 403) return ErrorCategory.AUTHENTICATION
  if (status === 400 || status === 422) return ErrorCategory.VALIDATION
  if (status === 404) return ErrorCategory.BUSINESS_LOGIC
  if (status === 429) return ErrorCategory.NETWORK
  if (status >= 500) return ErrorCategory.DATABASE
  return ErrorCategory.UNKNOWN
}

function getSeverityFromStatus(status: number): ErrorSeverity {
  if (status >= 500) return ErrorSeverity.HIGH
  if (status === 429) return ErrorSeverity.MEDIUM
  if (status === 404) return ErrorSeverity.LOW
  return ErrorSeverity.MEDIUM
}

// Validation error helper
export function createValidationError(
  field: string,
  message: string,
  value?: any
): ApplicationError {
  return new ApplicationError(`Validation failed for ${field}: ${message}`, {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    context: { field, value },
  })
}

// Database error helper
export function createDatabaseError(
  operation: string,
  table: string,
  error: any
): ApplicationError {
  return new ApplicationError(`Database ${operation} failed on ${table}`, {
    category: ErrorCategory.DATABASE,
    severity: ErrorSeverity.HIGH,
    context: { operation, table, originalError: error },
  })
}

// Export singleton logger instance
export const errorLogger = ErrorLogger.getInstance()