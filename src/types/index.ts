export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  amount: number
  currency: Currency
  status: PaymentStatus
  category: PaymentCategory
  direction: PaymentDirection
  payerId: string
  payeeId: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export enum PaymentCategory {
  // INCOMING (Revenue)
  CLIENT_INVOICE = 'client_invoice',
  SUBSCRIPTION = 'subscription',
  CONSULTING = 'consulting',
  COMMISSION = 'commission',
  LICENSING = 'licensing',

  // OUTGOING (Expenses)
  SALARY = 'salary',
  VENDOR_PAYMENT = 'vendor_payment',
  REIMBURSEMENT = 'reimbursement',
  OFFICE_RENT = 'office_rent',
  SOFTWARE_LICENSE = 'software_license',
  MARKETING = 'marketing',
  UTILITIES = 'utilities',
  TRAVEL = 'travel',
  EQUIPMENT = 'equipment',

  // NEUTRAL
  TRANSFER = 'transfer',
  REFUND = 'refund'
}

export enum PaymentDirection {
  INCOMING = 'incoming',  // Revenue
  OUTGOING = 'outgoing',  // Expenses
  NEUTRAL = 'neutral'     // Transfers, Refunds
}

export enum Currency {
  USD = 'USD',
  INR = 'INR',
  EUR = 'EUR',
  GBP = 'GBP'
}

export interface PaymentFormData {
  amount: number | null
  currency: Currency
  status: PaymentStatus
  category: PaymentCategory
  direction: PaymentDirection
  payerId: string
  payeeId: string
  notes: string
}

export interface UserFormData {
  name: string
  email: string
  role: UserRole
  active: boolean
}

export interface DashboardStats {
  totalUsers: number
  totalPayments: number
  pendingPayments: number
  completedPayments: number
  failedPayments: number
  totalAmount: number
}

export interface CurrencyRate {
  from: Currency
  to: Currency
  rate: number
  lastUpdated: string
}

export interface FinancialSummary {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  currency: Currency
  period: string
  revenueByCategory: Record<PaymentCategory, number>
  expensesByCategory: Record<PaymentCategory, number>
}

export interface PaymentFilters {
  status?: PaymentStatus
  category?: PaymentCategory
  direction?: PaymentDirection
  currency?: Currency
  dateFrom?: string
  dateTo?: string
}