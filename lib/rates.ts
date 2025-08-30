export interface CalculatorInputs {
  discipline: string
  experience: 'junior' | 'mid' | 'senior'
  location: string
  currency: string
  workType: 'day' | 'hour' | 'project'
  annualIncomeTarget?: number
  billableDays?: number
  complexity: 'low' | 'medium' | 'high'
  usageRights: 'none' | 'standard' | 'extended'
  rushJob: boolean
  scopeDays?: number
}

export interface RateResult {
  low: number
  mid: number
  high: number
  reasoning: string
  tips: string[]
}

export interface RateBreakdown {
  baseRate: number
  adjustedRate: number
  benchmarkRate: number
  factors: {
    experience: { multiplier: number; description: string }
    location: { multiplier: number; description: string }
    complexity: { multiplier: number; description: string }
    usage: { multiplier: number; description: string }
    rush: { multiplier: number; description: string }
  }
}

export interface AllRates {
  day: RateResult
  hour: RateResult
  project: RateResult
  breakdown: RateBreakdown
  comparisons: {
    experience: Array<{ level: string; rate: number }>
    locations: Array<{ country: string; rate: number }>
  }
}

const DEFAULT_ANNUAL_TARGETS = {
  junior: 28000,
  mid: 45000,
  senior: 70000,
}

const DISCIPLINE_BASELINES: Record<string, number> = {
  design: 300,
  photography: 350,
  videography: 400,
  writing: 250,
  marketing: 300,
  illustration: 300,
  motion: 450,
  'web development': 400,
  'ui ux': 450,
  music: 250,
  animation: 450,
  '3d': 500,
  other: 300,
}

const EXPERIENCE_MULTIPLIERS = {
  junior: 0.8,
  mid: 1.0,
  senior: 1.3,
}

const LOCATION_MULTIPLIERS: Record<string, number> = {
  'United Kingdom': 1.0,
  'United States': 1.1,
  'United States': 1.1,
  'Canada': 1.05,
  'Australia': 1.05,
  'Germany': 1.0,
  'Netherlands': 1.05,
  'Nigeria': 0.6,
  'Ghana': 0.55,
  'Kenya': 0.6,
  'South Africa': 0.7,
  'India': 0.55,
  'Brazil': 0.65,
  'United Arab Emirates': 1.05,
}

const COMPLEXITY_MULTIPLIERS = {
  low: 0.9,
  medium: 1.0,
  high: 1.2,
}

const USAGE_MULTIPLIERS = {
  none: 0.95,
  standard: 1.0,
  extended: 1.25,
}

