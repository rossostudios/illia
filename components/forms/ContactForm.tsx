'use client'

import { useEffect, useRef } from 'react'
import { useFormAction } from '@/hooks/use-server-action'
import { submitContactForm } from '@/lib/actions'

export function ContactForm() {
  const { state, formAction, isPending } = useFormAction(
    async (_prevState, formData) => await submitContactForm(formData)
  )
  const formRef = useRef<HTMLFormElement>(null)

  // Reset form on successful submission
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state?.success])

  return (
    <form action={formAction} className="mx-auto max-w-md space-y-4" ref={formRef}>
      {state?.success && (
        <div className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-200">
          {(state.data as any)?.message}
        </div>
      )}

      {state?.error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {state.error}
        </div>
      )}

      <div>
        <label className="mb-2 block font-medium text-sm" htmlFor="name">
          Name
        </label>
        <input
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800"
          disabled={isPending}
          id="name"
          name="name"
          required
          type="text"
        />
        {state?.validationErrors?.name && (
          <p className="mt-1 text-red-500 text-sm">{state.validationErrors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium text-sm" htmlFor="email">
          Email
        </label>
        <input
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800"
          disabled={isPending}
          id="email"
          name="email"
          required
          type="email"
        />
        {state?.validationErrors?.email && (
          <p className="mt-1 text-red-500 text-sm">{state.validationErrors.email}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium text-sm" htmlFor="message">
          Message
        </label>
        <textarea
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-700 dark:bg-gray-800"
          disabled={isPending}
          id="message"
          name="message"
          required
          rows={4}
        />
        {state?.validationErrors?.message && (
          <p className="mt-1 text-red-500 text-sm">{state.validationErrors.message}</p>
        )}
      </div>

      <button
        className="w-full rounded-lg bg-teal-500 px-4 py-2 text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending}
        type="submit"
      >
        {isPending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
