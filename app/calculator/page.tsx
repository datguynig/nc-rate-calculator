'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import CalculatorForm from '@/components/forms/CalculatorForm'
import Results from '@/components/results/Results'
import { calculateAllRates, CalculatorInputs } from '@/lib/rates'
import { ArrowLeft } from 'lucide-react'

type Step = 'form' | 'loading' | 'results'

const CalculatorPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('form')
  const [inputs, setInputs] = useState<CalculatorInputs | null>(null)
  const [results, setResults] = useState<any>(null)

  const handleFormSubmit = (formInputs: CalculatorInputs) => {
    setInputs(formInputs)
    setCurrentStep('loading')
    
    // Simulate calculation time for better UX
    setTimeout(() => {
      const calculatedRates = calculateAllRates(formInputs)
      setResults(calculatedRates)
      setCurrentStep('results')
    }, 2500) // 2.5 second delay
  }

  const handleBackToForm = () => {
    setCurrentStep('form')
  }

  const handleRestart = () => {
    setInputs(null)
    setResults(null)
    setCurrentStep('form')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">NC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">NewComma</span>
            </Link>
            
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to home</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {currentStep === 'form' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Rate Calculator
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Answer a few questions about your work and we'll calculate 
                fair rates for your freelance services.
              </p>
            </div>

            <CalculatorForm 
              onSubmit={handleFormSubmit}
              onBack={() => window.location.href = '/'}
            />
          </div>
        )}

        {currentStep === 'loading' && (
          <div className="max-w-2xl mx-auto text-center space-y-8 py-20">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-orange-500 font-bold">NC</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Calculating your rates...
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Analyzing market data, experience level, and project complexity to generate personalized pricing recommendations.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'results' && inputs && results && (
          <Results
            rates={results}
            inputs={inputs}
            onBack={handleBackToForm}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  )
}

export default CalculatorPage
