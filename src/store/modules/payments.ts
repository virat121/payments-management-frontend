import { Payment, PaymentStatus, PaymentCategory, PaymentFormData, PaymentDirection, Currency, FinancialSummary } from '@/types'
import currencyService from '@/services/currencyService'

interface PaymentState {
  payments: Payment[]
  loading: boolean
  currentPage: number
  itemsPerPage: number
  statusFilter: PaymentStatus | ''
  categoryFilter: PaymentCategory | ''
  directionFilter: PaymentDirection | ''
  currencyFilter: Currency | ''
  dateFromFilter: string
  dateToFilter: string
}

const state: PaymentState = {
  payments: [],
  loading: false,
  currentPage: 1,
  itemsPerPage: 10,
  statusFilter: '',
  categoryFilter: '',
  directionFilter: '',
  currencyFilter: '',
  dateFromFilter: '',
  dateToFilter: ''
}

const getters = {
  filteredPayments: (state: PaymentState) => {
    let filtered = [...state.payments]

    if (state.statusFilter) {
      filtered = filtered.filter(payment => payment.status === state.statusFilter)
    }

    if (state.categoryFilter) {
      filtered = filtered.filter(payment => payment.category === state.categoryFilter)
    }

    if (state.directionFilter) {
      filtered = filtered.filter(payment => payment.direction === state.directionFilter)
    }

    if (state.currencyFilter) {
      filtered = filtered.filter(payment => payment.currency === state.currencyFilter)
    }

    if (state.dateFromFilter) {
      filtered = filtered.filter(payment => new Date(payment.createdAt) >= new Date(state.dateFromFilter))
    }

    if (state.dateToFilter) {
      filtered = filtered.filter(payment => new Date(payment.createdAt) <= new Date(state.dateToFilter))
    }

    return filtered.sort((a, b) => {
      const idA = parseInt(a.id) || 0
      const idB = parseInt(b.id) || 0
      return idB - idA 
    })
  },

  paginatedPayments: (state: PaymentState, getters: any) => {
    const filtered = getters.filteredPayments
    const start = (state.currentPage - 1) * state.itemsPerPage
    const end = start + state.itemsPerPage
    return filtered.slice(start, end)
  },

  totalPages: (state: PaymentState, getters: any) => {
    return Math.ceil(getters.filteredPayments.length / state.itemsPerPage)
  },

  recentPayments: (state: PaymentState) => {
    return state.payments
      .slice()
      .sort((a, b) => {
        const idA = parseInt(a.id) || 0
        const idB = parseInt(b.id) || 0
        return idB - idA 
      })
      .slice(0, 5)
  },

  getPaymentById: (state: PaymentState) => (id: string) => {
    return state.payments.find(payment => payment.id === id)
  },

  paymentsByStatus: (state: PaymentState) => {
    return state.payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1
      return acc
    }, {} as Record<PaymentStatus, number>)
  },

  totalAmount: (state: PaymentState) => {
    return state.payments
      .filter(p => p.status === PaymentStatus.COMPLETED)
      .reduce((sum, payment) => sum + payment.amount, 0)
  },

  // Financial Reporting Getters
  totalRevenue: (state: PaymentState) => {
    return state.payments
      .filter(p => p.status === PaymentStatus.COMPLETED && p.direction === PaymentDirection.INCOMING)
      .reduce((sum, payment) => sum + payment.amount, 0)
  },

  totalExpenses: (state: PaymentState) => {
    return state.payments
      .filter(p => p.status === PaymentStatus.COMPLETED && p.direction === PaymentDirection.OUTGOING)
      .reduce((sum, payment) => sum + payment.amount, 0)
  },

  netProfit: (state: PaymentState, getters: any) => {
    return getters.totalRevenue - getters.totalExpenses
  },

  revenueByCategory: (state: PaymentState) => {
    const revenue = state.payments
      .filter(p => p.status === PaymentStatus.COMPLETED && p.direction === PaymentDirection.INCOMING)
      .reduce((acc, payment) => {
        acc[payment.category] = (acc[payment.category] || 0) + payment.amount
        return acc
      }, {} as Record<PaymentCategory, number>)
    return revenue
  },

  expensesByCategory: (state: PaymentState) => {
    const expenses = state.payments
      .filter(p => p.status === PaymentStatus.COMPLETED && p.direction === PaymentDirection.OUTGOING)
      .reduce((acc, payment) => {
        acc[payment.category] = (acc[payment.category] || 0) + payment.amount
        return acc
      }, {} as Record<PaymentCategory, number>)
    return expenses
  },

  paymentsByCurrency: (state: PaymentState) => {
    return state.payments.reduce((acc, payment) => {
      acc[payment.currency] = (acc[payment.currency] || 0) + 1
      return acc
    }, {} as Record<Currency, number>)
  },

  // Get financial summary for a specific period
  getFinancialSummary: (state: PaymentState, getters: any) => (period: string = 'all'): FinancialSummary => {
    let filteredPayments = state.payments.filter(p => p.status === PaymentStatus.COMPLETED)

    if (period !== 'all') {
      const now = new Date()
      const periodStart = new Date()

      switch (period) {
        case 'month':
          periodStart.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          periodStart.setMonth(now.getMonth() - 3)
          break
        case 'year':
          periodStart.setFullYear(now.getFullYear() - 1)
          break
      }

      filteredPayments = filteredPayments.filter(p => new Date(p.createdAt) >= periodStart)
    }

    const revenue = filteredPayments
      .filter(p => p.direction === PaymentDirection.INCOMING)
      .reduce((sum, payment) => sum + payment.amount, 0)

    const expenses = filteredPayments
      .filter(p => p.direction === PaymentDirection.OUTGOING)
      .reduce((sum, payment) => sum + payment.amount, 0)

    const revenueByCategory = filteredPayments
      .filter(p => p.direction === PaymentDirection.INCOMING)
      .reduce((acc, payment) => {
        acc[payment.category] = (acc[payment.category] || 0) + payment.amount
        return acc
      }, {} as Record<PaymentCategory, number>)

    const expensesByCategory = filteredPayments
      .filter(p => p.direction === PaymentDirection.OUTGOING)
      .reduce((acc, payment) => {
        acc[payment.category] = (acc[payment.category] || 0) + payment.amount
        return acc
      }, {} as Record<PaymentCategory, number>)

    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: revenue - expenses,
      currency: Currency.USD, // Default currency
      period,
      revenueByCategory,
      expensesByCategory
    }
  }
}

