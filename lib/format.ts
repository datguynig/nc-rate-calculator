import { COUNTRIES } from './rates'

export function formatCurrency(amount: number, currencyCode?: string): string {
  if (!currencyCode) return `£${amount.toLocaleString()}`
  
  const country = COUNTRIES.find(c => c.currency === currencyCode || c.code === currencyCode)
  const symbol = country?.symbol || '£'
  
  return `${symbol}${amount.toLocaleString()}`
}

export function getCurrencySymbol(currencyCode: string): string {
  const country = COUNTRIES.find(c => c.currency === currencyCode || c.code === currencyCode)
  return country?.symbol || '£'
}

export function formatRange(low: number, high: number, currencyCode?: string): string {
  return `${formatCurrency(low, currencyCode)} - ${formatCurrency(high, currencyCode)}`
}

export function capitaliseFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatWorkType(workType: string): string {
  switch (workType) {
    case 'day':
      return 'per day'
    case 'hour':
      return 'per hour'
    case 'project':
      return 'per project'
    default:
      return workType
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function formatDiscipline(discipline: string): string {
  return discipline
    .split(' ')
    .map(word => capitaliseFirst(word))
    .join(' ')
}

export function formatExperience(experience: string): string {
  const formatted = {
    junior: 'Junior',
    mid: 'Mid-level', 
    senior: 'Senior'
  }
  return formatted[experience as keyof typeof formatted] || capitaliseFirst(experience)
}
