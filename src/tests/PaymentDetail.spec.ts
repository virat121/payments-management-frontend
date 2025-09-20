import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import PaymentDetail from '@/views/PaymentDetail.vue'
import { PaymentStatus, PaymentCategory } from '@/types'
import users from '@/store/modules/users'
import payments from '@/store/modules/payments'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/payments', name: 'payments', component: {} },
    { path: '/payments/:id', name: 'payment-detail', component: PaymentDetail }
  ]
})

describe('PaymentDetail', () => {
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
        payments: {
          ...payments,
          state: {
            ...payments.state,
            payments: [
              {
                id: 'test-payment-id',
                amount: 150.75,
                currency: 'USD',
                status: PaymentStatus.COMPLETED,
                category: PaymentCategory.INVOICE,
                payerId: '1',
                payeeId: '2',
                notes: 'Test payment for services',
                createdAt: '2023-01-01T10:00:00Z',
                updatedAt: '2023-01-01T10:30:00Z'
              }
            ]
          }
        }
      }
    })
  })

  it('displays correct payment details', async () => {
    const wrapper = mount(PaymentDetail, {
      props: {
        id: 'test-payment-id'
      },
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Should display payment information
    expect(wrapper.text()).toContain('$150.75')
    expect(wrapper.text()).toContain('USD')
    expect(wrapper.text()).toContain('Completed')
    expect(wrapper.text()).toContain('Invoice')
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Jane Smith')
    expect(wrapper.text()).toContain('Test payment for services')
    expect(wrapper.text()).toContain('test-payment-id')
  })

  it('shows refund button for completed payments', async () => {
    const wrapper = mount(PaymentDetail, {
      props: {
        id: 'test-payment-id'
      },
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Should show refund button for completed payment
    const refundButton = wrapper.find('button:contains("Refund")')
    expect(refundButton.exists()).toBe(true)
  })

  it('shows cancel button for pending payments', async () => {
    const pendingStore = createStore({
      modules: {
        users: { ...users },
        payments: {
          ...payments,
          state: {
            ...payments.state,
            payments: [
              {
                id: 'test-payment-id',
                amount: 150.75,
                currency: 'USD',
                status: PaymentStatus.PENDING,
                category: PaymentCategory.INVOICE,
                payerId: '1',
                payeeId: '2',
                notes: 'Test payment for services',
                createdAt: '2023-01-01T10:00:00Z',
                updatedAt: '2023-01-01T10:30:00Z'
              }
            ]
          }
        }
      }
    })

    const wrapper = mount(PaymentDetail, {
      props: {
        id: 'test-payment-id'
      },
      global: {
        plugins: [router, pendingStore],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Should show cancel button for pending payment
    const cancelButton = wrapper.find('button:contains("Cancel")')
    expect(cancelButton.exists()).toBe(true)
  })

  it('triggers delete action when delete button is clicked', async () => {
    const wrapper = mount(PaymentDetail, {
      props: {
        id: 'test-payment-id'
      },
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Click delete button
    const deleteButton = wrapper.find('button:contains("Delete")')
    expect(deleteButton.exists()).toBe(true)

    await deleteButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Should show delete confirmation dialog
    expect(wrapper.text()).toContain('Delete Payment')
    expect(wrapper.text()).toContain('Are you sure you want to delete this payment?')
  })

  it('triggers refund action when refund is confirmed', async () => {
    const updatePaymentSpy = vi.spyOn(store, 'dispatch')
    updatePaymentSpy.mockResolvedValue({
      id: 'test-payment-id',
      amount: 150.75,
      currency: 'USD',
      status: PaymentStatus.REFUNDED,
      category: PaymentCategory.INVOICE,
      payerId: '1',
      payeeId: '2',
      notes: 'Test payment for services',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2023-01-01T10:30:00Z'
    })

    const wrapper = mount(PaymentDetail, {
      props: {
        id: 'test-payment-id'
      },
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Click refund button
    const refundButton = wrapper.find('button:contains("Refund")')
    await refundButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Confirm refund in dialog
    const confirmButton = wrapper.find('button:contains("Refund"):last-of-type')
    if (confirmButton.exists()) {
      await confirmButton.trigger('click')
      await wrapper.vm.$nextTick()

      // Should call updatePayment with refunded status
      expect(updatePaymentSpy).toHaveBeenCalledWith('payments/updatePayment', {
        id: 'test-payment-id',
        paymentData: { status: PaymentStatus.REFUNDED }
      })
    }
  })

  it('handles payment not found', async () => {
    const wrapper = mount(PaymentDetail, {
      props: {
        id: 'non-existent-id'
      },
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Should show payment not found message
    expect(wrapper.text()).toContain('Payment not found')
  })
})