const mutations = {
  SET_PAYMENTS(state: PaymentState, payments: Payment[]) {
    state.payments = payments
  },

  SET_LOADING(state: PaymentState, loading: boolean) {
    state.loading = loading
  },

  SET_CURRENT_PAGE(state: PaymentState, page: number) {
    state.currentPage = page
  },

  SET_STATUS_FILTER(state: PaymentState, status: PaymentStatus | '') {
    state.statusFilter = status
    state.currentPage = 1
  },

  SET_CATEGORY_FILTER(state: PaymentState, category: PaymentCategory | '') {
    state.categoryFilter = category
    state.currentPage = 1
  },

  ADD_PAYMENT(state: PaymentState, payment: Payment) {
    state.payments.push(payment)
  },

  UPDATE_PAYMENT(state: PaymentState, updatedPayment: Payment) {
    const index = state.payments.findIndex(payment => payment.id === updatedPayment.id)
    if (index !== -1) {
      state.payments[index] = updatedPayment
    }
  },

  DELETE_PAYMENT(state: PaymentState, paymentId: string) {
    const index = state.payments.findIndex(payment => payment.id === paymentId)
    if (index !== -1) {
      state.payments.splice(index, 1)
    }
  },

  SET_DIRECTION_FILTER(state: PaymentState, direction: PaymentDirection | '') {
    state.directionFilter = direction
    state.currentPage = 1
  },

  SET_CURRENCY_FILTER(state: PaymentState, currency: Currency | '') {
    state.currencyFilter = currency
    state.currentPage = 1
  },

  SET_DATE_FROM_FILTER(state: PaymentState, date: string) {
    state.dateFromFilter = date
    state.currentPage = 1
  },

  SET_DATE_TO_FILTER(state: PaymentState, date: string) {
    state.dateToFilter = date
    state.currentPage = 1
  },

  CLEAR_FILTERS(state: PaymentState) {
    state.statusFilter = ''
    state.categoryFilter = ''
    state.directionFilter = ''
    state.currencyFilter = ''
    state.dateFromFilter = ''
    state.dateToFilter = ''
    state.currentPage = 1
  }
}

