<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center space-x-4 mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-glow">
          <CreditCardIcon class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
            {{ isEditing ? 'Edit Payment' : 'Create Payment' }}
          </h1>
          <p class="text-gray-600 mt-1">
            {{ isEditing ? 'Update payment information' : 'Add a new payment to the system' }}
          </p>
        </div>
      </div>
    </div>

    <BaseCard variant="elevated" class="overflow-hidden">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Payment Details Section -->
        <div class="space-y-6">
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <CurrencyDollarIcon class="w-5 h-5 mr-2 text-primary-600" />
              Payment Details
            </h3>
            <p class="text-sm text-gray-500 mt-1">Enter the basic payment information</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TextInput
              v-model="form.amount"
              label="Amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
              :error="errors.amount"
              helper-text="Enter the payment amount"
            />

            <Select
              v-model="form.currency"
              label="Currency"
              :options="currencyOptions"
              placeholder="Select currency"
              required
              :error="errors.currency"
              helper-text="Choose the payment currency"
            />

            <Select
              v-model="form.status"
              label="Status"
              :options="statusOptions"
              placeholder="Select status"
              required
              :error="errors.status"
              helper-text="Current payment status"
            />

            <Select
              v-model="form.direction"
              label="Direction"
              :options="directionOptions"
              placeholder="Select direction"
              required
              :error="errors.direction"
              helper-text="Payment flow direction"
            />
          </div>
        </div>

        <!-- Category Section -->
        <div class="space-y-6">
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <TagIcon class="w-5 h-5 mr-2 text-primary-600" />
              Category & Classification
            </h3>
            <p class="text-sm text-gray-500 mt-1">Classify the payment type</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              v-model="form.category"
              label="Category"
              :options="categoryOptions"
              placeholder="Select category"
              required
              :error="errors.category"
              helper-text="Payment category based on direction"
            />
          </div>
        </div>

        <!-- Parties Section -->
        <div class="space-y-6">
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <UsersIcon class="w-5 h-5 mr-2 text-primary-600" />
              Payment Parties
            </h3>
            <p class="text-sm text-gray-500 mt-1">Who is involved in this payment</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              v-model="form.payerId"
              label="Payer"
              :options="payerOptions"
              placeholder="Select payer"
              required
              :error="errors.payerId"
              helper-text="Who is making the payment"
            />

            <Select
              v-model="form.payeeId"
              label="Payee"
              :options="payeeOptions"
              placeholder="Select payee"
              required
              :error="errors.payeeId"
              helper-text="Who is receiving the payment"
            />
          </div>
        </div>

        <!-- Additional Information -->
        <div class="space-y-6">
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <DocumentTextIcon class="w-5 h-5 mr-2 text-primary-600" />
              Additional Information
            </h3>
            <p class="text-sm text-gray-500 mt-1">Optional details about this payment</p>
          </div>
          
          <div>
            <label for="notes" class="block text-sm font-semibold text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="4"
              class="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm font-medium resize-none"
              placeholder="Optional notes about this payment..."
            />
            <p class="text-sm text-gray-500 mt-1">Add any additional context or reference information</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="handleCancel"
            class="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-glow"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>
              {{ isEditing ? 'Update Payment' : 'Create Payment' }}
            </span>
          </button>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { PaymentStatus, PaymentCategory, PaymentDirection, Currency } from '@/types'
import BaseCard from '@/components/BaseCard.vue'
import TextInput from '@/components/TextInput.vue'
import Select from '@/components/Select.vue'
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  TagIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const store = useStore()

const isEditing = computed(() => !!route.params.id)
const paymentId = computed(() => route.params.id as string)

