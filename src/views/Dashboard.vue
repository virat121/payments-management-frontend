<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-large">
      <div class="flex items-center justify-between">
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold mb-2">Welcome back, Admin!</h1>
          <p class="text-primary-100 text-sm sm:text-base lg:text-lg">Here's what's happening with your payments today.</p>
        </div>
        <div class="hidden sm:block ml-4 flex-shrink-0">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <ChartBarIcon class="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <BaseCard variant="elevated" class="group hover:scale-105 transition-transform duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow-primary">
              <UsersIcon class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div class="ml-3 sm:ml-4 w-0 flex-1 min-w-0">
            <dl>
              <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Users</dt>
              <dd class="text-xl sm:text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</dd>
              <dd class="text-xs text-success-600 font-medium hidden sm:block">+12% from last month</dd>
            </dl>
          </div>
        </div>
      </BaseCard>

      <BaseCard variant="elevated" class="group hover:scale-105 transition-transform duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-glow-success group-hover:shadow-glow-success">
              <CreditCardIcon class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div class="ml-3 sm:ml-4 w-0 flex-1 min-w-0">
            <dl>
              <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Payments</dt>
              <dd class="text-xl sm:text-2xl font-bold text-gray-900">{{ stats.totalPayments }}</dd>
              <dd class="text-xs text-success-600 font-medium hidden sm:block">+8% from last month</dd>
            </dl>
          </div>
        </div>
      </BaseCard>

      <BaseCard variant="elevated" class="group hover:scale-105 transition-transform duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-glow-warning group-hover:shadow-glow-warning">
              <ClockIcon class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div class="ml-3 sm:ml-4 w-0 flex-1 min-w-0">
            <dl>
              <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">Pending</dt>
              <dd class="text-xl sm:text-2xl font-bold text-gray-900">{{ stats.pendingPayments }}</dd>
              <dd class="text-xs text-warning-600 font-medium hidden sm:block">Needs attention</dd>
            </dl>
          </div>
        </div>
      </BaseCard>

      <BaseCard variant="elevated" class="group hover:scale-105 transition-transform duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow">
              <CurrencyDollarIcon class="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div class="ml-3 sm:ml-4 w-0 flex-1 min-w-0">
            <dl>
              <dt class="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Amount</dt>
              <dd class="text-xl sm:text-2xl font-bold text-gray-900">
                {{ formatLargeCurrency(stats.totalAmount, 'USD' as any) }}
              </dd>
              <dd class="text-xs text-success-600 font-medium hidden sm:block">+15% from last month</dd>
            </dl>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Payment Status Chart -->
    <BaseCard variant="elevated" class="overflow-hidden">
      <div class="p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900">Payment Status Overview</h3>
          <div class="w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 rounded-lg flex items-center justify-center">
            <ChartBarIcon class="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
          </div>
        </div>
        <div class="h-64 sm:h-80">
          <canvas ref="statusChartRef"></canvas>
        </div>
      </div>
    </BaseCard>

    <!-- Recent Payments -->
    <BaseCard variant="elevated" class="overflow-hidden">
      <div class="p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4 sm:mb-6">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900">Recent Payments</h3>
          <router-link
            to="/payments"
            class="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all duration-200"
          >
            View all
            <ArrowRightIcon class="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </router-link>
        </div>
        
        <div class="space-y-3 sm:space-y-4">
          <div
            v-for="payment in recentPayments"
            :key="payment.id"
            class="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
          >
            <!-- Mobile Layout: Stacked -->
            <div class="sm:hidden space-y-2">
              <!-- Top Row: Amount and Status -->
              <div class="flex items-center justify-between">
                <div class="text-base font-bold text-gray-900">
                  {{ formatCurrencyAmount(payment.amount, payment.currency) }}
                </div>
                <StatusBadge :status="payment.status" />
              </div>
              
              <!-- Middle Row: Participants -->
              <div class="text-xs text-gray-600">
                {{ getUserName(payment.payerId) }} → {{ getUserName(payment.payeeId) }}
              </div>
              
              <!-- Bottom Row: Date and Time -->
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ formatDate(payment.createdAt) }}</span>
                <span class="flex items-center">
                  <ClockIcon class="w-3 h-3 mr-1" />
                  {{ formatTime(payment.createdAt) }}
                </span>
              </div>
            </div>

            <!-- Desktop Layout: Side by Side -->
            <div class="hidden sm:flex items-center justify-between">
              <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <div class="text-lg font-bold text-gray-900">
                      {{ formatCurrencyAmount(payment.amount, payment.currency) }}
                    </div>
                  <StatusBadge :status="payment.status" />
                </div>
                <div class="text-sm text-gray-600 truncate">
                  {{ getUserName(payment.payerId) }} → {{ getUserName(payment.payeeId) }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ payment.category.replace('_', ' ').toUpperCase() }}
                </div>
              </div>
              <div class="text-right flex-shrink-0 ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatDate(payment.createdAt) }}
                </div>
                <div class="text-xs text-gray-500 flex items-center justify-end">
                  <ClockIcon class="w-3 h-3 mr-1" />
                  {{ formatTime(payment.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="recentPayments.length === 0" class="text-center py-8 sm:py-12">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <CreditCardIcon class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <div class="text-gray-500 font-medium text-sm sm:text-base">No recent payments</div>
          <div class="text-xs sm:text-sm text-gray-400 mt-1">Payments will appear here once created</div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useStore } from 'vuex'
import { PaymentStatus } from '@/types'
import BaseCard from '@/components/BaseCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { formatCurrencyAmount, formatLargeCurrency } from '@/utils/currency'
import {
  UsersIcon,
  CreditCardIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

Chart.register(...registerables)

const store = useStore()
const statusChartRef = ref<HTMLCanvasElement>()

const stats = computed(() => ({
  totalUsers: store.state.users.users.length,
  totalPayments: store.state.payments.payments.length,
  pendingPayments: store.getters['payments/paymentsByStatus'][PaymentStatus.PENDING] || 0,
  completedPayments: store.getters['payments/paymentsByStatus'][PaymentStatus.COMPLETED] || 0,
  failedPayments: store.getters['payments/paymentsByStatus'][PaymentStatus.FAILED] || 0,
  totalAmount: store.getters['payments/totalAmount']
}))


const recentPayments = computed(() => store.getters['payments/recentPayments'])

function getUserName(userId: string) {
  const user = store.getters['users/getUserById'](userId)
  return user?.name || 'Unknown User'
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  if (statusChartRef.value) {
    const ctx = statusChartRef.value.getContext('2d')
    
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Pending', 'Failed', 'Refunded', 'Cancelled'],
          datasets: [{
            data: [
              stats.value.completedPayments,
              stats.value.pendingPayments,
              stats.value.failedPayments,
              store.getters['payments/paymentsByStatus'][PaymentStatus.REFUNDED] || 0,
              store.getters['payments/paymentsByStatus'][PaymentStatus.CANCELLED] || 0
            ],
            backgroundColor: [
              '#22c55e', // success-500
              '#f59e0b', // warning-500
              '#ef4444', // error-500
              '#a855f7', // accent-500
              '#64748b'  // gray-500
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            }
          }
        }
      })
    }
  }
})
</script>