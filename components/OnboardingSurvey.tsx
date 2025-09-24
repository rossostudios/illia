'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

type OnboardingSurveyProps = {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function OnboardingSurvey({ isOpen, onClose, onComplete }: OnboardingSurveyProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    useCase: '',
    otherUseCase: '',
    source: '',
    otherSource: '',
    termsAccepted: false,
    emailUpdates: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const totalSteps = 4

  const useCases = [
    {
      id: 'lead-generation',
      title: 'Lead Generation / Sales Data',
      description: 'Find & filter data for prospecting',
    },
    {
      id: 'ai-knowledge',
      title: 'AI Knowledge Base',
      description: 'Build RAG systems or internal AI assistants',
    },
    {
      id: 'product-scraping',
      title: 'Product Page Scraping',
      description: 'Extract structured product data from sites',
    },
    {
      id: 'content-generation',
      title: 'Content Generation',
      description: 'Produce or repurpose content from websites',
    },
  ]

  const sources = [
    { id: 'chatgpt', label: 'ChatGPT / AI Search', icon: '🤖' },
    { id: 'twitter', label: 'X/Twitter', icon: '𝕏', selected: true },
    { id: 'blog', label: 'Blog', icon: '📝' },
    { id: 'friend', label: 'From a friend', icon: '👤' },
    { id: 'github', label: 'GitHub', icon: '💻' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    localStorage.setItem('onboardingSurveyCompleted', 'true')
    onComplete()
  }

  const _progressPercentage = (currentStep / totalSteps) * 100

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">
        {/* Header */}
        <div className="border-b p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-2xl text-gray-900">
              {currentStep === 1 && 'What are you using Illia for?'}
              {currentStep === 2 && 'Where did you hear about us?'}
              {currentStep === 3 && 'Terms of Service & Privacy Policy'}
              {currentStep === 4 && 'Terms of Service & Privacy Policy'}
            </h2>
            {currentStep <= 2 && (
              <button
                className="text-gray-400 transition-colors hover:text-gray-600"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
          {currentStep <= 2 && (
            <p className="text-gray-500">
              Please answer a few questions to help us improve your experience.
            </p>
          )}
          {currentStep >= 3 && (
            <p className="text-gray-500">
              Please review and accept our terms and privacy policy to continue.
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="mr-4 flex flex-1 space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  className={`h-2 flex-1 rounded-full transition-all ${
                    step <= currentStep ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                  key={step}
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm">
              STEP {currentStep} OF {totalSteps}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Use Case */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {/* Other option with text field */}
                <div className="rounded-lg border p-4 transition-all hover:border-gray-400">
                  <label className="flex cursor-pointer items-start space-x-3">
                    <input
                      checked={formData.useCase === 'other'}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      onChange={() => setFormData({ ...formData, useCase: 'other' })}
                      type="checkbox"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Other</span>
                      {formData.useCase === 'other' && (
                        <input
                          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                          onChange={(e) =>
                            setFormData({ ...formData, otherUseCase: e.target.value })
                          }
                          placeholder="Please specify..."
                          type="text"
                          value={formData.otherUseCase}
                        />
                      )}
                    </div>
                  </label>
                </div>

                {/* Predefined options */}
                {useCases.map((useCase) => (
                  <div
                    className="cursor-pointer rounded-lg border p-4 transition-all hover:border-gray-400"
                    key={useCase.id}
                    onClick={() => setFormData({ ...formData, useCase: useCase.id })}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="pt-0.5">
                        <div
                          className={`h-4 w-4 rounded border-2 ${
                            formData.useCase === useCase.id
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {formData.useCase === useCase.id && (
                            <svg
                              aria-label="icon"
                              className="h-3 w-3 text-white"
                              fill="currentColor"
                              role="img"
                              viewBox="0 0 20 20"
                            >
                              <title>Icon</title>
                              <path
                                clipRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                fillRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{useCase.title}</h3>
                        <p className="mt-1 text-gray-500 text-sm">{useCase.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Source */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {/* Other option with text field */}
                <div className="rounded-lg border p-4 transition-all hover:border-gray-400">
                  <label className="flex cursor-pointer items-start space-x-3">
                    <input
                      checked={formData.source === 'other'}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      onChange={() => setFormData({ ...formData, source: 'other' })}
                      type="checkbox"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Other</span>
                      {formData.source === 'other' && (
                        <input
                          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                          onChange={(e) =>
                            setFormData({ ...formData, otherSource: e.target.value })
                          }
                          placeholder="Please specify..."
                          type="text"
                          value={formData.otherSource}
                        />
                      )}
                    </div>
                  </label>
                </div>

                {/* Predefined sources */}
                {sources.map((source) => (
                  <div
                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-gray-400 ${
                      source.selected ? 'border-orange-500 bg-orange-50' : ''
                    }`}
                    key={source.id}
                    onClick={() => setFormData({ ...formData, source: source.id })}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{source.icon}</span>
                        <span
                          className={`font-medium ${
                            formData.source === source.id ? 'text-orange-600' : 'text-gray-900'
                          }`}
                        >
                          {source.label}
                        </span>
                      </div>
                      {(formData.source === source.id || source.selected) && (
                        <div className="text-orange-500">
                          <svg
                            aria-label="icon"
                            className="h-5 w-5"
                            fill="currentColor"
                            role="img"
                            viewBox="0 0 20 20"
                          >
                            <title>Icon</title>
                            <path
                              clipRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              fillRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 & 4: Terms */}
          {(currentStep === 3 || currentStep === 4) && (
            <div className="space-y-6">
              {currentStep === 3 && (
                <>
                  <div className="max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-6">
                    <h3 className="mb-4 font-semibold text-gray-900">
                      TERMS OF USE / SERVICE AGREEMENT
                    </h3>
                    <p className="mb-4 text-gray-600 text-sm">
                      Date of last revision: November 5, 2024
                    </p>
                    <div className="prose prose-sm text-gray-600">
                      <p className="mb-4">
                        This terms of use or service agreement (&quot;Agreement&quot;) is between
                        SideGuide Technologies, Inc. d/b/a Illia, a Delaware Corporation
                        (&quot;Illia,&quot; &quot;Company,&quot; &quot;we,&quot; &quot;us,&quot;
                        &quot;our,&quot; or &quot;ourselves&quot;) and the person or entity
                        (&quot;you&quot; or &quot;your&quot;) that has decided to use our services;
                        any of our websites or apps; or any features, products, graphics, text,
                        images, photos, audio, video, location data, computer code, and all other
                        forms of data and communications (collectively, &quot;Services&quot;).
                      </p>
                      <p className="font-medium text-gray-700">
                        YOU MUST CONSENT TO THIS AGREEMENT TO USE OUR SERVICES. If you do not accept
                        and...
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start space-x-3">
                      <input
                        checked={formData.termsAccepted}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        onChange={(e) =>
                          setFormData({ ...formData, termsAccepted: e.target.checked })
                        }
                        type="checkbox"
                      />
                      <span className="text-gray-700 text-sm">
                        I agree to Illia&apos;s{' '}
                        <a className="text-orange-600 underline" href="#">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a className="text-orange-600 underline" href="#">
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>

                    <label className="flex items-start space-x-3">
                      <input
                        checked={formData.emailUpdates}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        onChange={(e) =>
                          setFormData({ ...formData, emailUpdates: e.target.checked })
                        }
                        type="checkbox"
                      />
                      <span className="text-gray-700 text-sm">
                        I want to receive product updates and launch emails. You can unsubscribe at
                        any time.
                      </span>
                    </label>
                  </div>

                  <div className="text-right text-gray-500 text-xs">SCROLL TO BOTTOM</div>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <div className="max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-6">
                    <h3 className="mb-4 font-semibold text-gray-900">3. Complaints</h3>
                    <p className="mb-4 text-gray-600 text-sm">
                      We respect the rights of all of our users, regardless of location or
                      citizenship. If you have any questions or concerns about any of these rights,
                      or if you would like to assert any of these rights at any time, please contact
                      help@illia.com.
                    </p>

                    <h3 className="mb-4 font-semibold text-gray-900">4. Questions about Policy</h3>
                    <p className="mb-4 text-gray-600 text-sm">
                      If you have any questions about this privacy policy, contact us at:
                      help@illia.com. By accessing any of our services or content, you are affirming
                      that you understand and agree with the terms of our privacy policy.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center rounded-lg bg-orange-50 p-3">
                      <input
                        checked={formData.termsAccepted}
                        className="h-4 w-4 rounded border-gray-300 text-orange-600"
                        disabled
                        type="checkbox"
                      />
                      <span className="ml-3 text-gray-700 text-sm">
                        I agree to Illia&apos;s{' '}
                        <a className="text-orange-600 underline" href="#">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a className="text-orange-600 underline" href="#">
                          Privacy Policy
                        </a>
                        .
                      </span>
                      <div className="ml-auto">
                        <div className="relative h-6 w-12 rounded-full bg-orange-500">
                          <div className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-white" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-3">
                      <input
                        checked={formData.emailUpdates}
                        className="h-4 w-4 rounded border-gray-300 text-gray-300"
                        disabled
                        type="checkbox"
                      />
                      <span className="ml-3 text-gray-700 text-sm">
                        I want to receive product updates and launch emails. You can unsubscribe at
                        any time.
                      </span>
                      <div className="ml-auto">
                        <div className="relative h-6 w-12 rounded-full bg-gray-200">
                          <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t p-6">
          {currentStep > 1 && (
            <button
              className="font-medium text-gray-600 transition-colors hover:text-gray-900"
              onClick={handleBack}
            >
              Back
            </button>
          )}

          <div className="ml-auto">
            {currentStep < 4 ? (
              <button
                className={`rounded-lg px-6 py-2.5 font-medium transition-all ${
                  (currentStep === 1 && formData.useCase) ||
                  (currentStep === 2 && formData.source) ||
                  (currentStep === 3 && formData.termsAccepted)
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'cursor-not-allowed bg-gray-200 text-gray-400'
                }`}
                disabled={
                  (currentStep === 1 && !formData.useCase) ||
                  (currentStep === 2 && !formData.source) ||
                  (currentStep === 3 && !formData.termsAccepted)
                }
                onClick={handleNext}
              >
                {currentStep === 3 ? 'Finish' : 'Continue'}
              </button>
            ) : (
              <button
                className="rounded-lg bg-gray-900 px-6 py-2.5 font-medium text-white transition-all hover:bg-gray-800 disabled:opacity-50"
                disabled={isLoading}
                onClick={handleFinish}
              >
                {isLoading ? 'Loading...' : 'Get Started'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
