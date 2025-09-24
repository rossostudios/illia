'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

type StepperProps = {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export function ConnectedStepper({ currentStep, totalSteps, labels = [] }: StepperProps) {
  return (
    <div className="relative mb-8 w-full">
      {/* Steps Container */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div className="relative flex flex-1 flex-col items-center" key={step}>
            {/* Step Circle */}
            <motion.div
              animate={{
                scale: step === currentStep ? 1.15 : 1,
                opacity: 1,
              }}
              aria-label={`${
                step === currentStep
                  ? 'Current step'
                  : step < currentStep
                    ? 'Completed step'
                    : 'Upcoming step'
              } ${step} of ${totalSteps}: ${labels[step - 1] || `Step ${step}`}`}
              aria-valuemax={totalSteps}
              aria-valuemin={1}
              aria-valuenow={step}
              className={`relative z-10 flex h-12 w-12 cursor-default items-center justify-center rounded-full font-semibold text-sm transition-all duration-300 ${
                step < currentStep
                  ? 'bg-teal-600 text-white shadow-lg ring-4 ring-teal-100'
                  : step === currentStep
                    ? 'scale-110 bg-teal-600 text-white shadow-xl ring-4 ring-teal-200'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
              `}
              initial={{ scale: 0.8, opacity: 0 }}
              role="progressbar"
              transition={{
                duration: 0.3,
                delay: step * 0.1,
                type: 'spring',
                stiffness: 200,
              }}
            >
              {step < currentStep ? (
                <motion.div
                  animate={{ scale: 1 }}
                  initial={{ scale: 0 }}
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
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 px-2 text-center font-medium text-sm ${step <= currentStep ? 'text-gray-900' : 'text-gray-600'}
                `}
                initial={{ opacity: 0, y: -10 }}
                transition={{ delay: step * 0.1 + 0.2 }}
              >
                {labels[step - 1]}
              </motion.span>
            )}

            {/* Connecting Line */}
            {step < totalSteps && (
              <motion.div
                animate={{
                  scaleX: step < currentStep ? 1 : 0.3,
                  opacity: step < currentStep ? 1 : 0.5,
                }}
                className={`-z-10 absolute top-6 left-[50%] h-1 w-full ${step < currentStep ? 'bg-teal-600' : 'bg-gray-200'}
                `}
                initial={{ scaleX: 0 }}
                style={{
                  transformOrigin: 'left center',
                  width: 'calc(100% - 48px)',
                  left: 'calc(50% + 24px)',
                }}
                transition={{
                  duration: 0.5,
                  delay: step * 0.15,
                  ease: 'easeInOut',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar Background (Mobile) */}
      <div className="-z-20 absolute top-6 right-12 left-12 h-1 bg-gray-200 sm:hidden" />
    </div>
  )
}
