import { describe, it, expect, beforeEach } from 'vitest'
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

describe('PaymentDetail - Essential Tests', () => {
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

  it('renders payment detail without crashing', async () => {
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

    // Basic rendering test
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Payment')
  })

  it('displays payment information', async () => {
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
  })

  it('shows user names', async () => {
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

    // Should show user names
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Jane Smith')
  })

  it('has action buttons', async () => {
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

    // Should have action buttons
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
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