const form = ref({
  amount: '',
  currency: Currency.USD,
  status: PaymentStatus.PENDING,
  category: PaymentCategory.CLIENT_INVOICE,
  direction: PaymentDirection.INCOMING,
  payerId: '',
  payeeId: '',
  notes: ''
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const currencyOptions = [
  { value: Currency.USD, label: 'USD - US Dollar' },
  { value: Currency.INR, label: 'INR - Indian Rupee' },
  { value: Currency.EUR, label: 'EUR - Euro' },
  { value: Currency.GBP, label: 'GBP - British Pound' }
]

const statusOptions = Object.values(PaymentStatus).map(status => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}))

const directionOptions = [
  { value: PaymentDirection.INCOMING, label: 'Incoming (Revenue)' },
  { value: PaymentDirection.OUTGOING, label: 'Outgoing (Expense)' },
  { value: PaymentDirection.NEUTRAL, label: 'Neutral (Transfer/Refund)' }
]

const categoryOptions = computed(() => {
  const direction = form.value.direction
  const allCategories = Object.values(PaymentCategory)
  
  // Filter categories based on direction
  let filteredCategories = allCategories
  if (direction === PaymentDirection.INCOMING) {
    filteredCategories = allCategories.filter(cat => 
      ['client_invoice', 'subscription', 'consulting', 'commission', 'licensing'].includes(cat)
    )
  } else if (direction === PaymentDirection.OUTGOING) {
    filteredCategories = allCategories.filter(cat => 
      ['salary', 'vendor_payment', 'reimbursement', 'office_rent', 'software_license', 'marketing', 'utilities', 'travel', 'equipment'].includes(cat)
    )
  } else if (direction === PaymentDirection.NEUTRAL) {
    filteredCategories = allCategories.filter(cat => 
      ['transfer', 'refund'].includes(cat)
    )
  }
  
  return filteredCategories.map(category => ({
    value: category,
    label: formatCategoryLabel(category)
  }))
})

const payerOptions = computed(() => 
  store.state.users.users.map(user => ({
    value: user.id,
    label: `${user.name} (${user.email})`
  }))
)

const payeeOptions = computed(() => 
  store.state.users.users.map(user => ({
    value: user.id,
    label: `${user.name} (${user.email})`
  }))
)

function formatCategoryLabel(category: string): string {
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.amount || parseFloat(form.value.amount) <= 0) {
    errors.value.amount = 'Amount must be greater than 0'
  }
  
  if (!form.value.currency) {
    errors.value.currency = 'Currency is required'
  }
  
  if (!form.value.status) {
    errors.value.status = 'Status is required'
  }
  
  if (!form.value.category) {
    errors.value.category = 'Category is required'
  }
  
  if (!form.value.direction) {
    errors.value.direction = 'Direction is required'
  }
  
  if (!form.value.payerId) {
    errors.value.payerId = 'Payer is required'
  }
  
  if (!form.value.payeeId) {
    errors.value.payeeId = 'Payee is required'
  }
  
  if (form.value.payerId === form.value.payeeId) {
    errors.value.payeeId = 'Payer and payee cannot be the same'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    const paymentData = {
      amount: parseFloat(form.value.amount),
      currency: form.value.currency,
      status: form.value.status as PaymentStatus,
      category: form.value.category as PaymentCategory,
      direction: form.value.direction as PaymentDirection,
      payerId: form.value.payerId,
      payeeId: form.value.payeeId,
      notes: form.value.notes || undefined
    }
    
    if (isEditing.value) {
      await store.dispatch('payments/updatePayment', { id: paymentId.value, paymentData })
    } else {
      await store.dispatch('payments/createPayment', paymentData)
    }
    
    router.push('/payments')
  } catch (error) {
    console.error('Error saving payment:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push('/payments')
}

onMounted(() => {
  if (isEditing.value) {
    const payment = store.getters['payments/getPaymentById'](paymentId.value)
    if (payment) {
      form.value = {
        amount: payment.amount.toString(),
        currency: payment.currency,
        status: payment.status,
        category: payment.category,
        direction: payment.direction,
        payerId: payment.payerId,
        payeeId: payment.payeeId,
        notes: payment.notes || ''
      }
    }
  }
})
</script>