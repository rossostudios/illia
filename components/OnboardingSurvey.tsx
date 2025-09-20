'use client'

import { useState } from 'react'
import { X, ChevronLeft, Globe, Users, Brain, ShoppingBag, FileText, MessageSquare } from 'lucide-react'

interface OnboardingSurveyProps {
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
    emailUpdates: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const totalSteps = 4

  const useCases = [
    {
      id: 'lead-generation',
      title: 'Lead Generation / Sales Data',
      description: 'Find & filter data for prospecting'
    },
    {
      id: 'ai-knowledge',
      title: 'AI Knowledge Base',
      description: 'Build RAG systems or internal AI assistants'
    },
    {
      id: 'product-scraping',
      title: 'Product Page Scraping',
      description: 'Extract structured product data from sites'
    },
    {
      id: 'content-generation',
      title: 'Content Generation',
      description: 'Produce or repurpose content from websites'
    }
  ]

  const sources = [
    { id: 'chatgpt', label: 'ChatGPT / AI Search', icon: '🤖' },
    { id: 'twitter', label: 'X/Twitter', icon: '𝕏', selected: true },
    { id: 'blog', label: 'Blog', icon: '📝' },
    { id: 'friend', label: 'From a friend', icon: '👤' },
    { id: 'github', label: 'GitHub', icon: '💻' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼' }
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
    await new Promise(resolve => setTimeout(resolve, 2000))
    localStorage.setItem('onboardingSurveyCompleted', 'true')
    onComplete()
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {currentStep === 1 && "What are you using Firecrawl for?"}
              {currentStep === 2 && "Where did you hear about us?"}
              {currentStep === 3 && "Terms of Service & Privacy Policy"}
              {currentStep === 4 && "Terms of Service & Privacy Policy"}
            </h2>
            {currentStep <= 2 && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
          {currentStep <= 2 && (
            <p className="text-gray-500">Please answer a few questions to help us improve your experience.</p>
          )}
          {currentStep >= 3 && (
            <p className="text-gray-500">Please review and accept our terms and privacy policy to continue.</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2 flex-1 mr-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    step <= currentStep ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
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
                <div className="border rounded-lg p-4 hover:border-gray-400 transition-all">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.useCase === 'other'}
                      onChange={() => setFormData({ ...formData, useCase: 'other' })}
                      className="mt-0.5 h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Other</span>
                      {formData.useCase === 'other' && (
                        <input
                          type="text"
                          placeholder="Please specify..."
                          value={formData.otherUseCase}
                          onChange={(e) => setFormData({ ...formData, otherUseCase: e.target.value })}
                          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          autoFocus
                        />
                      )}
                    </div>
                  </label>
                </div>

                {/* Predefined options */}
                {useCases.map((useCase) => (
                  <div
                    key={useCase.id}
                    className="border rounded-lg p-4 hover:border-gray-400 transition-all cursor-pointer"
                    onClick={() => setFormData({ ...formData, useCase: useCase.id })}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="pt-0.5">
                        <div className={`h-4 w-4 rounded border-2 ${
                          formData.useCase === useCase.id
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.useCase === useCase.id && (
                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{useCase.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{useCase.description}</p>
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
                <div className="border rounded-lg p-4 hover:border-gray-400 transition-all">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.source === 'other'}
                      onChange={() => setFormData({ ...formData, source: 'other' })}
                      className="mt-0.5 h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Other</span>
                      {formData.source === 'other' && (
                        <input
                          type="text"
                          placeholder="Please specify..."
                          value={formData.otherSource}
                          onChange={(e) => setFormData({ ...formData, otherSource: e.target.value })}
                          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          autoFocus
                        />
                      )}
                    </div>
                  </label>
                </div>

                {/* Predefined sources */}
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className={`border rounded-lg p-4 hover:border-gray-400 transition-all cursor-pointer ${
                      source.selected ? 'border-orange-500 bg-orange-50' : ''
                    }`}
                    onClick={() => setFormData({ ...formData, source: source.id })}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{source.icon}</span>
                        <span className={`font-medium ${
                          formData.source === source.id ? 'text-orange-600' : 'text-gray-900'
                        }`}>
                          {source.label}
                        </span>
                      </div>
                      {(formData.source === source.id || source.selected) && (
                        <div className="text-orange-500">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
                  <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    <h3 className="font-semibold text-gray-900 mb-4">TERMS OF USE / SERVICE AGREEMENT</h3>
                    <p className="text-sm text-gray-600 mb-4">Date of last revision: November 5, 2024</p>
                    <div className="prose prose-sm text-gray-600">
                      <p className="mb-4">
                        This terms of use or service agreement ("Agreement") is between SideGuide Technologies, Inc.
                        d/b/a Firecrawl, a Delaware Corporation ("Firecrawl," "Company," "we," "us," "our," or "ourselves") and
                        the person or entity ("you" or "your") that has decided to use our services; any of our websites or
                        apps; or any features, products, graphics, text, images, photos, audio, video, location data,
                        computer code, and all other forms of data and communications (collectively, "Services").
                      </p>
                      <p className="font-medium text-gray-700">
                        YOU MUST CONSENT TO THIS AGREEMENT TO USE OUR SERVICES. If you do not accept and...
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                        className="mt-0.5 h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to Firecrawl's <a href="#" className="text-orange-600 underline">Terms of Service</a> and{' '}
                        <a href="#" className="text-orange-600 underline">Privacy Policy</a>.
                      </span>
                    </label>

                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.emailUpdates}
                        onChange={(e) => setFormData({ ...formData, emailUpdates: e.target.checked })}
                        className="mt-0.5 h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">
                        I want to receive product updates and launch emails. You can unsubscribe at any time.
                      </span>
                    </label>
                  </div>

                  <div className="text-xs text-gray-500 text-right">
                    SCROLL TO BOTTOM
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    <h3 className="font-semibold text-gray-900 mb-4">3. Complaints</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      We respect the rights of all of our users, regardless of location or citizenship. If you have any
                      questions or concerns about any of these rights, or if you would like to assert any of these rights at
                      any time, please contact help@firecrawl.com.
                    </p>

                    <h3 className="font-semibold text-gray-900 mb-4">4. Questions about Policy</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      If you have any questions about this privacy policy, contact us at: help@firecrawl.com. By
                      accessing any of our services or content, you are affirming that you understand and agree with the
                      terms of our privacy policy.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.termsAccepted}
                        disabled
                        className="h-4 w-4 text-orange-600 rounded border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        I agree to Firecrawl's <a href="#" className="text-orange-600 underline">Terms of Service</a> and{' '}
                        <a href="#" className="text-orange-600 underline">Privacy Policy</a>.
                      </span>
                      <div className="ml-auto">
                        <div className="h-6 w-12 bg-orange-500 rounded-full relative">
                          <div className="absolute right-0.5 top-0.5 h-5 w-5 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-3">
                      <input
                        type="checkbox"
                        checked={formData.emailUpdates}
                        disabled
                        className="h-4 w-4 text-gray-300 rounded border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        I want to receive product updates and launch emails. You can unsubscribe at any time.
                      </span>
                      <div className="ml-auto">
                        <div className="h-6 w-12 bg-gray-200 rounded-full relative">
                          <div className="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full" />
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
        <div className="p-6 border-t flex items-center justify-between">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Back
            </button>
          )}

          <div className="ml-auto">
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !formData.useCase) ||
                  (currentStep === 2 && !formData.source) ||
                  (currentStep === 3 && !formData.termsAccepted)
                }
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  ((currentStep === 1 && formData.useCase) ||
                   (currentStep === 2 && formData.source) ||
                   (currentStep === 3 && formData.termsAccepted))
                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentStep === 3 ? 'Finish' : 'Continue'}
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={isLoading}
                className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-all disabled:opacity-50"
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