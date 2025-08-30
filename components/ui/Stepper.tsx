import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
  id: string
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className }) => {
  return (
    <nav aria-label="Progress" className={cn('', className)}>
      <ol className="flex items-center justify-center space-x-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCurrent = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <li key={step.id} className="flex items-center space-x-3">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                    {
                      'gradient-accent text-black': isCurrent,
                      'bg-black text-white': isCompleted,
                      'bg-gray-200 text-gray-600': isUpcoming,
                    }
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                
                {/* Step title */}
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      'text-sm font-medium',
                      {
                        'text-black': isCurrent || isCompleted,
                        'text-gray-500': isUpcoming,
                      }
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="mt-1 text-xs text-gray-500">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-16 transition-colors',
                    {
                      'bg-black': isCompleted,
                      'bg-gray-200': !isCompleted,
                    }
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Stepper