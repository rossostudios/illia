'use client'

import { toast } from 'sonner'
import { useConfirm } from './ConfirmDialog'
import { ProgressBar, StepProgress } from './ProgressIndicators'

// Example implementations for your app

// 1. SONNER TOAST EXAMPLES
export function ToastExamples() {
  // Success toast
  const _handleSuccess = () => {
    toast.success('Profile updated successfully!', {
      description: 'Your changes have been saved.',
    })
  }

  // Error toast
  const _handleError = () => {
    toast.error('Failed to update profile', {
      description: 'Please check your connection and try again.',
    })
  }

  // Loading toast with promise
  const _handleAsyncOperation = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 3000)), {
      loading: 'Saving your changes...',
      success: 'Changes saved successfully!',
      error: 'Failed to save changes',
    })
  }

  // Custom action toast
  const _handleUndo = () => {
    toast('Message deleted', {
      action: {
        label: 'Undo',
        onClick: () => {},
      },
    })
  }

  return null // These are just examples
}

// 2. CONFIRMATION DIALOG EXAMPLE
export function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const confirm = useConfirm()

  const handleDelete = () => {
    confirm({
      title: 'Delete this item?',
      description: 'This action cannot be undone. This will permanently delete the item.',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        // Perform delete operation
        await onDelete()
        toast.success('Item deleted successfully')
      },
    })
  }

  return (
    <button className="text-red-600" onClick={handleDelete} type="button">
      Delete
    </button>
  )
}

// 3. FORM WITH VALIDATION FEEDBACK
export function FormWithValidation() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Show loading state
    const toastId = toast.loading('Submitting form...')

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update toast to success
      toast.success('Form submitted successfully!', { id: toastId })
    } catch (_error) {
      // Update toast to error
      toast.error('Failed to submit form', { id: toastId })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Submit</button>
    </form>
  )
}

// 4. FILE UPLOAD WITH PROGRESS
export function FileUploadWithProgress() {
  const handleUpload = () => {
    const toastId = toast(
      <div className="w-full">
        <p className="mb-2 font-medium">Uploading file...</p>
        <ProgressBar animated max={100} value={0} />
      </div>,
      { duration: Number.POSITIVE_INFINITY }
    )

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10

      if (progress <= 100) {
        toast(
          <div className="w-full">
            <p className="mb-2 font-medium">Uploading file...</p>
            <ProgressBar animated max={100} value={progress} />
          </div>,
          { id: toastId, duration: Number.POSITIVE_INFINITY }
        )
      }

      if (progress >= 100) {
        clearInterval(interval)
        toast.success('File uploaded successfully!', { id: toastId })
      }
    }, 500)
  }

  return (
    <button onClick={handleUpload} type="button">
      Upload File
    </button>
  )
}

// 5. MULTI-STEP PROCESS
export function MultiStepProcess() {
  const steps = [
    { label: 'Account Info', description: 'Basic details' },
    { label: 'Preferences', description: 'Your preferences' },
    { label: 'Verification', description: 'Verify identity' },
    { label: 'Complete', description: 'All done!' },
  ]

  return (
    <div className="p-6">
      <StepProgress currentStep={2} showLabels steps={steps} />
    </div>
  )
}
