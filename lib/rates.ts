export interface CalculatorInputs {
  discipline: string
  experience: 'junior' | 'mid' | 'senior'
  location: string
  currency: string
  workType: 'day' | 'hour' | 'project'
  annualIncomeTarget?: number
  billableDays?: number
  billableHoursPerDay?: number
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
  'Canada': 1.05,
  'Australia': 1.05,
  'Germany': 1.0,
  'Netherlands': 1.05,
  'France': 1.0,
  'Spain': 0.95,
  'Italy': 0.95,
  'Ireland': 1.05,
  'Sweden': 1.1,
  'Norway': 1.15,
  'Denmark': 1.1,
  'Finland': 1.05,
  'Switzerland': 1.2,
  'Austria': 1.0,
  'Belgium': 1.0,
  'Portugal': 0.9,
  'Poland': 0.8,
  'Czechia': 0.8,
  'Hungary': 0.75,
  'Romania': 0.7,
  'Nigeria': 0.6,
  'Ghana': 0.55,
  'Kenya': 0.6,
  'South Africa': 0.7,
  'India': 0.55,
  'Brazil': 0.65,
  'United Arab Emirates': 1.05,
  'Saudi Arabia': 1.05,
  'Qatar': 1.05,
  'Egypt': 0.6,
  'Morocco': 0.6,
  'Turkey': 0.75,
  'Mexico': 0.7,
  'Argentina': 0.65,
  'Chile': 0.75,
  'Colombia': 0.65,
  'Japan': 1.1,
  'South Korea': 1.05,
  'China': 0.9,
  'Singapore': 1.15,
  'Hong Kong': 1.15,
  'New Zealand': 1.0,
  'Israel': 1.05,
  'Indonesia': 0.6,
  'Philippines': 0.55,
  'Vietnam': 0.6,
  'Thailand': 0.65,
  'Malaysia': 0.7,
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
  const roundToNearestFive = (value: number) => Math.round(value / 5) * 5

  const baseRate = DISCIPLINE_BASELINES[inputs.discipline] || 300
  const experienceMultiplier = EXPERIENCE_MULTIPLIERS[inputs.experience]
  const locationMultiplier = LOCATION_MULTIPLIERS[inputs.location] || 1.0
  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[inputs.complexity]
  const usageMultiplier = USAGE_MULTIPLIERS[inputs.usageRights]
  const rushMultiplier = inputs.rushJob ? 1.15 : 1.0
  
  const marketBaseline = roundToNearestFive(baseRate * experienceMultiplier * locationMultiplier)
  const effectiveBillableDays = inputs.billableDays && inputs.billableDays > 0 ? inputs.billableDays : undefined
  const targetBaseline = inputs.annualIncomeTarget && effectiveBillableDays
    ? roundToNearestFive(inputs.annualIncomeTarget / effectiveBillableDays)
    : undefined
  const targetWeight = inputs.annualIncomeTarget && effectiveBillableDays ? 0.6 : 0
  const marketWeight = 1 - targetWeight
  const blendedBaseline = roundToNearestFive(
    (marketBaseline * marketWeight) + ((targetBaseline || 0) * targetWeight)
  ) || marketBaseline
  
  const adjustedRate = roundToNearestFive(blendedBaseline * complexityMultiplier * usageMultiplier * rushMultiplier)
  
  let lowSpread = 0.85
  let highSpread = 1.15
  if (inputs.experience === 'junior') {
    lowSpread = 0.9
    highSpread = 1.1
  } else if (inputs.experience === 'senior') {
    lowSpread = 0.85
    highSpread = 1.2
  }
  if (inputs.rushJob) {
    highSpread += 0.03
  }
  
  const dayMid = adjustedRate
  const dayLow = roundToNearestFive(dayMid * lowSpread)
  const dayHigh = roundToNearestFive(dayMid * highSpread)
  
  // Experience comparisons
  const experienceComparisons = [
    { level: 'Junior (0-2 years)', rate: Math.round(baseRate * 0.8 * locationMultiplier / 5) * 5 },
    { level: 'Mid-level (3-5 years)', rate: Math.round(baseRate * 1.0 * locationMultiplier / 5) * 5 },
    { level: 'Senior (6+ years)', rate: Math.round(baseRate * 1.3 * locationMultiplier / 5) * 5 },
  ]
  
  const comparisonCountries = ['United States', 'Netherlands', 'Australia', 'Canada', 'United Kingdom']
  if (!comparisonCountries.includes(inputs.location)) {
    comparisonCountries.push(inputs.location)
  }
  const locationComparisons = comparisonCountries
    .map(country => {
      const lm = LOCATION_MULTIPLIERS[country] || 1.0
      return { country, rate: roundToNearestFive(baseRate * experienceMultiplier * lm) }
    })
    .sort((a, b) => b.rate - a.rate)

  return {
    day: {
      low: dayLow,
      mid: dayMid,
      high: dayHigh,
      reasoning: (() => {
        const reasons: string[] = []
        if (targetBaseline) {
          reasons.push(
            `Blended your target day rate of ${targetBaseline.toLocaleString()} (from ${(inputs.annualIncomeTarget as number).toLocaleString()} across ${effectiveBillableDays} billable days)`
          )
          reasons.push(`with ${inputs.experience} ${inputs.discipline} market rates in ${inputs.location}.`)
        } else {
          reasons.push(`Based on ${inputs.experience} ${inputs.discipline} market rates in ${inputs.location}.`)
        }
        const factors: string[] = []
        factors.push(`${inputs.complexity} complexity`)
        factors.push(`${inputs.usageRights} usage rights`)
        if (inputs.rushJob) factors.push('rush timeline')
        reasons.push(`Adjusted for ${factors.join(', ')}.`)
        return reasons.join(' ')
      })(),
      tips: (() => {
        const t: string[] = []
        t.push('Set clear scope boundaries to prevent scope creep')
        t.push('Request 25-50% deposit before starting work')
        if (inputs.usageRights === 'extended') {
          t.push('Detail licensing terms for extended usage in your contract')
        }
        if (inputs.rushJob) {
          t.push('Include a visible rush fee line item in your proposal')
        }
        if (inputs.annualIncomeTarget && effectiveBillableDays) {
          t.push('Revisit billable days and buffer for holidays and admin time')
        }
        t.push('Review and adjust rates every 6–12 months based on results')
        return t
      })()
    },
    hour: {
      low: roundToNearestFive(dayLow / (inputs.billableHoursPerDay || 7.5)),
      mid: roundToNearestFive(dayMid / (inputs.billableHoursPerDay || 7.5)),
      high: roundToNearestFive(dayHigh / (inputs.billableHoursPerDay || 7.5)),
      reasoning: 'Hourly rates derived from a 7.5-hour working day baseline.',
      tips: [
        'Track time accurately with time tracking tools',
        'Set minimum billable increments (e.g., 15 minutes)',
        'Communicate time estimates clearly upfront'
      ]
    },
    project: {
      low: roundToNearestFive(dayLow * (inputs.scopeDays || 3)),
      mid: roundToNearestFive(dayMid * (inputs.scopeDays || 5)),
      high: roundToNearestFive(dayHigh * (inputs.scopeDays || 7)),
      reasoning: `Project rates based on a ${inputs.scopeDays || '3–7'} day scope estimate and your adjusted day rate.`,
      tips: [
        'Define deliverables clearly in your proposal',
        'Limit number of revision rounds included',
        'Use detailed contracts for larger projects'
      ]
    },
    breakdown: {
      baseRate,
      adjustedRate,
      benchmarkRate: marketBaseline,
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
  { name: 'France', currency: 'EUR', symbol: '€' },
  { name: 'Spain', currency: 'EUR', symbol: '€' },
  { name: 'Italy', currency: 'EUR', symbol: '€' },
  { name: 'Ireland', currency: 'EUR', symbol: '€' },
  { name: 'Sweden', currency: 'SEK', symbol: 'kr' },
  { name: 'Norway', currency: 'NOK', symbol: 'kr' },
  { name: 'Denmark', currency: 'DKK', symbol: 'kr' },
  { name: 'Finland', currency: 'EUR', symbol: '€' },
  { name: 'Switzerland', currency: 'CHF', symbol: 'CHF' },
  { name: 'Austria', currency: 'EUR', symbol: '€' },
  { name: 'Belgium', currency: 'EUR', symbol: '€' },
  { name: 'Portugal', currency: 'EUR', symbol: '€' },
  { name: 'Poland', currency: 'PLN', symbol: 'zł' },
  { name: 'Czechia', currency: 'CZK', symbol: 'Kč' },
  { name: 'Hungary', currency: 'HUF', symbol: 'Ft' },
  { name: 'Romania', currency: 'RON', symbol: 'lei' },
  { name: 'Nigeria', currency: 'NGN', symbol: '₦' },
  { name: 'Ghana', currency: 'GHS', symbol: '₵' },
  { name: 'Kenya', currency: 'KES', symbol: 'KSh' },
  { name: 'South Africa', currency: 'ZAR', symbol: 'R' },
  { name: 'India', currency: 'INR', symbol: '₹' },
  { name: 'Brazil', currency: 'BRL', symbol: 'R$' },
  { name: 'United Arab Emirates', currency: 'AED', symbol: 'AED' },
  { name: 'Saudi Arabia', currency: 'SAR', symbol: 'SAR' },
  { name: 'Qatar', currency: 'QAR', symbol: 'QAR' },
  { name: 'Egypt', currency: 'EGP', symbol: 'E£' },
  { name: 'Morocco', currency: 'MAD', symbol: 'MAD' },
  { name: 'Turkey', currency: 'TRY', symbol: '₺' },
  { name: 'Mexico', currency: 'MXN', symbol: '$' },
  { name: 'Argentina', currency: 'ARS', symbol: '$' },
  { name: 'Chile', currency: 'CLP', symbol: '$' },
  { name: 'Colombia', currency: 'COP', symbol: '$' },
  { name: 'Japan', currency: 'JPY', symbol: '¥' },
  { name: 'South Korea', currency: 'KRW', symbol: '₩' },
  { name: 'China', currency: 'CNY', symbol: '¥' },
  { name: 'Singapore', currency: 'SGD', symbol: 'S$' },
  { name: 'Hong Kong', currency: 'HKD', symbol: 'HK$' },
  { name: 'New Zealand', currency: 'NZD', symbol: 'NZ$' },
  { name: 'Israel', currency: 'ILS', symbol: '₪' },
  { name: 'Indonesia', currency: 'IDR', symbol: 'Rp' },
  { name: 'Philippines', currency: 'PHP', symbol: '₱' },
  { name: 'Vietnam', currency: 'VND', symbol: '₫' },
  { name: 'Thailand', currency: 'THB', symbol: '฿' },
  { name: 'Malaysia', currency: 'MYR', symbol: 'RM' },
]
