export const ERROR_MESSAGES = {
  // Authentication errors
  'Invalid login credentials': {
    title: 'Invalid credentials',
    message: 'The email or password you entered is incorrect.',
    suggestion: 'Please check your credentials and try again. Forgot your password?',
  },
  'User not found': {
    title: 'Account not found',
    message: 'No account exists with this email address.',
    suggestion: 'Did you mean to sign up instead?',
  },
  'Email not confirmed': {
    title: 'Email not verified',
    message: 'Please verify your email address before logging in.',
    suggestion: 'Check your inbox for the verification link or request a new one.',
  },
  'Password is too weak': {
    title: 'Password too weak',
    message: 'Your password must be at least 8 characters long.',
    suggestion:
      'Include uppercase, lowercase, numbers, and special characters for better security.',
  },

  // Network errors
  NetworkError: {
    title: 'Connection failed',
    message: 'Unable to connect to the server.',
    suggestion: 'Please check your internet connection and try again.',
  },
  'Request timeout': {
    title: 'Request timed out',
    message: 'The server took too long to respond.',
    suggestion: 'This might be a temporary issue. Please try again in a moment.',
  },

  // Form validation errors
  required: {
    title: 'Required field',
    message: 'This field is required.',
    suggestion: 'Please fill in all required fields.',
  },
  email: {
    title: 'Invalid email',
    message: 'Please enter a valid email address.',
    suggestion: 'Example: name@example.com',
  },
  minLength: {
    title: 'Too short',
    message: 'This field must be at least {min} characters.',
    suggestion: 'Please enter at least {min} characters.',
  },
  maxLength: {
    title: 'Too long',
    message: 'This field must be no more than {max} characters.',
    suggestion: 'Please shorten your input to {max} characters or less.',
  },
  pattern: {
    title: 'Invalid format',
    message: 'Please enter a valid format.',
    suggestion: 'Check the field requirements and try again.',
  },

  // Permission errors
  Unauthorized: {
    title: 'Access denied',
    message: "You don't have permission to access this resource.",
    suggestion: 'Please log in or contact support if you believe this is an error.',
  },
  'Subscription required': {
    title: 'Premium feature',
    message: 'This feature requires a premium subscription.',
    suggestion: 'Upgrade to premium to unlock all features.',
  },

  // Generic errors
  'Unknown error': {
    title: 'Something went wrong',
    message: 'An unexpected error occurred.',
    suggestion: 'Please try again or contact support if the problem persists.',
  },
} as const

export type ErrorCode = keyof typeof ERROR_MESSAGES

export function getErrorMessage(error: string | Error | unknown): {
  title: string
  message: string
  suggestion?: string
} {
  let errorString = ''

  if (error instanceof Error) {
    errorString = error.message
  } else if (typeof error === 'string') {
    errorString = error
  } else {
    errorString = 'Unknown error'
  }

  // Try to find a matching error message
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (errorString.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }

  // Return generic error if no match found
  return ERROR_MESSAGES['Unknown error']
}

// Field-level validation messages
export const FIELD_VALIDATION = {
  email: {
    required: 'Email address is required',
    invalid: 'Please enter a valid email address',
    taken: 'This email is already registered',
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 8 characters',
    weak: 'Password is too weak. Include uppercase, lowercase, numbers, and symbols',
    mismatch: 'Passwords do not match',
  },
  name: {
    required: 'Name is required',
    minLength: 'Name must be at least 2 characters',
    maxLength: 'Name must be less than 50 characters',
  },
  phone: {
    required: 'Phone number is required',
    invalid: 'Please enter a valid phone number',
  },
  message: {
    required: 'Message is required',
    minLength: 'Message must be at least 10 characters',
    maxLength: 'Message must be less than 500 characters',
  },
}
