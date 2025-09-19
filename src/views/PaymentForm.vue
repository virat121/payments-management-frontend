<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEditing ? 'Edit Payment' : 'Create Payment' }}
      </h1>
      <p class="text-gray-600 mt-1">
        {{ isEditing ? 'Update payment information' : 'Add a new payment to the system' }}
      </p>
    </div>

    <BaseCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            v-model="form.amount"
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            required
            :error="errors.amount"
          />

          <Select
            v-model="form.currency"
            label="Currency"
            :options="currencyOptions"
            placeholder="Select currency"
            required
            :error="errors.currency"
          />

          <Select
            v-model="form.status"
            label="Status"
            :options="statusOptions"
            placeholder="Select status"
            required
            :error="errors.status"
          />

          <Select
            v-model="form.category"
            label="Category"
            :options="categoryOptions"
            placeholder="Select category"
            required
            :error="errors.category"
          />

          <Select
            v-model="form.direction"
            label="Direction"
            :options="directionOptions"
            placeholder="Select direction"
            required
            :error="errors.direction"
          />

          <Select
            v-model="form.payerId"
            label="Payer"
            :options="payerOptions"
            placeholder="Select payer"
            required
            :error="errors.payerId"
          />

          <Select
            v-model="form.payeeId"
            label="Payee"
            :options="payeeOptions"
            placeholder="Select payee"
            required
            :error="errors.payeeId"
          />
        </div>

        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Optional notes about this payment..."
          />
        </div>

        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="handleCancel"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Payment' : 'Create Payment') }}
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
import { PaymentStatus, PaymentCategory, PaymentDirection, Currency, type Payment } from '@/types'
import currencyService from '@/services/currencyService'
import BaseCard from '@/components/BaseCard.vue'
import TextInput from '@/components/TextInput.vue'
import Select from '@/components/Select.vue'

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