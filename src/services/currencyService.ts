import { Currency, CurrencyRate } from '@/types'

class CurrencyService {
  private rates: Map<string, CurrencyRate> = new Map()
  // private readonly API_KEY = 'your-api-key-here' // Replace with actual API key
  private readonly BASE_URL = 'https://api.exchangerate-api.com/v4/latest'

  // Fallback rates (updated periodically)
  private fallbackRates: Record<string, number> = {
    'USD_INR': 83.0,
    'USD_EUR': 0.85,
    'USD_GBP': 0.73,
    'INR_USD': 0.012,
    'INR_EUR': 0.010,
    'INR_GBP': 0.0088,
    'EUR_USD': 1.18,
    'EUR_INR': 97.6,
    'EUR_GBP': 0.86,
    'GBP_USD': 1.37,
    'GBP_INR': 113.7,
    'GBP_EUR': 1.16
  }

  async getExchangeRate(from: Currency, to: Currency): Promise<number> {
    if (from === to) return 1

    const key = `${from}_${to}`
    const cachedRate = this.rates.get(key)

    // Return cached rate if it's less than 1 hour old
    if (cachedRate && this.isRateFresh(cachedRate)) {
      return cachedRate.rate
    }

    try {
      // Try to fetch from API
      const rate = await this.fetchRateFromAPI(from, to)
      this.cacheRate(from, to, rate)
      return rate
    } catch (error) {
      console.warn('Failed to fetch exchange rate from API, using fallback:', error)
      return this.fallbackRates[key] || 1
    }
  }

  private async fetchRateFromAPI(from: Currency, to: Currency): Promise<number> {
    const response = await fetch(`${this.BASE_URL}/${from}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch rates: ${response.statusText}`)
    }

    const data = await response.json()
    return data.rates[to] || 1
  }

  private cacheRate(from: Currency, to: Currency, rate: number): void {
    const key = `${from}_${to}`
    this.rates.set(key, {
      from,
      to,
      rate,
      lastUpdated: new Date().toISOString()
    })
  }

  private isRateFresh(rate: CurrencyRate): boolean {
    const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds
    const lastUpdated = new Date(rate.lastUpdated).getTime()
    return (Date.now() - lastUpdated) < oneHour
  }

  async convertAmount(amount: number, from: Currency, to: Currency): Promise<number> {
    const rate = await this.getExchangeRate(from, to)
    return amount * rate
  }

  formatCurrency(amount: number, currency: Currency): string {
    const formatters: Record<Currency, Intl.NumberFormat> = {
      [Currency.USD]: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      [Currency.INR]: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
      [Currency.EUR]: new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' }),
      [Currency.GBP]: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })
    }

    return formatters[currency].format(amount)
  }

  getCurrencySymbol(currency: Currency): string {
    const symbols: Record<Currency, string> = {
      [Currency.USD]: '$',
      [Currency.INR]: '₹',
      [Currency.EUR]: '€',
      [Currency.GBP]: '£'
    }
    return symbols[currency]
  }

  // Get all available currencies
  getAvailableCurrencies(): Currency[] {
    return Object.values(Currency)
  }

  // Get category direction mapping
  getCategoryDirection(category: string): 'incoming' | 'outgoing' | 'neutral' {
    const incomingCategories = [
      'client_invoice', 'subscription', 'consulting', 'commission', 'licensing'
    ]
    const outgoingCategories = [
      'salary', 'vendor_payment', 'reimbursement', 'office_rent',
      'software_license', 'marketing', 'utilities', 'travel', 'equipment'
    ]
    const neutralCategories = ['transfer', 'refund']

    if (incomingCategories.includes(category)) return 'incoming'
    if (outgoingCategories.includes(category)) return 'outgoing'
    if (neutralCategories.includes(category)) return 'neutral'

    return 'neutral' // Default fallback
  }
}

export const currencyService = new CurrencyService()
export default currencyService

