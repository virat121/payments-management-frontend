import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import PaymentList from '@/views/PaymentList.vue'
import { PaymentStatus, PaymentCategory } from '@/types'
import users from '@/store/modules/users'
import payments from '@/store/modules/payments'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/payments', name: 'payments', component: PaymentList },
    { path: '/payments/new', name: 'payment-new', component: {} },
    { path: '/payments/:id', name: 'payment-detail', component: {} }
  ]
})

describe('PaymentList - Essential Tests', () => {
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
                id: 'payment-1',
                amount: 100.00,
                currency: 'USD',
                status: PaymentStatus.COMPLETED,
                category: PaymentCategory.SALARY,
                payerId: '1',
                payeeId: '2',
                notes: 'Test payment 1',
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z'
              },
              {
                id: 'payment-2',
                amount: 250.50,
                currency: 'USD',
                status: PaymentStatus.PENDING,
                category: PaymentCategory.INVOICE,
                payerId: '2',
                payeeId: '1',
                notes: 'Test payment 2',
                createdAt: '2023-01-02T00:00:00Z',
                updatedAt: '2023-01-02T00:00:00Z'
              }
            ]
          }
        }
      }
    })
  })

  it('renders payment list without crashing', async () => {
    const wrapper = mount(PaymentList, {
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
    expect(wrapper.text()).toContain('Payments')
  })

  it('displays payment data', async () => {
    const wrapper = mount(PaymentList, {
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Should display payment amounts
    expect(wrapper.text()).toContain('$100.00 USD')
    expect(wrapper.text()).toContain('$250.50 USD')
  })

  it('shows user names', async () => {
    const wrapper = mount(PaymentList, {
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

  it('has filter controls', async () => {
    const wrapper = mount(PaymentList, {
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Should have filter selects
    const selects = wrapper.findAll('select')
    expect(selects.length).toBeGreaterThan(0)
  })

  it('shows empty state when no payments', async () => {
    const emptyStore = createStore({
      modules: {
        users: { ...users },
        payments: {
          ...payments,
          state: {
            ...payments.state,
            payments: []
          }
        }
      }
    })

    const wrapper = mount(PaymentList, {
      global: {
        plugins: [router, emptyStore],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Should show empty state
    expect(wrapper.text()).toContain('No data available')
  })
})