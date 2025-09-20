'use client'

import { useState } from 'react'
import { X, Check, Github } from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const steps = [
    {
      id: 1,
      title: 'Email Verified',
      description: 'Your email has been verified',
      claimed: true,
      credits: 0
    },
    {
      id: 2,
      title: 'Star our GitHub repo',
      description: 'Check out our open source code and contribute',
      claimed: false,
      credits: 100
    },
    {
      id: 3,
      title: 'Join our Discord',
      description: 'Connect with us and get community help',
      claimed: false,
      credits: 50
    },
    {
      id: 4,
      title: 'Follow us on X',
      description: 'Stay updated on new features and launches',
      claimed: false,
      credits: 50
    }
  ]

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([1]))

  const handleStepComplete = (stepId: number) => {
    setCompletedSteps(prev => new Set([...prev, stepId]))
  }

  const handleContinue = () => {
    if (completedSteps.size === totalSteps) {
      onComplete()
    } else {
      // Just close the modal for now
      onClose()
    }
  }

  if (!isOpen) return null

  const progressPercentage = (completedSteps.size / totalSteps) * 100

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Let's get you started</h2>
              <p className="text-gray-500 mt-1">Complete these quick actions to earn bonus credits for your account.</p>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">OPTIONAL</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-2 bg-gray-200 rounded-full flex-1 mr-4">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-500">
              STEP {completedSteps.size} OF {totalSteps}
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-4">
          {steps.map((step) => {
            const isCompleted = completedSteps.has(step.id)

            return (
              <div
                key={step.id}
                className={`border rounded-lg p-4 transition-all ${
                  isCompleted ? 'bg-gray-50 border-gray-200' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {step.id === 1 && (
                        <div className="text-2xl">✉️</div>
                      )}
                      {step.id === 2 && (
                        <Github className="h-6 w-6" />
                      )}
                      {step.id === 3 && (
                        <div className="text-2xl">💬</div>
                      )}
                      {step.id === 4 && (
                        <div className="text-2xl">𝕏</div>
                      )}
                      <div>
                        <h3 className={`font-medium ${isCompleted ? 'text-gray-500' : 'text-gray-900'}`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {step.credits > 0 && (
                      <span className="text-sm font-medium text-gray-600">
                        +{step.credits} credits
                      </span>
                    )}
                    {isCompleted ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                        CLAIMED
                      </span>
                    ) : step.id !== 1 ? (
                      <button
                        onClick={() => handleStepComplete(step.id)}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
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
          <div className="border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">💼</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Follow us on LinkedIn</h3>
                    <p className="text-sm text-gray-500">Professional updates and insights</p>
                  </div>
                </div>
              </div>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                Follow →
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <button
            onClick={handleContinue}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}