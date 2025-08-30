'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Calculator, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmailSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">NC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">NewComma</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  UK creatives lose{' '}
                  <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    £12,400 annually
                  </span>{' '}
                  by underpricing
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Stop leaving money on the table. Get data-driven rates that win work 
                  and pay fairly, based on 50,000+ freelancer submissions.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 py-6 border-y border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">£12,400</div>
                  <div className="text-sm text-gray-600 mt-1">Average annual increase</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">73%</div>
                  <div className="text-sm text-gray-600 mt-1">Undercharge by 20%+</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">2 mins</div>
                  <div className="text-sm text-gray-600 mt-1">To get your rates</div>
                </div>
              </div>

              <div className="space-y-4">
                <Link href="/calculator">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-8">
                    Get Your Fair Rate Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-sm text-gray-500">
                  Free rate analysis • No signup required • Takes 2 minutes
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-2 border-orange-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sample: Mid-level Designer, London</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Live Data</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Conservative</div>
                        <div className="text-lg font-bold">£340</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200 rounded-lg">
                        <div className="text-sm text-orange-600 font-medium">Recommended</div>
                        <div className="text-lg font-bold">£425</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Premium</div>
                        <div className="text-lg font-bold">£510</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Success Stories</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900">Sarah M.</div>
                      <div className="text-sm text-gray-600">UX Designer, London</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-600 font-medium">+47%</div>
                      <div className="text-xs text-gray-500">£350 → £515</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "I was charging £350/day. Discovered I should be at £515. Raised my rates and clients still book me."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {!emailSubmitted ? (
              <>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    Get rate alerts for your discipline
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Market rates change quarterly. Be first to know when your discipline's 
                    rates increase so you never miss an opportunity to raise yours.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                  <div className="flex space-x-3">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-white text-gray-900"
                      required
                    />
                    <Button type="submit" variant="secondary" size="lg">
                      Get Alerts
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Free forever • Unsubscribe anytime • Never spam
                  </p>
                </form>
              </>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">You're all set!</h2>
                <p className="text-gray-300">
                  We'll email you when rates change in your area. Ready to calculate your current fair rate?
                </p>
                <Link href="/calculator">
                  <Button variant="secondary" size="lg">
                    Calculate My Rates
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Join 10,000+ creatives earning what they're worth
            </h2>
            <p className="text-gray-600 text-lg">
              Stop second-guessing your prices. Get data-backed rates that clients 
              respect and you can defend with confidence.
            </p>
            <Link href="/calculator">
              <Button variant="primary" size="lg" className="text-lg px-12">
                Calculate My Fair Rate
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-pink-400 rounded flex items-center justify-center">
              <span className="text-black font-bold text-xs">NC</span>
            </div>
            <span className="text-gray-900 font-medium">NewComma</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </Link>
            <a href="https://home.newcomma.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
              About NewComma
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
