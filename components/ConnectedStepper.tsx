'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface StepperProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export function ConnectedStepper({ currentStep, totalSteps, labels = [] }: StepperProps) {
  return (
    <div className="relative w-full mb-8">
      {/* Steps Container */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-col items-center flex-1 relative">
            {/* Step Circle */}
            <motion.div
              className={`
                relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold
                transition-all duration-300 cursor-default
                ${
                  step < currentStep
                    ? 'bg-teal-600 text-white shadow-lg ring-4 ring-teal-100'
                    : step === currentStep
                      ? 'bg-teal-600 text-white shadow-xl ring-4 ring-teal-200 scale-110'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: step === currentStep ? 1.15 : 1,
                opacity: 1,
              }}
              transition={{
                duration: 0.3,
                delay: step * 0.1,
                type: 'spring',
                stiffness: 200,
              }}
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={`${
                step === currentStep
                  ? 'Current step'
                  : step < currentStep
                    ? 'Completed step'
                    : 'Upcoming step'
              } ${step} of ${totalSteps}: ${labels[step - 1] || `Step ${step}`}`}
            >
              {step < currentStep ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Check className="h-6 w-6" strokeWidth={3} />
                </motion.div>
              ) : (
                <span>{step}</span>
              )}
            </motion.div>

            {/* Step Label */}
            {labels[step - 1] && (
              <motion.span
                className={`
                  mt-3 text-sm font-medium text-center px-2
                  ${step <= currentStep ? 'text-gray-900' : 'text-gray-600'}
                `}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: step * 0.1 + 0.2 }}
              >
                {labels[step - 1]}
              </motion.span>
            )}

            {/* Connecting Line */}
            {step < totalSteps && (
              <motion.div
                className={`
                  absolute top-6 left-[50%] w-full h-1 -z-10
                  ${step < currentStep ? 'bg-teal-600' : 'bg-gray-200'}
                `}
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: step < currentStep ? 1 : 0.3,
                  opacity: step < currentStep ? 1 : 0.5,
                }}
                transition={{
                  duration: 0.5,
                  delay: step * 0.15,
                  ease: 'easeInOut',
                }}
                style={{
                  transformOrigin: 'left center',
                  width: 'calc(100% - 48px)',
                  left: 'calc(50% + 24px)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar Background (Mobile) */}
      <div className="sm:hidden absolute top-6 left-12 right-12 h-1 bg-gray-200 -z-20" />
    </div>
  )
}
