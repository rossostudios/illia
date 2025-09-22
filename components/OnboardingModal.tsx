'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface OnboardingModalProps {
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

  if (!isOpen || !mounted) return null

  const progressPercentage = (completedSteps.size / totalSteps) * 100

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal - Responsive positioning */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="relative w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
          {/* Modal Content - Full height on mobile, constrained on desktop */}
          <div className="bg-white rounded-2xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col min-w-0">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 px-6 py-5 sm:p-6 lg:px-8 border-b bg-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                    Let&apos;s get you started
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1">
                    Complete these quick actions to earn bonus credits for your account.
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    OPTIONAL
                  </span>
                  <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar - Fixed */}
            <div className="flex-shrink-0 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 flex-shrink-0">
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
                      key={step.id}
                      className={`border rounded-lg p-5 transition-all ${
                        isCompleted
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-white border-gray-300 hover:border-teal-400 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-6">
                        {/* Icon */}
                        <div className="flex-shrink-0 text-2xl mt-0.5">{step.icon}</div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-medium text-base lg:text-lg ${
                              isCompleted ? 'text-gray-500' : 'text-gray-900'
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p className="text-sm lg:text-base text-gray-600 mt-1">
                            {step.description}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          {step.credits > 0 && (
                            <span className="text-sm font-medium text-gray-700">
                              +{step.credits} credits
                            </span>
                          )}
                          {isCompleted ? (
                            <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium">
                              CLAIMED
                            </span>
                          ) : step.id !== 1 ? (
                            <button
                              onClick={() => handleStepComplete(step.id)}
                              className="text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
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
                <div className="border border-gray-300 rounded-lg p-5 hover:border-teal-400 hover:shadow-sm transition-all bg-white">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 text-2xl mt-0.5">💼</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base lg:text-lg text-gray-900">
                        Follow us on LinkedIn
                      </h3>
                      <p className="text-sm lg:text-base text-gray-600 mt-1">
                        Professional updates and insights
                      </p>
                    </div>
                    <button className="text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap flex-shrink-0">
                      Follow →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 p-6 border-t bg-gray-50">
              <button
                onClick={handleContinue}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
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
