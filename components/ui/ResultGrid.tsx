import React from 'react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'

interface ResultCardProps {
  title: string
  amount: number
  currency?: string
  highlighted?: boolean
  description?: string
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  amount,
  currency,
  highlighted = false,
  description,
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-6 text-center transition-all duration-200',
        {
          'border-orange-300 bg-gradient-to-br from-orange-100/20 to-pink-100/10 ring-2 ring-orange-200':
            highlighted,
          'border-gray-200 bg-white hover:border-gray-300': !highlighted,
        }
      )}
      style={{ paddingTop: highlighted ? '3rem' : '1.5rem' }}
    >
      {highlighted && (
        <div className="absolute -top-0 left-1/2 -translate-x-1/2 transform">
          <span className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-full px-4 py-1 text-xs font-semibold text-black">
            Recommended
          </span>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        <div
          className={cn(
            'text-3xl font-bold transition-colors',
            {
              'bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent': highlighted,
              'text-gray-900': !highlighted,
            }
          )}
        >
          {formatCurrency(amount, currency)}
        </div>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  )
}

interface ResultGridProps {
  low: number
  mid: number
  high: number
  currency?: string
  workType?: string
  className?: string
}

const ResultGrid: React.FC<ResultGridProps> = ({
  low,
  mid,
  high,
  currency,
  workType,
  className,
}) => {
  return (
    <div className={cn('grid gap-6 md:grid-cols-3', className)}>
      <ResultCard
        title="Conservative"
        amount={low}
        currency={currency}
        description={`Safe ${workType || 'rate'} to secure work`}
      />
      <ResultCard
        title="Recommended"
        amount={mid}
        currency={currency}
        highlighted
        description={`Balanced ${workType || 'rate'} for fair value`}
      />
      <ResultCard
        title="Premium"
        amount={high}
        currency={currency}
        description={`Higher ${workType || 'rate'} for ideal clients`}
      />
    </div>
  )
}

export { ResultGrid, ResultCard }