const actions = {
  initializeStore({ commit }: any) {
    loadFromStorage({ commit })
    if (state.payments.length === 0) {
      seedInitialData({ commit })
    }
  },

  async createPayment({ commit, state }: any, paymentData: PaymentFormData): Promise<Payment> {
    commit('SET_LOADING', true)

    // Generate sequential ID
    const nextId = Math.max(...state.payments.map((p: Payment) => parseInt(p.id) || 0), 0) + 1
    const now = new Date().toISOString()

    const newPayment: Payment = {
      id: nextId.toString(),
      amount: paymentData.amount!,
      currency: paymentData.currency,
      status: paymentData.status,
      category: paymentData.category,
      direction: paymentData.direction,
      payerId: paymentData.payerId,
      payeeId: paymentData.payeeId,
      notes: paymentData.notes,
      createdAt: now,
      updatedAt: now
    }


    commit('ADD_PAYMENT', newPayment)
    saveToStorage({ state })
    commit('SET_LOADING', false)

    return newPayment
  },

  async updatePayment({ commit }: any, { id, paymentData }: { id: string, paymentData: Partial<PaymentFormData> }): Promise<Payment> {
    commit('SET_LOADING', true)

    const payment = state.payments.find(p => p.id === id)
    if (!payment) {
      throw new Error('Payment not found')
    }

    const updatedPayment: Payment = {
      ...payment,
      ...paymentData,
      updatedAt: new Date().toISOString()
    }

    commit('UPDATE_PAYMENT', updatedPayment)
    saveToStorage({ state })
    commit('SET_LOADING', false)

    return updatedPayment
  },

  async deletePayment({ commit }: any, id: string): Promise<void> {
    commit('SET_LOADING', true)

    const payment = state.payments.find(p => p.id === id)
    if (!payment) {
      throw new Error('Payment not found')
    }

    commit('DELETE_PAYMENT', id)
    saveToStorage({ state })
    commit('SET_LOADING', false)
  },

  setStatusFilter({ commit }: any, status: PaymentStatus | '') {
    commit('SET_STATUS_FILTER', status)
  },

  setCategoryFilter({ commit }: any, category: PaymentCategory | '') {
    commit('SET_CATEGORY_FILTER', category)
  },

  setCurrentPage({ commit }: any, page: number) {
    commit('SET_CURRENT_PAGE', page)
  },

  setDirectionFilter({ commit }: any, direction: PaymentDirection | '') {
    commit('SET_DIRECTION_FILTER', direction)
  },

  setCurrencyFilter({ commit }: any, currency: Currency | '') {
    commit('SET_CURRENCY_FILTER', currency)
  },

  setDateFromFilter({ commit }: any, date: string) {
    commit('SET_DATE_FROM_FILTER', date)
  },

  setDateToFilter({ commit }: any, date: string) {
    commit('SET_DATE_TO_FILTER', date)
  },

  clearFilters({ commit }: any) {
    commit('CLEAR_FILTERS')
  },

  // Currency conversion action
  async convertCurrency({ state }: any, { amount, from, to }: { amount: number, from: Currency, to: Currency }) {
    return await currencyService.convertAmount(amount, from, to)
  }
}

function loadFromStorage({ commit }: any) {
  const stored = localStorage.getItem('payments_data')
  if (stored) {
    const payments = JSON.parse(stored)
    commit('SET_PAYMENTS', payments)
  }
}

function saveToStorage({ state }: any) {
  localStorage.setItem('payments_data', JSON.stringify(state.payments))
}

function seedInitialData({ commit }: any) {
  const initialPayments: Payment[] = [
    {
      id: '1',
      amount: 2500.00,
      currency: Currency.USD,
      status: PaymentStatus.COMPLETED,
      category: PaymentCategory.SALARY,
      direction: PaymentDirection.OUTGOING,
      payerId: '1',
      payeeId: '2',
      notes: 'Monthly salary payment',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      amount: 150.50,
      currency: Currency.USD,
      status: PaymentStatus.PENDING,
      category: PaymentCategory.CLIENT_INVOICE,
      direction: PaymentDirection.INCOMING,
      payerId: '2',
      payeeId: '1',
      notes: 'Invoice #INV-001',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      amount: 75.25,
      currency: Currency.USD,
      status: PaymentStatus.FAILED,
      category: PaymentCategory.REFUND,
      direction: PaymentDirection.NEUTRAL,
      payerId: '1',
      payeeId: '3',
      notes: 'Refund for cancelled order',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      amount: 999.99,
      currency: Currency.USD,
      status: PaymentStatus.COMPLETED,
      category: PaymentCategory.TRANSFER,
      direction: PaymentDirection.NEUTRAL,
      payerId: '3',
      payeeId: '1',
      notes: 'Investment transfer',
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      amount: 29.99,
      currency: Currency.USD,
      status: PaymentStatus.COMPLETED,
      category: PaymentCategory.SUBSCRIPTION,
      direction: PaymentDirection.INCOMING,
      payerId: '2',
      payeeId: '1',
      notes: 'Monthly subscription',
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '6',
      amount: 5000.00,
      currency: Currency.INR,
      status: PaymentStatus.COMPLETED,
      category: PaymentCategory.CONSULTING,
      direction: PaymentDirection.INCOMING,
      payerId: '3',
      payeeId: '1',
      notes: 'Consulting services',
      createdAt: new Date(Date.now() - 518400000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '7',
      amount: 1200.00,
      currency: Currency.USD,
      status: PaymentStatus.COMPLETED,
      category: PaymentCategory.VENDOR_PAYMENT,
      direction: PaymentDirection.OUTGOING,
      payerId: '1',
      payeeId: '2',
      notes: 'Software license payment',
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  commit('SET_PAYMENTS', initialPayments)
  // Save to storage after setting payments
  localStorage.setItem('payments_data', JSON.stringify(initialPayments))
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
