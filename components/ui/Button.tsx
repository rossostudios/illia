import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  type?: 'button' | 'submit' | 'reset'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      type = 'button',
      disabled,
      ...props
    },
    ref
  ) => {
    // Variant styles with dark mode support
    const variantStyles = {
      primary:
        'bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-700 focus:bg-teal-700 dark:focus:bg-teal-700 active:bg-teal-800 dark:active:bg-teal-800 shadow-sm',
      secondary:
        'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 focus:bg-gray-200 dark:focus:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600',
      outline:
        'border-2 border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 focus:bg-teal-50 dark:focus:bg-teal-900/20 active:bg-teal-100 dark:active:bg-teal-900/30',
      ghost:
        'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700',
      danger:
        'bg-red-600 dark:bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700 focus:bg-red-700 dark:focus:bg-red-700 active:bg-red-800 dark:active:bg-red-800 shadow-sm',
    }

    // Size styles
    const sizeStyles = {
      xs: 'px-2.5 py-1.5 text-xs min-h-[32px]',
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-2.5 text-sm min-h-[40px]',
      lg: 'px-5 py-3 text-base min-h-[44px]',
      xl: 'px-6 py-3.5 text-base min-h-[52px]',
    }

    // Icon size based on button size
    const iconSizes = {
      xs: 'xs',
      sm: 'sm',
      md: 'sm',
      lg: 'md',
      xl: 'md',
    } as const

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center gap-2
          font-medium rounded-lg
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner
              size={iconSizes[size]}
              color={variant === 'primary' || variant === 'danger' ? 'white' : 'gray'}
            />
            <span>{children}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