export function calculateAllRates(inputs: CalculatorInputs): AllRates {
  const baseRate = DISCIPLINE_BASELINES[inputs.discipline] || 300
  const experienceMultiplier = EXPERIENCE_MULTIPLIERS[inputs.experience]
  const locationMultiplier = LOCATION_MULTIPLIERS[inputs.location] || 1.0
  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[inputs.complexity]
  const usageMultiplier = USAGE_MULTIPLIERS[inputs.usageRights]
  const rushMultiplier = inputs.rushJob ? 1.15 : 1.0
  
  // Calculate benchmark (market standard)
  const benchmarkRate = Math.round(baseRate * experienceMultiplier * locationMultiplier / 5) * 5
  
  // Calculate adjusted rate (with project factors)
  const adjustedRate = Math.round(benchmarkRate * complexityMultiplier * usageMultiplier * rushMultiplier / 5) * 5
  
  // Final day rates
  const dayLow = Math.round(adjustedRate * 0.85 / 5) * 5
  const dayMid = adjustedRate
  const dayHigh = Math.round(adjustedRate * 1.15 / 5) * 5
  
  // Experience comparisons
  const experienceComparisons = [
    { level: 'Junior (0-2 years)', rate: Math.round(baseRate * 0.8 * locationMultiplier / 5) * 5 },
    { level: 'Mid-level (3-5 years)', rate: Math.round(baseRate * 1.0 * locationMultiplier / 5) * 5 },
    { level: 'Senior (6+ years)', rate: Math.round(baseRate * 1.3 * locationMultiplier / 5) * 5 },
  ]
  
  // Location comparisons (top 5 markets)
  const locationComparisons = [
    { country: 'United States', rate: Math.round(baseRate * experienceMultiplier * 1.1 / 5) * 5 },
    { country: 'Netherlands', rate: Math.round(baseRate * experienceMultiplier * 1.05 / 5) * 5 },
    { country: 'Australia', rate: Math.round(baseRate * experienceMultiplier * 1.05 / 5) * 5 },
    { country: 'Canada', rate: Math.round(baseRate * experienceMultiplier * 1.05 / 5) * 5 },
    { country: 'United Kingdom', rate: Math.round(baseRate * experienceMultiplier * 1.0 / 5) * 5 },
  ].sort((a, b) => b.rate - a.rate)

  return {
    day: {
      low: dayLow,
      mid: dayMid,
      high: dayHigh,
      reasoning: `Based on ${inputs.experience} ${inputs.discipline} rates in ${inputs.location}, adjusted for project complexity and usage requirements.`,
      tips: [
        'Set clear scope boundaries to prevent scope creep',
        'Request 25-50% deposit before starting work',
        'Review and adjust rates annually based on experience'
      ]
    },
    hour: {
      low: Math.round(dayLow / 7.5 / 5) * 5,
      mid: Math.round(dayMid / 7.5 / 5) * 5,
      high: Math.round(dayHigh / 7.5 / 5) * 5,
      reasoning: 'Hourly rates based on 7.5 hour work day standard.',
      tips: [
        'Track time accurately with time tracking tools',
        'Set minimum billable increments (e.g., 15 minutes)',
        'Communicate time estimates clearly upfront'
      ]
    },
    project: {
      low: Math.round(dayLow * (inputs.scopeDays || 3) / 5) * 5,
      mid: Math.round(dayMid * (inputs.scopeDays || 5) / 5) * 5,
      high: Math.round(dayHigh * (inputs.scopeDays || 7) / 5) * 5,
      reasoning: `Project rates based on ${inputs.scopeDays || '3-7'} day scope estimate.`,
      tips: [
        'Define deliverables clearly in your proposal',
        'Limit number of revision rounds included',
        'Use detailed contracts for larger projects'
      ]
    },
    breakdown: {
      baseRate,
      adjustedRate,
      benchmarkRate,
      factors: {
        experience: { 
          multiplier: experienceMultiplier, 
          description: `${inputs.experience} level (${experienceMultiplier}x)` 
        },
        location: { 
          multiplier: locationMultiplier, 
          description: `${inputs.location} market (${locationMultiplier}x)` 
        },
        complexity: { 
          multiplier: complexityMultiplier, 
          description: `${inputs.complexity} complexity (${complexityMultiplier}x)` 
        },
        usage: { 
          multiplier: usageMultiplier, 
          description: `${inputs.usageRights} usage rights (${usageMultiplier}x)` 
        },
        rush: { 
          multiplier: rushMultiplier, 
          description: inputs.rushJob ? 'Rush job (1.15x)' : 'Standard timeline (1.0x)'
        }
      }
    },
    comparisons: {
      experience: experienceComparisons,
      locations: locationComparisons
    }
  }
}

export const DISCIPLINES = [
  'design', 'photography', 'videography', 'writing', 'marketing', 
  'illustration', 'motion', 'web development', 'ui ux', 'music', 
  'animation', '3d', 'other'
]

export const COUNTRIES = [
  { name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { name: 'United States', currency: 'USD', symbol: '$' },
  { name: 'Canada', currency: 'CAD', symbol: 'C$' },
  { name: 'Australia', currency: 'AUD', symbol: 'A$' },
  { name: 'Germany', currency: 'EUR', symbol: '€' },
  { name: 'Netherlands', currency: 'EUR', symbol: '€' },
  { name: 'Nigeria', currency: 'NGN', symbol: '₦' },
  { name: 'Ghana', currency: 'GHS', symbol: '₵' },
  { name: 'Kenya', currency: 'KES', symbol: 'KSh' },
  { name: 'South Africa', currency: 'ZAR', symbol: 'R' },
  { name: 'India', currency: 'INR', symbol: '₹' },
  { name: 'Brazil', currency: 'BRL', symbol: 'R$' },
  { name: 'United Arab Emirates', currency: 'AED', symbol: 'AED' },
]
