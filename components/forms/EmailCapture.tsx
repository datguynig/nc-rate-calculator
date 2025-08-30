'use client'

import React, { useState } from 'react'
import { validateEmail } from '@/lib/format'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Mail, CheckCircle } from 'lucide-react'

interface EmailCaptureProps {
  discipline: string
  country: string
  onSuccess: () => void
  onCancel: () => void
}

const EmailCapture: React.FC<EmailCaptureProps> = ({
  discipline,
  country,
  onSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Check if we're on Netlify (for Netlify Forms)
  const isNetlify = typeof window !== 'undefined' && window.location.hostname.includes('netlify')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      // If on Netlify, use Netlify Forms (requires data-netlify attribute in production)
      if (isNetlify && process.env.NODE_ENV === 'production') {
        const formData = new FormData()
        formData.append('email', email)
        formData.append('discipline', discipline)
        formData.append('country', country)
        formData.append('form-name', 'rate-calculator-signup')

        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData as any).toString(),
        })

        if (response.ok) {
          setSuccess(true)
          setTimeout(onSuccess, 1500)
          return
        }
      }

      // Otherwise, use API route
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          discipline,
          country,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(onSuccess, 1500)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Perfect!</h3>
          <p className="text-gray-600">
            Your PDF report is being generated and we've recorded your subscription.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-newcomma-accent/10 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-newcomma-accent-dark" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Get your personalised PDF report
          </h3>
          <p className="text-sm text-gray-600">
            Download your rates and join other creatives getting freelancing tips.
          </p>
        </div>
      </div>

      {/* Hidden Netlify form for form detection */}
      <form 
        name="rate-calculator-signup" 
        hidden
        data-netlify="true"
      >
        <input type="email" name="email" />
        <input type="text" name="discipline" />
        <input type="text" name="country" />
      </form>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          error={error}
          required
        />

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            loading={loading}
          >
            Get PDF Report
          </Button>
        </div>
      </form>

      <p className="text-xs text-gray-500 text-center">
        We respect your privacy. No spam, unsubscribe anytime.{' '}
        <a href="/privacy" className="underline hover:no-underline">
          Privacy Policy
        </a>
      </p>
    </div>
  )
}

export default EmailCapture