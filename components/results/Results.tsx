'use client'

import React, { useState } from 'react'
import { AllRates, CalculatorInputs } from '@/lib/rates'
import { formatCurrency } from '@/lib/format'
import { ResultGrid } from '@/components/ui/ResultGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import EmailCapture from '@/components/forms/EmailCapture'
import { Download, ArrowLeft, TrendingUp, Globe, Award } from 'lucide-react'
import { generateRatesPDF } from '@/lib/pdf-generator'

interface ResultsProps {
  rates: AllRates
  inputs: CalculatorInputs
  onBack: () => void
  onRestart: () => void
}

const Results: React.FC<ResultsProps> = ({ rates, inputs, onBack, onRestart }) => {
  const [activeTab, setActiveTab] = useState<'day' | 'hour' | 'project'>(inputs.workType)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailCaptured, setEmailCaptured] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)

  const currentRates = rates[activeTab]

  const doGeneratePDF = async () => {
    try {
      setPdfError(null)
      setPdfLoading(true)
      await Promise.resolve(generateRatesPDF(rates, inputs))
    } catch (err) {
      console.error(err)
      setPdfError('Failed to generate PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  const handleDownloadPDF = () => {
    if (emailCaptured) {
      void doGeneratePDF()
    } else {
      setShowEmailModal(true)
    }
  }

  const handleEmailSuccess = () => {
    setEmailCaptured(true)
    setShowEmailModal(false)
    void doGeneratePDF()
  }

  const tabs = [
    { id: 'day' as const, label: 'Day Rates' },
    { id: 'hour' as const, label: 'Hourly Rates' },
    { id: 'project' as const, label: 'Project Rates' },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Your Recommended Rates
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your {inputs.experience} experience in {inputs.discipline} and market data for {inputs.location}.
        </p>
      </div>

      {/* Rate Type Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-gray-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <ResultGrid
        low={currentRates.low}
        mid={currentRates.mid}
        high={currentRates.high}
        currency={inputs.currency}
        workType={activeTab}
      />

      {/* Rate Breakdown & Comparisons */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Rate Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span>Rate Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Base {inputs.discipline} rate</span>
                <span className="font-medium">{formatCurrency(rates.breakdown.baseRate, inputs.currency)}</span>
              </div>
              
              <div className="space-y-2 pl-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">× {rates.breakdown.factors.experience.description}</span>
                  <span>{rates.breakdown.factors.experience.multiplier}x</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">× {rates.breakdown.factors.location.description}</span>
                  <span>{rates.breakdown.factors.location.multiplier}x</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-t border-gray-100 font-medium">
                <span>Market benchmark</span>
                <span>{formatCurrency(rates.breakdown.benchmarkRate, inputs.currency)}</span>
              </div>
              
              <div className="space-y-2 pl-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">× {rates.breakdown.factors.complexity.description}</span>
                  <span>{rates.breakdown.factors.complexity.multiplier}x</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">× {rates.breakdown.factors.usage.description}</span>
                  <span>{rates.breakdown.factors.usage.multiplier}x</span>
                </div>
                {rates.breakdown.factors.rush.multiplier > 1.0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">× {rates.breakdown.factors.rush.description}</span>
                    <span>{rates.breakdown.factors.rush.multiplier}x</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center py-2 border-t border-gray-100 font-semibold text-lg">
                <span>Your adjusted rate</span>
                <span className="text-orange-600">{formatCurrency(rates.breakdown.adjustedRate, inputs.currency)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-500" />
              <span>Experience Levels</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rates.comparisons.experience.map((exp, index) => (
                <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${
                  exp.level.toLowerCase().includes(inputs.experience) 
                    ? 'bg-orange-50 border border-orange-200' 
                    : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{exp.level}</span>
                    {exp.level.toLowerCase().includes(inputs.experience) && (
                      <Badge variant="accent" className="text-xs">You</Badge>
                    )}
                  </div>
                  <span className="font-semibold">{formatCurrency(exp.rate, inputs.currency)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-green-500" />
            <span>Global Market Rates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {rates.comparisons.locations.map((location, index) => (
              <div key={index} className={`p-4 rounded-lg text-center ${
                location.country === inputs.location
                  ? 'bg-orange-50 border border-orange-200'
                  : 'bg-gray-50'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-sm font-medium">{location.country}</span>
                    {location.country === inputs.location && (
                      <Badge variant="accent" className="text-xs">You</Badge>
                    )}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(location.rate, inputs.currency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reasoning */}
      <Card>
        <CardHeader>
          <CardTitle>How We Calculated This</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed">{currentRates.reasoning}</p>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Negotiation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {currentRates.tips.map((tip, index) => (
              <Badge key={index} variant="secondary" className="text-left py-2 px-3">
                {tip}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rate Tracking Section */}
      {!emailCaptured && (
        <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50">
          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Track Your Rate Progress
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Save these results and get notified when market rates change in your area. 
                See how your pricing evolves over time.
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => setShowEmailModal(true)}
                className="mt-4"
              >
                Save My Rates & Get Updates
              </Button>
              <p className="text-xs text-gray-500">
                Join 10,000+ freelancers tracking their rate growth
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          variant="primary"
          size="lg"
          onClick={() => window.open('https://home.newcomma.com/pricing', '_blank')}
        >
          Upgrade to Pro
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => window.open('https://home.newcomma.com/pricing', '_blank')}
        >
          Upgrade to Plus
        </Button>
        <Button
          variant="tertiary"
          size="lg"
          onClick={handleDownloadPDF}
          loading={pdfLoading}
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download PDF Report</span>
        </Button>
      </div>

      {pdfError && (
        <div className="text-center text-sm text-red-600">{pdfError}</div>
      )}

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Adjust inputs</span>
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          Start over
        </Button>
      </div>

      {/* Email Capture Modal */}
      <Modal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Get Your PDF Report"
      >
        <EmailCapture
          discipline={inputs.discipline}
          country={inputs.location}
          onSuccess={handleEmailSuccess}
          onCancel={() => setShowEmailModal(false)}
        />
      </Modal>
    </div>
  )
}

export default Results
