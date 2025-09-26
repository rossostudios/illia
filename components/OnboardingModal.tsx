'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

type OnboardingModalProps = {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [mounted, setMounted] = useState(false)
  const totalSteps = 4

  const steps = [
    {
      id: 1,
      icon: '✉️',
      title: 'Email Verified',
      description: 'Your email has been verified',
      claimed: true,
      credits: 0,
    },
    {
      id: 2,
      icon: '⭐',
      title: 'Star our GitHub repo',
      description: 'Check out our open source code and contribute',
      claimed: false,
      credits: 100,
    },
    {
      id: 3,
      icon: '💬',
      title: 'Join our Discord',
      description: 'Connect with us and get community help',
      claimed: false,
      credits: 50,
    },
    {
      id: 4,
      icon: '𝕏',
      title: 'Follow us on X',
      description: 'Stay updated on new features and launches',
      claimed: false,
      credits: 50,
    },
  ]

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([1]))

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleStepComplete = (stepId: number) => {
    setCompletedSteps((prev) => new Set([...prev, stepId]))
  }

  const handleContinue = () => {
    if (completedSteps.size === totalSteps) {
      onComplete()
    } else {
      onClose()
    }
  }

  if (!(isOpen && mounted)) {
    return null
  }

  const progressPercentage = (completedSteps.size / totalSteps) * 100

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={0}
      />

      {/* Modal - Responsive positioning */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="relative mx-auto w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
          {/* Modal Content - Full height on mobile, constrained on desktop */}
          <div className="flex max-h-[95vh] min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[90vh] md:max-h-[85vh]">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 border-b bg-white px-6 py-5 sm:p-6 lg:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                    Let&apos;s get you started
                  </h2>
                  <p className="mt-1 text-gray-600 text-sm sm:text-base lg:text-lg">
                    Complete these quick actions to earn bonus credits for your account.
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center space-x-2">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-500 text-xs">
                    OPTIONAL
                  </span>
                  <button aria-label="Close modal" className="rounded-lg p-1.5 transition-colors hover:bg-gray-100"
                    onClick={onClose}
                    type="button"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar - Fixed */}
            <div className="flex-shrink-0 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="mr-4 flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-teal-500 transition-all duration-300 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                <span className="flex-shrink-0 font-medium text-gray-700 text-sm">
                  STEP {completedSteps.size} OF {totalSteps}
                </span>
              </div>
            </div>

            {/* Steps List - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4 sm:p-6 lg:p-8">
              <div className="space-y-4">
                {steps.map((step) => {
                  const isCompleted = completedSteps.has(step.id)

                  return (
                    <div
                      className={`rounded-lg border p-5 transition-all ${
                        isCompleted
                          ? 'border-gray-200 bg-gray-50'
                          : 'border-gray-300 bg-white hover:border-teal-400 hover:shadow-sm'
                      }`}
                      key={step.id}
                    >
                      <div className="flex items-start gap-6">
                        {/* Icon */}
                        <div className="mt-0.5 flex-shrink-0 text-2xl">{step.icon}</div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`font-medium text-base lg:text-lg ${
                              isCompleted ? 'text-gray-500' : 'text-gray-900'
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p className="mt-1 text-gray-600 text-sm lg:text-base">
                            {step.description}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-shrink-0 items-center gap-4">
                          {step.credits > 0 && (
                            <span className="font-medium text-gray-700 text-sm">
                              +{step.credits} credits
                            </span>
                          )}
                          {isCompleted ? (
                            <span className="rounded-full bg-green-50 px-2.5 py-1 font-medium text-green-600 text-xs">
                              CLAIMED
                            </span>
                          ) : step.id !== 1 ? (
                            <button className="whitespace-nowrap font-medium text-sm text-teal-600 hover:text-teal-700" onClick={() => handleStepComplete(step.id)}
                              type="button"
                            >
                              Complete →
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* LinkedIn step (optional, not counted) */}
                <div className="rounded-lg border border-gray-300 bg-white p-5 transition-all hover:border-teal-400 hover:shadow-sm">
                  <div className="flex items-start gap-6">
                    <div className="mt-0.5 flex-shrink-0 text-2xl">💼</div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-base text-gray-900 lg:text-lg">
                        Follow us on LinkedIn
                      </h3>
                      <p className="mt-1 text-gray-600 text-sm lg:text-base">
                        Professional updates and insights
                      </p>
                    </div>
                    <button className="flex-shrink-0 whitespace-nowrap font-medium text-sm text-teal-600 hover:text-teal-700" type="button"
                    >
                      Follow →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 border-t bg-gray-50 p-6">
              <button className="w-full transform rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-all hover:scale-[1.02] hover:bg-teal-700 active:scale-[0.98]" onClick={handleContinue}
                type="button"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
