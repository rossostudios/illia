'use client'

import { useActionState, useCallback, useOptimistic, useTransition } from 'react'
import type { ActionResponse } from '@/lib/actions'

// Hook for using server actions with React 19 features
export function useServerAction<T = unknown>(
  action: (formData: FormData) => Promise<ActionResponse<T>>,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: string) => void
    optimisticUpdate?: (prev: any, formData: FormData) => any
  }
) {
  const [isPending, startTransition] = useTransition()

  const executeAction = useCallback(
    async (formData: FormData) => {
      startTransition(async () => {
        const result = await action(formData)

        if (result.success) {
          options?.onSuccess?.(result.data as T)
        } else {
          options?.onError?.(result.error || 'An error occurred')
        }

        return result
      })
    },
    [action, options]
  )

  return {
    executeAction,
    isPending,
  }
}

// Hook for optimistic updates with server actions
export function useOptimisticAction<T>(
  initialState: T,
  action: (formData: FormData) => Promise<ActionResponse>,
  updateFn: (prev: T, formData: FormData) => T
) {
  const [optimisticState, setOptimisticState] = useOptimistic(initialState, updateFn)
  const [isPending, startTransition] = useTransition()

  const executeAction = useCallback(
    async (formData: FormData) => {
      startTransition(async () => {
        setOptimisticState(formData)
        await action(formData)
      })
    },
    [action, setOptimisticState]
  )

  return {
    optimisticState,
    executeAction,
    isPending,
  }
}

// Hook for form state with server actions (React 19)
export function useFormAction<T = unknown>(
  action: (prevState: ActionResponse<T> | null, formData: FormData) => Promise<ActionResponse<T>>,
  initialState?: ActionResponse<T> | null
) {
  const [state, formAction, isPending] = useActionState(action, initialState || null)

  return {
    state,
    formAction,
    isPending,
  }
}
