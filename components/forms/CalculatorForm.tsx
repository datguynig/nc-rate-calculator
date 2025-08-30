'use client'

import React, { useState } from 'react'
import { CalculatorInputs, DISCIPLINES, COUNTRIES } from '@/lib/rates'
import { formatDiscipline } from '@/lib/format'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Stepper from '@/components/ui/Stepper'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const STEPS = [
  { id: 'basics', title: 'Basics', description: 'Your discipline & experience' },
  { id: 'work', title: 'Work Details', description: 'Type & targets' },
  { id: 'project', title: 'Project Factors', description: 'Complexity & usage' },
]

interface CalculatorFormProps {
  onSubmit: (inputs: CalculatorInputs) => void
  onBack?: () => void
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onSubmit, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<CalculatorInputs>>({
    discipline: '',
    experience: 'mid',
    location: 'United Kingdom',
    currency: 'GBP',
    workType: 'day',
    complexity: 'medium',
    usageRights: 'standard',
    rushJob: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const disciplineOptions = DISCIPLINES.map(discipline => ({
    value: discipline,
    label: formatDiscipline(discipline),
  }))

  const experienceOptions = [
    { value: 'junior', label: 'Junior (0-2 years)' },
    { value: 'mid', label: 'Mid-level (3-5 years)' },
    { value: 'senior', label: 'Senior (6+ years)' },
  ]

  const countryOptions = COUNTRIES.map(country => ({
    value: country.name,
    label: country.name,
  }))

  const workTypeOptions = [
    { value: 'day', label: 'Day rate' },
    { value: 'hour', label: 'Hourly rate' },
    { value: 'project', label: 'Project rate' },
  ]

  const complexityOptions = [
    { value: 'low', label: 'Low - Simple, straightforward work' },
    { value: 'medium', label: 'Medium - Standard complexity' },
    { value: 'high', label: 'High - Complex, challenging work' },
  ]

  const usageRightsOptions = [
    { value: 'none', label: 'Limited usage rights' },
    { value: 'standard', label: 'Standard usage rights' },
    { value: 'extended', label: 'Extended/unlimited usage' },
  ]

  const handleInputChange = (field: keyof CalculatorInputs, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Auto-set currency when location changes
    if (field === 'location') {
      const country = COUNTRIES.find(c => c.name === value)
      if (country) {
        setFormData(prev => ({ ...prev, currency: country.currency }))
      }
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.discipline) newErrors.discipline = 'Please select your discipline'
        if (!formData.experience) newErrors.experience = 'Please select your experience level'
        if (!formData.location) newErrors.location = 'Please select your location'
        break
      case 2:
        if (!formData.workType) newErrors.workType = 'Please select a work type'
        if (formData.annualIncomeTarget && formData.annualIncomeTarget < 1000) {
          newErrors.annualIncomeTarget = 'Please enter a realistic annual target'
        }
        if (formData.billableDays && (formData.billableDays < 50 || formData.billableDays > 300)) {
          newErrors.billableDays = 'Billable days should be between 50-300'
        }
        break
      case 3:
        if (!formData.complexity) newErrors.complexity = 'Please select project complexity'
        if (!formData.usageRights) newErrors.usageRights = 'Please select usage rights'
        if (formData.workType === 'project' && formData.scopeDays && formData.scopeDays < 0.5) {
          newErrors.scopeDays = 'Scope days should be at least 0.5'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1)
      } else {
        // Submit form
        const completeData: CalculatorInputs = {
          discipline: formData.discipline!,
          experience: formData.experience as 'junior' | 'mid' | 'senior',
          location: formData.location!,
          currency: formData.currency!,
          workType: formData.workType as 'day' | 'hour' | 'project',
          complexity: formData.complexity as 'low' | 'medium' | 'high',
          usageRights: formData.usageRights as 'none' | 'standard' | 'extended',
          rushJob: formData.rushJob || false,
          annualIncomeTarget: formData.annualIncomeTarget,
          billableDays: formData.billableDays,
          billableHoursPerDay: formData.billableHoursPerDay,
          scopeDays: formData.scopeDays,
        }
        onSubmit(completeData)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    } else if (onBack) {
      onBack()
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Select
              label="What's your creative discipline?"
              options={disciplineOptions}
              value={formData.discipline || ''}
              onChange={(e) => handleInputChange('discipline', e.target.value)}
              placeholder="Select your discipline..."
              error={errors.discipline}
            />

            <Select
              label="What's your experience level?"
              options={experienceOptions}
              value={formData.experience || 'mid'}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              error={errors.experience}
              helperText="This affects your baseline rate calculation"
            />

            <Select
              label="Where are you based?"
              options={countryOptions}
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Select your country..."
              error={errors.location}
              helperText="We'll adjust rates for your local market"
            />

            <Input
              type="text"
              label="Currency (auto-detected)"
              value={formData.currency || ''}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              placeholder="GBP"
              helperText="You can change this if needed"
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Select
              label="What type of rate do you need?"
              options={workTypeOptions}
              value={formData.workType || 'day'}
              onChange={(e) => handleInputChange('workType', e.target.value)}
              error={errors.workType}
            />

            <Input
              type="number"
              label="Annual income target (optional)"
              value={formData.annualIncomeTarget || ''}
              onChange={(e) => handleInputChange('annualIncomeTarget', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="45000"
              error={errors.annualIncomeTarget}
              helperText="Leave blank to use experience-based defaults"
            />

            <Input
              type="number"
              label="Billable days per year (optional)"
              value={formData.billableDays || ''}
              onChange={(e) => handleInputChange('billableDays', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="140"
              error={errors.billableDays}
              helperText="How many days you plan to work annually (default: 140)"
            />

            <Input
              type="number"
              step="0.5"
              label="Billable hours per day (optional)"
              value={formData.billableHoursPerDay || ''}
              onChange={(e) => handleInputChange('billableHoursPerDay', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="7.5"
              helperText="Used to derive hourly rates from your day rate (default: 7.5)"
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Select
              label="Project complexity"
              options={complexityOptions}
              value={formData.complexity || 'medium'}
              onChange={(e) => handleInputChange('complexity', e.target.value)}
              error={errors.complexity}
            />

            <Select
              label="Usage rights"
              options={usageRightsOptions}
              value={formData.usageRights || 'standard'}
              onChange={(e) => handleInputChange('usageRights', e.target.value)}
              error={errors.usageRights}
              helperText="Extended rights typically command higher rates"
            />

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="rushJob"
                checked={formData.rushJob || false}
                onChange={(e) => handleInputChange('rushJob', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-newcomma-accent focus:ring-newcomma-accent"
              />
              <label htmlFor="rushJob" className="text-sm font-medium text-gray-700">
                Rush job (tight deadline)
              </label>
            </div>

            {formData.workType === 'project' && (
              <Input
                type="number"
                step="0.5"
                label="Estimated scope (days)"
                value={formData.scopeDays || ''}
                onChange={(e) => handleInputChange('scopeDays', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="5"
                error={errors.scopeDays}
                helperText="How many days do you estimate this project will take?"
              />
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Stepper steps={STEPS} currentStep={currentStep} />

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          <p className="text-sm text-gray-600">{STEPS[currentStep - 1].description}</p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{currentStep === 1 ? 'Back to start' : 'Previous'}</span>
            </Button>

            <Button
              variant="primary"
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>{currentStep === 3 ? 'Calculate rates' : 'Next'}</span>
              {currentStep < 3 && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CalculatorForm
