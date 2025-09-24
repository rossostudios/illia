'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTheme } from '@/hooks/use-theme'

type ThemeToggleProps = {
  showLabel?: boolean
  className?: string
}

export function ThemeToggle({ showLabel = false, className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Prevent hydration mismatch
    return (
      <button
        aria-label="Toggle theme"
        className={`rounded-lg bg-gray-100 p-2 dark:bg-gray-900 ${className}`}
      >
        <div className="h-5 w-5" />
      </button>
    )
  }

  const icons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  }

  const Icon = icons[theme]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="font-medium text-gray-700 text-sm dark:text-gray-300">Theme</span>
      )}
      <button
        aria-label={`Current theme: ${theme}. Click to toggle theme`}
        className="relative rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-gray-900 dark:focus:ring-offset-gray-900 dark:hover:bg-gray-800"
        onClick={toggleTheme}
      >
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            initial={{ scale: 0, rotate: -180 }}
            key={theme}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </motion.div>
        </AnimatePresence>
      </button>
    </div>
  )
}

export function ThemeMenu() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const options = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ]

  return (
    <div className="relative">
      <button
        aria-expanded={isOpen}
        aria-label="Theme menu"
        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-900 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find((opt) => opt.value === theme)?.icon && (
          <div className="h-4 w-4 text-gray-600 dark:text-gray-400">
            {options.find((opt) => opt.value === theme)?.icon &&
              (() => {
                const Icon = options.find((opt) => opt.value === theme)?.icon
                return <Icon className="h-4 w-4" />
              })()}
          </div>
        )}
        <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
          {options.find((opt) => opt.value === theme)?.label}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-40"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: -10 }}
            >
              {options.map((option) => (
                <button
                  className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    theme === option.value
                      ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value)
                    setIsOpen(false)
                  }}
                >
                  <option.icon className="h-4 w-4" />
                  <span className="font-medium">{option.label}</span>
                  {theme === option.value && (
                    <motion.div
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-600 dark:bg-teal-400"
                      layoutId="activeTheme"
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
