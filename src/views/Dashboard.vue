<template>
  <div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <BaseCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UsersIcon class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
              <dd class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</dd>
            </dl>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CreditCardIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Payments</dt>
              <dd class="text-2xl font-semibold text-gray-900">{{ stats.totalPayments }}</dd>
            </dl>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ClockIcon class="h-8 w-8 text-yellow-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Pending</dt>
              <dd class="text-2xl font-semibold text-gray-900">{{ stats.pendingPayments }}</dd>
            </dl>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CurrencyDollarIcon class="h-8 w-8 text-purple-600" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Amount</dt>
              <dd class="text-2xl font-semibold text-gray-900">
                ${{ stats.totalAmount.toLocaleString() }}
              </dd>
            </dl>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Charts and Recent Payments -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Payment Status Chart -->
      <BaseCard>
        <div class="pb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Payment Status Overview</h3>
          <div class="h-64">
            <canvas ref="statusChartRef"></canvas>
          </div>
        </div>
      </BaseCard>

      <!-- Recent Payments -->
      <BaseCard>
        <div class="pb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Recent Payments</h3>
            <router-link
              to="/payments"
              class="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              View all
            </router-link>
          </div>
          
          <div class="space-y-3">
            <div
              v-for="payment in recentPayments"
              :key="payment.id"
              class="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
            >
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <div class="text-sm font-medium text-gray-900">
                    ${{ payment.amount.toFixed(2) }}
                  </div>
                  <StatusBadge :status="payment.status" />
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  {{ getUserName(payment.payerId) }} → {{ getUserName(payment.payeeId) }}
                </div>
              </div>
              <div class="text-sm text-gray-500">
                {{ formatDate(payment.createdAt) }}
              </div>
            </div>
          </div>

          <div v-if="recentPayments.length === 0" class="text-center py-8">
            <div class="text-gray-500">No recent payments</div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useStore } from 'vuex'
import { PaymentStatus } from '@/types'
import BaseCard from '@/components/BaseCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import {
  UsersIcon,
  CreditCardIcon,
  ClockIcon,
  CurrencyDollarIcon
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
              '#10B981', // green
              '#F59E0B', // yellow
              '#EF4444', // red
              '#3B82F6', // blue
              '#6B7280'  // gray
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