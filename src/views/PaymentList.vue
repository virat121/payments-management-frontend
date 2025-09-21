<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Payments</h1>
        <p class="text-gray-600">Track and manage all payment transactions</p>
      </div>
      <router-link
        to="/payments/new"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Payment
      </router-link>
    </div>

    <!-- Filters -->
    <BaseCard>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          :model-value="store.state.payments.statusFilter"
          placeholder="Filter by status"
          :options="statusOptions"
          @update:model-value="(value: any) => store.dispatch('payments/setStatusFilter', value)"
        />

        <Select
          :model-value="store.state.payments.categoryFilter"
          placeholder="Filter by category"
          :options="categoryOptions"
          @update:model-value="(value: any) => store.dispatch('payments/setCategoryFilter', value)"
        />

        <Select
          :model-value="store.state.payments.directionFilter"
          placeholder="Filter by direction"
          :options="directionOptions"
          @update:model-value="(value: any) => store.dispatch('payments/setDirectionFilter', value)"
        />

        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          @click="store.dispatch('payments/clearFilters')"
        >
          Clear Filters
        </button>
      </div>
    </BaseCard>

    <!-- Payments Table -->
    <BaseTable
      :columns="columns"
      :data="store.getters['payments/paginatedPayments']"
    >
      <template #cell-id="{ item }">
        <router-link
          :to="`/payments/${item.id}`"
          class="text-primary-600 hover:text-primary-500 font-medium"
        >
          #{{ item.id }}
        </router-link>
      </template>

      <template #cell-amount="{ item }">
        <div class="text-sm font-medium text-gray-900">
          {{ formatCurrencyWithCode(item.amount, item.currency) }}
        </div>
      </template>

      <template #cell-status="{ item }">
        <StatusBadge :status="item.status" />
      </template>

      <template #cell-category="{ item }">
        <span class="text-sm text-gray-600">{{ formatCategory(item.category) }}</span>
      </template>

      <template #cell-direction="{ item }">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getDirectionClass(item.direction)">
          {{ formatDirection(item.direction) }}
        </span>
      </template>

      <template #cell-payer="{ item }">
        <div class="text-sm">
          <div class="font-medium text-gray-900">{{ getUserName(item.payerId) }}</div>
          <div class="text-gray-500">→ {{ getUserName(item.payeeId) }}</div>
        </div>
      </template>

      <template #cell-createdAt="{ item }">
        <div class="text-sm text-gray-500">
          {{ formatDateTime(item.createdAt) }}
        </div>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex items-center space-x-2">
          <router-link
            :to="`/payments/${item.id}`"
            class="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          >
            <EyeIcon class="h-4 w-4" />
          </router-link>
          <router-link
            :to="`/payments/${item.id}/edit`"
            class="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          >
            <PencilIcon class="h-4 w-4" />
          </router-link>
          <button
            class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            @click="confirmDelete(item)"
          >
            <TrashIcon class="h-4 w-4" />
          </button>
        </div>
      </template>

      <template #empty>
        <div class="text-center py-8">
          <CreditCardIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by creating a new payment.
          </p>
        </div>
      </template>
    </BaseTable>

    <!-- Pagination -->
    <Pagination
      :current-page="store.state.payments.currentPage"
      :total-pages="store.getters['payments/totalPages']"
      :total="store.getters['payments/filteredPayments'].length"
      :items-per-page="store.state.payments.itemsPerPage"
      @page-change="(page: any) => store.dispatch('payments/setCurrentPage', page)"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :show="showDeleteDialog"
      :title="`Delete Payment #${paymentToDelete?.id.slice(-6)}`"
      message="Are you sure you want to delete this payment? This action cannot be undone."
      type="danger"
      confirm-text="Delete"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { PaymentStatus, PaymentCategory, PaymentDirection, type Payment } from '@/types'
import BaseCard from '@/components/BaseCard.vue'
import BaseTable from '@/components/BaseTable.vue'
import Select from '@/components/Select.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import Pagination from '@/components/Pagination.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { formatCurrencyWithCode } from '@/utils/currency'
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline'

const store = useStore()
const showDeleteDialog = ref(false)
const paymentToDelete = ref<Payment | null>(null)

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'direction', label: 'Direction', sortable: true },
  { key: 'payer', label: 'Payer → Payee', sortable: false },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
]

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: PaymentStatus.PENDING, label: 'Pending' },
  { value: PaymentStatus.COMPLETED, label: 'Completed' },
  { value: PaymentStatus.FAILED, label: 'Failed' },
  { value: PaymentStatus.REFUNDED, label: 'Refunded' },
  { value: PaymentStatus.CANCELLED, label: 'Cancelled' }
]

const directionOptions = [
  { value: '', label: 'All Directions' },
  { value: PaymentDirection.INCOMING, label: 'Incoming (Revenue)' },
  { value: PaymentDirection.OUTGOING, label: 'Outgoing (Expense)' },
  { value: PaymentDirection.NEUTRAL, label: 'Neutral (Transfer/Refund)' }
]

const categoryOptions = [
  { value: '', label: 'All Categories' },
  // Incoming categories
  { value: PaymentCategory.CLIENT_INVOICE, label: 'Client Invoice' },
  { value: PaymentCategory.SUBSCRIPTION, label: 'Subscription' },
  { value: PaymentCategory.CONSULTING, label: 'Consulting' },
  { value: PaymentCategory.COMMISSION, label: 'Commission' },
  { value: PaymentCategory.LICENSING, label: 'Licensing' },
  // Outgoing categories
  { value: PaymentCategory.SALARY, label: 'Salary' },
  { value: PaymentCategory.VENDOR_PAYMENT, label: 'Vendor Payment' },
  { value: PaymentCategory.REIMBURSEMENT, label: 'Reimbursement' },
  { value: PaymentCategory.OFFICE_RENT, label: 'Office Rent' },
  { value: PaymentCategory.SOFTWARE_LICENSE, label: 'Software License' },
  { value: PaymentCategory.MARKETING, label: 'Marketing' },
  { value: PaymentCategory.UTILITIES, label: 'Utilities' },
  { value: PaymentCategory.TRAVEL, label: 'Travel' },
  { value: PaymentCategory.EQUIPMENT, label: 'Equipment' },
  // Neutral categories
  { value: PaymentCategory.TRANSFER, label: 'Transfer' },
  { value: PaymentCategory.REFUND, label: 'Refund' }
]

function formatCategory(category: PaymentCategory) {
  if (!category) return ''
  return category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
}

function formatDirection(direction: PaymentDirection) {
  if (!direction) return ''
  return direction.charAt(0).toUpperCase() + direction.slice(1)
}

function getDirectionClass(direction: PaymentDirection) {
  switch (direction) {
    case PaymentDirection.INCOMING:
      return 'bg-green-100 text-green-800'
    case PaymentDirection.OUTGOING:
      return 'bg-red-100 text-red-800'
    case PaymentDirection.NEUTRAL:
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getUserName(userId: string) {
  const user = store.getters['users/getUserById'](userId)
  return user?.name || 'Unknown User'
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function confirmDelete(payment: Payment) {
  paymentToDelete.value = payment
  showDeleteDialog.value = true
}

function cancelDelete() {
  paymentToDelete.value = null
  showDeleteDialog.value = false
}

async function handleDelete() {
  if (paymentToDelete.value) {
    try {
      await store.dispatch('payments/deletePayment', paymentToDelete.value.id)
      showDeleteDialog.value = false
      paymentToDelete.value = null
    } catch (error) {
      console.error('Failed to delete payment:', error)
    }
  }
}
</script>