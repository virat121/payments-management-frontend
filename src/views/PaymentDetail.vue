<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <router-link
          to="/payments"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeftIcon class="h-5 w-5" />
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Payment #{{ payment?.id.slice(-6) }}
          </h1>
          <p class="text-gray-600">View payment details and history</p>
        </div>
      </div>

      <div v-if="payment" class="flex items-center space-x-3">
        <router-link
          :to="`/payments/${payment.id}/edit`"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <PencilIcon class="h-4 w-4 mr-2" />
          Edit
        </router-link>
        
        <button
          v-if="payment.status === PaymentStatus.COMPLETED"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors duration-200"
          @click="confirmRefund"
        >
          <ArrowUturnLeftIcon class="h-4 w-4 mr-2" />
          Refund
        </button>
        
        <button
          v-if="payment.status === PaymentStatus.PENDING"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
          @click="confirmCancel"
        >
          <XMarkIcon class="h-4 w-4 mr-2" />
          Cancel
        </button>
        
        <button
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
          @click="confirmDelete"
        >
          <TrashIcon class="h-4 w-4 mr-2" />
          Delete
        </button>
      </div>
    </div>

    <div v-if="!payment" class="text-center py-12">
      <div class="text-gray-500">Payment not found</div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Payment Details -->
      <div class="lg:col-span-2 space-y-6">
        <BaseCard>
          <div class="pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-6">Payment Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm font-medium text-gray-500">Amount</label>
                <div class="mt-1 text-2xl font-semibold text-gray-900">
                  ${{ payment.amount.toFixed(2) }} {{ payment.currency }}
                </div>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-500">Status</label>
                <div class="mt-2">
                  <StatusBadge :status="payment.status" />
                </div>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-500">Category</label>
                <div class="mt-1 text-sm text-gray-900">
                  {{ formatCategory(payment.category) }}
                </div>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-500">Payment ID</label>
                <div class="mt-1 text-sm text-gray-900 font-mono">
                  {{ payment.id }}
                </div>
              </div>
            </div>
            
            <div v-if="payment.notes" class="mt-6">
              <label class="text-sm font-medium text-gray-500">Notes</label>
              <div class="mt-1 text-sm text-gray-900 bg-gray-50 rounded-lg p-3">
                {{ payment.notes }}
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Payment Parties -->
        <BaseCard>
          <div class="pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-6">Payment Parties</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="text-center">
                <div class="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span class="text-lg font-semibold text-blue-600">
                    {{ getInitials(getPayerName()) }}
                  </span>
                </div>
                <div class="font-medium text-gray-900">{{ getPayerName() }}</div>
                <div class="text-sm text-gray-500">Payer</div>
              </div>
              
              <div class="flex items-center justify-center md:hidden">
                <ArrowDownIcon class="h-6 w-6 text-gray-400" />
              </div>
              
              <div class="hidden md:flex items-center justify-center">
                <ArrowRightIcon class="h-6 w-6 text-gray-400" />
              </div>
              
              <div class="text-center">
                <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <span class="text-lg font-semibold text-green-600">
                    {{ getInitials(getPayeeName()) }}
                  </span>
                </div>
                <div class="font-medium text-gray-900">{{ getPayeeName() }}</div>
                <div class="text-sm text-gray-500">Payee</div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Payment Timeline -->
      <div>
        <BaseCard>
          <div class="pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-6">Timeline</h3>
            
            <div class="flow-root">
              <ul class="-mb-8">
                <li class="relative pb-8">
                  <div class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div class="h-8 w-8 bg-green-500 rounded-full ring-8 ring-white flex items-center justify-center">
                          <PlusIcon class="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-sm">
                          <span class="font-medium text-gray-900">Payment created</span>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500">
                          {{ formatDateTime(payment.createdAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
                
                <li v-if="payment.updatedAt !== payment.createdAt" class="relative">
                  <div class="relative flex items-start space-x-3">
                    <div>
                      <div class="relative px-1">
                        <div class="h-8 w-8 bg-blue-500 rounded-full ring-8 ring-white flex items-center justify-center">
                          <PencilIcon class="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div>
                        <div class="text-sm">
                          <span class="font-medium text-gray-900">Payment updated</span>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500">
                          {{ formatDateTime(payment.updatedAt) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Confirmation Dialogs -->
    <ConfirmDialog
      :show="showRefundDialog"
      title="Refund Payment"
      message="Are you sure you want to refund this payment? This action will change the status to refunded."
      type="warning"
      confirm-text="Refund"
      @confirm="handleRefund"
      @cancel="cancelRefund"
    />

    <ConfirmDialog
      :show="showCancelDialog"
      title="Cancel Payment"
      message="Are you sure you want to cancel this payment? This action cannot be undone."
      type="warning"
      confirm-text="Cancel Payment"
      @confirm="handleCancel"
      @cancel="cancelCancel"
    />

    <ConfirmDialog
      :show="showDeleteDialog"
      title="Delete Payment"
      message="Are you sure you want to delete this payment? This action cannot be undone."
      type="danger"
      confirm-text="Delete"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PaymentStatus } from '@/types'
import BaseCard from '@/components/BaseCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ArrowUturnLeftIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'

interface Props {
  id: string
}

const props = defineProps<Props>()
const router = useRouter()
const store = useStore()

const showRefundDialog = ref(false)
const showCancelDialog = ref(false)
const showDeleteDialog = ref(false)

const payment = computed(() => store.getters['payments/getPaymentById'](props.id))

function getPayerName() {
  if (!payment.value) return ''
  const user = store.getters['users/getUserById'](payment.value.payerId)
  return user?.name || 'Unknown User'
}

function getPayeeName() {
  if (!payment.value) return ''
  const user = store.getters['users/getUserById'](payment.value.payeeId)
  return user?.name || 'Unknown User'
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatCategory(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function confirmRefund() {
  showRefundDialog.value = true
}

function cancelRefund() {
  showRefundDialog.value = false
}

async function handleRefund() {
  if (payment.value) {
    try {
      await store.dispatch('payments/updatePayment', { id: payment.value.id, paymentData: { status: PaymentStatus.REFUNDED } })
      showRefundDialog.value = false
    } catch (error) {
      console.error('Failed to refund payment:', error)
    }
  }
}

function confirmCancel() {
  showCancelDialog.value = true
}

function cancelCancel() {
  showCancelDialog.value = false
}

async function handleCancel() {
  if (payment.value) {
    try {
      await store.dispatch('payments/updatePayment', { id: payment.value.id, paymentData: { status: PaymentStatus.CANCELLED } })
      showCancelDialog.value = false
    } catch (error) {
      console.error('Failed to cancel payment:', error)
    }
  }
}

function confirmDelete() {
  showDeleteDialog.value = true
}

function cancelDelete() {
  showDeleteDialog.value = false
}

async function handleDelete() {
  if (payment.value) {
    try {
      await store.dispatch('payments/deletePayment', payment.value.id)
      router.push('/payments')
    } catch (error) {
      console.error('Failed to delete payment:', error)
    }
  }
}

onMounted(() => {
  if (!payment.value) {
    router.push('/payments')
  }
})
</script>