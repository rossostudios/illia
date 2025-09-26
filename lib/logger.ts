import { createClient } from '@/lib/supabase/client'

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

// Log categories for better organization
export enum LogCategory {
  AUTHENTICATION = 'auth',
  DATABASE = 'database',
  API = 'api',
  REALTIME = 'realtime',
  PAYMENT = 'payment',
  USER_ACTION = 'user_action',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  SYSTEM = 'system',
}

type LogEntry = {
  level: LogLevel
  category: LogCategory
  message: string
  data?: any
  timestamp: Date
  userId?: string
  sessionId?: string
  requestId?: string
  environment?: string
  userAgent?: string
  url?: string
}

class Logger {
  private static instance: Logger
  private buffer: LogEntry[] = []
  private flushInterval: NodeJS.Timeout | null = null
  private readonly maxBufferSize = 50
  private readonly flushIntervalMs = 5000
  private readonly sessionId: string
  private readonly isEnabled: boolean

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.isEnabled =
      process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true'

    if (this.isEnabled) {
      this.startFlushInterval()

      // Flush logs on page unload
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => this.flush())
      }
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  }

  private getEnvironmentInfo() {
    if (typeof window === 'undefined') {
      return {
        environment: 'server',
        userAgent: null,
        url: null,
      }
    }

    return {
      environment: 'client',
      userAgent: navigator.userAgent,
      url: window.location.href,
    }
  }

  private async getUserId(): Promise<string | null> {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      return user?.id || null
    } catch {
      return null
    }
  }

  private createLogEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: any
  ): LogEntry {
    const envInfo = this.getEnvironmentInfo()

    return {
      level,
      category,
      message,
      data,
      timestamp: new Date(),
      sessionId: this.sessionId,
      ...envInfo,
    }
  }

  private formatConsoleMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString()
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.category}]`
    return `${prefix} ${entry.message}`
  }

  private consoleLog(entry: LogEntry) {
    if (process.env.NODE_ENV === 'development') {
      const _formattedMessage = this.formatConsoleMessage(entry)

      switch (entry.level) {
        case LogLevel.DEBUG:
          break
        case LogLevel.INFO:
          break
        case LogLevel.WARN:
          break
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          break
      }
    }
  }

  private addToBuffer(entry: LogEntry) {
    this.buffer.push(entry)

    // Auto-flush if buffer is full
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush()
    }
  }

  private startFlushInterval() {
    this.flushInterval = setInterval(() => {
      this.flush()
    }, this.flushIntervalMs)
  }

  async flush() {
    if (!this.isEnabled || this.buffer.length === 0) {
      return
    }

    const logsToFlush = [...this.buffer]
    this.buffer = []

    try {
      const supabase = createClient()
      const userId = await this.getUserId()

      // Convert logs to analytics events
      const events = logsToFlush.map((log) => ({
        user_id: userId,
        event_name: `log_${log.level}`,
        event_category: log.category,
        event_properties: {
          message: log.message,
          data: log.data,
          level: log.level,
          session_id: log.sessionId,
          request_id: log.requestId,
          environment: log.environment,
        },
        page_path: log.url ? new URL(log.url).pathname : null,
        user_agent: log.userAgent,
        created_at: log.timestamp.toISOString(),
      }))

      // Batch insert logs
      await supabase.from('analytics_events').insert(events)
    } catch (_error) {
      // Restore logs to buffer if flush failed
      this.buffer = [...logsToFlush, ...this.buffer].slice(-this.maxBufferSize)
    }
  }

  // Public logging methods
  debug(category: LogCategory, message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.DEBUG, category, message, data)
    this.consoleLog(entry)
    if (this.isEnabled) {
      this.addToBuffer(entry)
    }
  }

  info(category: LogCategory, message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.INFO, category, message, data)
    this.consoleLog(entry)
    if (this.isEnabled) {
      this.addToBuffer(entry)
    }
  }

  warn(category: LogCategory, message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.WARN, category, message, data)
    this.consoleLog(entry)
    if (this.isEnabled) {
      this.addToBuffer(entry)
    }
  }

  error(category: LogCategory, message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.ERROR, category, message, data)
    this.consoleLog(entry)
    if (this.isEnabled) {
      this.addToBuffer(entry)
    }
  }

  fatal(category: LogCategory, message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.FATAL, category, message, data)
    this.consoleLog(entry)
    if (this.isEnabled) {
      this.addToBuffer(entry)
      // Immediately flush fatal errors
      this.flush()
    }
  }

  // Performance logging
  startTimer(label: string): () => void {
    const startTime = performance.now()

    return () => {
      const duration = performance.now() - startTime
      this.info(LogCategory.PERFORMANCE, `${label} completed`, {
        duration_ms: duration.toFixed(2),
        label,
      })
    }
  }

  // API request logging
  logApiRequest(
    method: string,
    url: string,
    requestData?: any,
    requestId?: string
  ): { requestId: string; logResponse: (status: number, responseData?: any) => void } {
    const id = requestId || this.generateSessionId()

    this.info(LogCategory.API, `${method} ${url}`, {
      request_id: id,
      method,
      url,
      request_data: requestData,
    })

    return {
      requestId: id,
      logResponse: (status: number, responseData?: any) => {
        const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO
        const entry = this.createLogEntry(level, LogCategory.API, `${method} ${url} - ${status}`, {
          request_id: id,
          method,
          url,
          status,
          response_data: responseData,
        })
        entry.requestId = id
        this.consoleLog(entry)
        if (this.isEnabled) {
          this.addToBuffer(entry)
        }
      },
    }
  }

  // User action logging
  logUserAction(action: string, details?: any) {
    this.info(LogCategory.USER_ACTION, action, details)
  }

  // Security event logging
  logSecurityEvent(event: string, details?: any) {
    this.warn(LogCategory.SECURITY, event, details)
  }

  // Cleanup
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
    this.flush()
  }
}

// Export singleton instance
export const logger = Logger.getInstance()

// React hook for logging component lifecycle
export function useComponentLogger(componentName: string) {
  const logTimer = logger.startTimer(`${componentName} render`)

  // Log mount
  logger.debug(LogCategory.SYSTEM, `${componentName} mounted`)

  // Return cleanup function
  return () => {
    logTimer()
    logger.debug(LogCategory.SYSTEM, `${componentName} unmounted`)
  }
}

// Middleware for API routes
export function withLogging(handler: Function) {
  return async (req: any, res: any) => {
    const { requestId, logResponse } = logger.logApiRequest(req.method, req.url, req.body)

    try {
      // Add request ID to response headers
      res.setHeader('X-Request-Id', requestId)

      // Call the original handler
      const result = await handler(req, res)

      // Log successful response
      logResponse(res.statusCode)

      return result
    } catch (error: any) {
      // Log error
      logger.error(LogCategory.API, `API Error: ${error.message}`, {
        request_id: requestId,
        error: error.stack,
      })

      // Log error response
      logResponse(res.statusCode || 500, { error: error.message })

      throw error
    }
  }
}
