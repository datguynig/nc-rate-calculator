import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'accent'
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-black text-white',
      secondary: 'bg-gray-100 text-gray-900',
      outline: 'border border-gray-300 text-gray-900',
      accent: 'gradient-accent text-black',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
