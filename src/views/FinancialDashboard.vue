<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
        <p class="text-gray-600">Revenue, expenses, and profit analysis</p>
      </div>
      
      <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <!-- Period Selector -->
        <Select
          v-model="selectedPeriod"
          :options="periodOptions"
          placeholder="Select period"
          @change="updatePeriod"
          class="w-full sm:w-48"
        />
        
        <!-- Currency Converter -->
        <div class="flex items-center space-x-2 w-full sm:w-auto">
          <span class="text-sm font-medium text-gray-600 whitespace-nowrap">Convert to:</span>
          <Select
            v-model="displayCurrency"
            :options="currencyOptions"
            placeholder="Select currency"
            @change="convertCurrency"
            class="w-full sm:w-32"
          />
        </div>
      </div>
    </div>

    <!-- Financial Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Revenue -->
      <BaseCard variant="elevated" class="overflow-hidden">
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-center flex-1 min-w-0">
              <div class="p-3 bg-gradient-to-br from-success-100 to-success-200 rounded-xl shadow-glow-success">
                <ArrowUpIcon class="h-6 w-6 text-success-600" />
              </div>
              <div class="ml-4 flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-600 mb-1">Total Revenue</p>
                <div class="group relative">
                  <p class="text-sm sm:text-base font-bold text-gray-900 break-words" 
                     :title="currencyService.formatCurrency(convertedRevenue, displayCurrency)">
                    {{ formatCurrency(convertedRevenue, displayCurrency) }}
                  </p>
                  <!-- Full value tooltip on hover -->
                  <div class="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {{ currencyService.formatCurrency(convertedRevenue, displayCurrency) }}
                    <div class="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
                <p class="text-xs text-success-600 font-medium">+{{ revenueGrowth }}% vs last period</p>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Total Expenses -->
      <BaseCard variant="elevated" class="overflow-hidden">
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-center flex-1 min-w-0">
              <div class="p-3 bg-gradient-to-br from-error-100 to-error-200 rounded-xl shadow-glow-error">
                <ArrowDownIcon class="h-6 w-6 text-error-600" />
              </div>
              <div class="ml-4 flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-600 mb-1">Total Expenses</p>
                <div class="group relative">
                  <p class="text-sm sm:text-base font-bold text-gray-900 break-words" 
                     :title="currencyService.formatCurrency(convertedExpenses, displayCurrency)">
                    {{ formatCurrency(convertedExpenses, displayCurrency) }}
                  </p>
                  <!-- Full value tooltip on hover -->
                  <div class="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {{ currencyService.formatCurrency(convertedExpenses, displayCurrency) }}
                    <div class="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
                <p class="text-xs text-error-600 font-medium">+{{ expenseGrowth }}% vs last period</p>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Net Profit -->
      <BaseCard variant="elevated" class="overflow-hidden">
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-center flex-1 min-w-0">
              <div class="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl shadow-glow">
                <CurrencyDollarIcon class="h-6 w-6 text-primary-600" />
              </div>
              <div class="ml-4 flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-600 mb-1">Net Profit</p>
                <div class="group relative">
                  <p class="text-sm sm:text-base font-bold break-words" 
                     :class="convertedProfit >= 0 ? 'text-success-600' : 'text-error-600'"
                     :title="currencyService.formatCurrency(convertedProfit, displayCurrency)">
                    {{ formatCurrency(convertedProfit, displayCurrency) }}
                  </p>
                  <!-- Full value tooltip on hover -->
                  <div class="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {{ currencyService.formatCurrency(convertedProfit, displayCurrency) }}
                    <div class="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
                <p class="text-xs font-medium" :class="profitGrowth >= 0 ? 'text-success-600' : 'text-error-600'">
                  {{ profitGrowth >= 0 ? '+' : '' }}{{ profitGrowth }}% vs last period
                </p>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Profit Margin -->
      <BaseCard variant="elevated" class="overflow-hidden">
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-center flex-1 min-w-0">
              <div class="p-3 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl shadow-glow">
                <ChartBarIcon class="h-6 w-6 text-accent-600" />
              </div>
              <div class="ml-4 flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-600 mb-1">Profit Margin</p>
                <p class="text-lg sm:text-xl font-bold" :class="profitMargin >= 0 ? 'text-success-600' : 'text-error-600'">
                  {{ profitMargin.toFixed(1) }}%
                </p>
                <p class="text-xs text-gray-500 font-medium">Revenue efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue by Category -->
      <BaseCard>
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue by Category</h3>
          <div class="space-y-3">
            <div
              v-for="(amount, category) in financialSummary.revenueByCategory"
              :key="category"
              v-show="amount > 0"
              class="flex items-center justify-between"
            >
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <span class="text-sm font-medium text-gray-700">
                  {{ formatCategory(category) }}
                </span>
              </div>
              <span class="text-sm font-bold text-gray-900">
                {{ formatCurrency(amount, 'USD' as Currency) }}
              </span>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Expenses by Category -->
      <BaseCard>
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Expenses by Category</h3>
          <div class="space-y-3">
            <div
              v-for="(amount, category) in financialSummary.expensesByCategory"
              :key="category"
              v-show="amount > 0"
              class="flex items-center justify-between"
            >
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                <span class="text-sm font-medium text-gray-700">
                  {{ formatCategory(category) }}
                </span>
              </div>
              <span class="text-sm font-bold text-gray-900">
                {{ formatCurrency(amount, 'USD' as Currency) }}
              </span>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Currency Breakdown -->
    <BaseCard>
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Payments by Currency</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(count, currency) in paymentsByCurrency"
            :key="currency"
            class="text-center p-4 bg-gray-50 rounded-lg"
          >
            <div class="text-2xl font-bold text-gray-900">{{ count }}</div>
            <div class="text-sm text-gray-600">{{ currency }} payments</div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Recent High-Value Transactions -->
    <BaseCard>
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Recent High-Value Transactions</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="payment in highValuePayments" :key="payment.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    Payment #{{ payment.id }}
                  </div>
                  <div class="text-sm text-gray-500">{{ payment.notes }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold" :class="payment.direction === 'incoming' ? 'text-green-600' : 'text-red-600'">
                    {{ formatCurrency(payment.amount, payment.currency) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="payment.direction === 'incoming' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ formatCategory(payment.category) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(payment.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Currency } from '@/types'
import BaseCard from '@/components/BaseCard.vue'
import Select from '@/components/Select.vue'
import currencyService from '@/services/currencyService'
import { formatLargeCurrency } from '@/utils/currency'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const store = useStore()
const selectedPeriod = ref('all')
const displayCurrency = ref<Currency>(Currency.USD)

// Options for Select components
const periodOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'year', label: 'Last Year' },
  { value: 'quarter', label: 'Last Quarter' },
  { value: 'month', label: 'Last Month' }
]

const currencyOptions = [
  { value: Currency.USD, label: 'USD - US Dollar' },
  { value: Currency.INR, label: 'INR - Indian Rupee' },
  { value: Currency.EUR, label: 'EUR - Euro' },
  { value: Currency.GBP, label: 'GBP - British Pound' }
]

// Computed properties for financial data
const financialSummary = computed(() => store.getters['payments/getFinancialSummary'](selectedPeriod.value))
const paymentsByCurrency = computed(() => store.getters['payments/paymentsByCurrency'])

// Converted amounts for display
const convertedRevenue = ref(0)
const convertedExpenses = ref(0)
const convertedProfit = ref(0)

// Growth calculations (simplified - in real app, compare with previous period)
const revenueGrowth = computed(() => 15.2) // Mock data
const expenseGrowth = computed(() => 8.7) // Mock data
const profitGrowth = computed(() => 22.5) // Mock data

const profitMargin = computed(() => {
  if (convertedRevenue.value === 0) return 0
  return (convertedProfit.value / convertedRevenue.value) * 100
})

// High-value transactions (amount > $1000)
const highValuePayments = computed(() => {
  return store.getters['payments/filteredPayments']
    .filter((p: any) => p.amount > 1000)
    .slice(0, 10)
})

// Helper functions
function formatCurrency(amount: number, currency: Currency): string {
  return formatLargeCurrency(amount, currency)
}

function formatCategory(category: string): string {
  return category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

async function convertCurrency() {
  const revenue = financialSummary.value.totalRevenue
  const expenses = financialSummary.value.totalExpenses
  
  convertedRevenue.value = await currencyService.convertAmount(revenue, Currency.USD, displayCurrency.value)
  convertedExpenses.value = await currencyService.convertAmount(expenses, Currency.USD, displayCurrency.value)
  convertedProfit.value = convertedRevenue.value - convertedExpenses.value
}

function updatePeriod() {
  // Period change will automatically update the financial summary
  convertCurrency()
}

onMounted(() => {
  convertCurrency()
})
</script>