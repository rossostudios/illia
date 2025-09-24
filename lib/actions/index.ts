'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Type-safe server action response
export type ActionResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  validationErrors?: Record<string, string>
}

// Generic form validation wrapper
export async function createSafeAction<Input, Output>(
  schema: z.ZodSchema<Input>,
  handler: (data: Input) => Promise<ActionResponse<Output>>
) {
  return async (formData: FormData): Promise<ActionResponse<Output>> => {
    const rawData = Object.fromEntries(formData.entries())

    try {
      const validatedData = schema.parse(rawData)
      return await handler(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: Record<string, string> = {}
        for (const issue of error.issues) {
          const path = issue.path.join('.')
          validationErrors[path] = issue.message
        }
        return {
          success: false,
          validationErrors,
        }
      }

      return {
        success: false,
        error: 'An unexpected error occurred',
      }
    }
  }
}

// Example: Contact form server action
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function submitContactForm(formData: FormData): Promise<ActionResponse> {
  const action = createSafeAction(contactFormSchema, async (_data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Revalidate relevant paths
    revalidatePath('/')

    return {
      success: true,
      data: { message: 'Thank you for your message!' },
    }
  })

  return action(formData)
}

// Example: User profile update action
const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
})

export async function updateUserProfile(formData: FormData): Promise<ActionResponse> {
  const action = createSafeAction(updateProfileSchema, async (_data) => {
    revalidatePath('/dashboard/profile')

    return {
      success: true,
      data: { message: 'Profile updated successfully' },
    }
  })

  return action(formData)
}

// Example: Delete action with confirmation
export async function deleteItem(_id: string): Promise<ActionResponse> {
  try {
    revalidatePath('/dashboard')

    return {
      success: true,
      data: { message: 'Item deleted successfully' },
    }
  } catch (_error) {
    return {
      success: false,
      error: 'Failed to delete item',
    }
  }
}

// Example: Server action with redirect
export async function createPost(formData: FormData): Promise<ActionResponse> {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!(title && content)) {
    return {
      success: false,
      error: 'Title and content are required',
    }
  }

  try {
    // Create post logic here
    const postId = 'new-post-id' // This would come from your database

    redirect(`/posts/${postId}`)
  } catch (_error) {
    return {
      success: false,
      error: 'Failed to create post',
    }
  }
}
