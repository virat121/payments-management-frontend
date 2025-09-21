import { Currency } from '@/types'

/**
 * Get the appropriate currency symbol for a given currency
 */
export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case Currency.USD:
      return '$'
    case Currency.EUR:
      return '€'
    case Currency.GBP:
      return '£'
    case Currency.INR:
      return '₹'
    default:
      return '$'
  }
}

/**
 * Format a currency amount with the appropriate symbol
 */
export function formatCurrencyAmount(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${amount.toFixed(2)}`
}

/**
 * Format a currency amount with symbol and currency code
 */
export function formatCurrencyWithCode(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${amount.toFixed(2)} ${currency}`
}

/**
 * Smart number formatting for large amounts (K, M, B suffixes)
 */
export function formatLargeCurrency(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency)
  
  const formatLargeNumber = (num: number): string => {
    const absNum = Math.abs(num)
    
    if (absNum >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B'
    } else if (absNum >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M'
    } else if (absNum >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K'
    } else if (absNum >= 1) {
      return num.toFixed(0)
    } else {
      return num.toFixed(2)
    }
  }

  const formattedAmount = formatLargeNumber(amount)
  return `${symbol}${formattedAmount}`
}
