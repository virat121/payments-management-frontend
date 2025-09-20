import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import PaymentForm from '@/views/PaymentForm.vue'
import { PaymentStatus, PaymentCategory } from '@/types'
import users from '@/store/modules/users'
import payments from '@/store/modules/payments'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/payments', name: 'payments', component: {} },
    { path: '/payments/new', name: 'payment-new', component: PaymentForm }
  ]
})

describe('PaymentForm', () => {
  let store: any

  beforeEach(() => {
    store = createStore({
      modules: {
        users: {
          ...users,
          state: {
            ...users.state,
            users: [
              {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'user' as any,
                active: true,
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z'
              },
              {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'admin' as any,
                active: true,
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z'
              }
            ]
          }
        },
        payments: { ...payments }
      }
    })
  })

  it('shows validation errors when required fields are empty', async () => {
    const wrapper = mount(PaymentForm, {
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    // Try to submit form without filling required fields
    await wrapper.find('form').trigger('submit.prevent')

    // Check if validation errors are displayed
    const errorMessages = wrapper.findAll('.text-red-600')
    expect(errorMessages.length).toBeGreaterThan(0)
  })

  it('shows error when payer and payee are the same', async () => {
    const wrapper = mount(PaymentForm, {
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    // Fill form with valid data but same payer/payee
    const amountInput = wrapper.find('input[type="number"]')
    await amountInput.setValue('100')

    const selects = wrapper.findAll('select')
    await selects[0].setValue('USD') // currency
    await selects[1].setValue(PaymentStatus.PENDING) // status
    await selects[2].setValue(PaymentCategory.TRANSFER) // category
    await selects[3].setValue('1') // payer
    await selects[4].setValue('1') // payee (same as payer)

    await wrapper.find('form').trigger('submit.prevent')

    // Should show error about same payer/payee
    const errorMessages = wrapper.findAll('.text-red-600')
    const hasPayeeError = errorMessages.some(el =>
      el.text().includes('Payer and payee cannot be the same')
    )
    expect(hasPayeeError).toBe(true)
  })

  it('emits save event when valid data is entered', async () => {
    const createPaymentSpy = vi.spyOn(store, 'dispatch')
    createPaymentSpy.mockResolvedValue({
      id: 'new-payment',
      amount: 100,
      currency: 'USD',
      status: PaymentStatus.PENDING,
      category: PaymentCategory.TRANSFER,
      payerId: '1',
      payeeId: '2',
      notes: 'Test payment',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    })

    const wrapper = mount(PaymentForm, {
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    // Fill form with valid data
    const amountInput = wrapper.find('input[type="number"]')
    await amountInput.setValue('100')

    const selects = wrapper.findAll('select')
    await selects[0].setValue('USD') // currency
    await selects[1].setValue(PaymentStatus.PENDING) // status
    await selects[2].setValue(PaymentCategory.TRANSFER) // category
    await selects[3].setValue('1') // payer
    await selects[4].setValue('2') // payee

    const notesInput = wrapper.find('input[type="text"]:not([type="number"])')
    await notesInput.setValue('Test payment')

    await wrapper.find('form').trigger('submit.prevent')

    // Should call createPayment
    expect(createPaymentSpy).toHaveBeenCalledWith('payments/createPayment', {
      amount: 100,
      currency: 'USD',
      status: PaymentStatus.PENDING,
      category: PaymentCategory.TRANSFER,
      payerId: '1',
      payeeId: '2',
      notes: 'Test payment'
    })
  })

  it('validates amount is greater than 0', async () => {
    const wrapper = mount(PaymentForm, {
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    // Set amount to 0
    const amountInput = wrapper.find('input[type="number"]')
    await amountInput.setValue('0')

    await wrapper.find('form').trigger('submit.prevent')

    // Should show amount validation error
    const errorMessages = wrapper.findAll('.text-red-600')
    const hasAmountError = errorMessages.some(el =>
      el.text().includes('Amount must be greater than 0')
    )
    expect(hasAmountError).toBe(true)
  })
})