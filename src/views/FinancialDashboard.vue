<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
        <p class="text-gray-600">Revenue, expenses, and profit analysis</p>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- Period Selector -->
        <select
          v-model="selectedPeriod"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          @change="updatePeriod"
        >
          <option value="all">All Time</option>
          <option value="year">Last Year</option>
          <option value="quarter">Last Quarter</option>
          <option value="month">Last Month</option>
        </select>
        
        <!-- Currency Converter -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Convert to:</span>
          <select
            v-model="displayCurrency"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            @change="convertCurrency"
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Financial Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Revenue -->
      <BaseCard>
        <div class="p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <ArrowUpIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ formatCurrency(convertedRevenue, displayCurrency) }}
              </p>
              <p class="text-sm text-green-600">+{{ revenueGrowth }}% vs last period</p>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Total Expenses -->
      <BaseCard>
        <div class="p-6">
          <div class="flex items-center">
            <div class="p-3 bg-red-100 rounded-lg">
              <ArrowDownIcon class="h-6 w-6 text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Expenses</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ formatCurrency(convertedExpenses, displayCurrency) }}
              </p>
              <p class="text-sm text-red-600">+{{ expenseGrowth }}% vs last period</p>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Net Profit -->
      <BaseCard>
        <div class="p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Net Profit</p>
              <p class="text-2xl font-bold" :class="convertedProfit >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(convertedProfit, displayCurrency) }}
              </p>
              <p class="text-sm" :class="profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ profitGrowth >= 0 ? '+' : '' }}{{ profitGrowth }}% vs last period
              </p>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Profit Margin -->
      <BaseCard>
        <div class="p-6">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Profit Margin</p>
              <p class="text-2xl font-bold" :class="profitMargin >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ profitMargin.toFixed(1) }}%
              </p>
              <p class="text-sm text-gray-500">Revenue efficiency</p>
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
                {{ formatCurrency(amount, Currency.USD) }}
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
                {{ formatCurrency(amount, Currency.USD) }}
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
import currencyService from '@/services/currencyService'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const store = useStore()
const selectedPeriod = ref('all')
const displayCurrency = ref<Currency>(Currency.USD)

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
  return currencyService.formatCurrency(amount, currency)
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