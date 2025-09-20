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

describe('PaymentList', () => {
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
              },
              {
                id: 'payment-3',
                amount: 75.25,
                currency: 'USD',
                status: PaymentStatus.FAILED,
                category: PaymentCategory.REFUND,
                payerId: '1',
                payeeId: '2',
                notes: 'Test payment 3',
                createdAt: '2023-01-03T00:00:00Z',
                updatedAt: '2023-01-03T00:00:00Z'
              }
            ]
          }
        }
      }
    })
  })

  it('renders payments correctly', async () => {
    const wrapper = mount(PaymentList, {
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Should display payment data
    expect(wrapper.text()).toContain('$100.00')
    expect(wrapper.text()).toContain('$250.50')
    expect(wrapper.text()).toContain('$75.25')
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Jane Smith')
  })

  it('filters payments by status', async () => {
    const wrapper = mount(PaymentList, {
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Find status filter dropdown
    const statusFilter = wrapper.findAll('select')[0]
    await statusFilter.setValue(PaymentStatus.COMPLETED)

    await wrapper.vm.$nextTick()

    // Should only show completed payments
    expect(wrapper.text()).toContain('$100.00')
    expect(wrapper.text()).not.toContain('$250.50')
    expect(wrapper.text()).not.toContain('$75.25')
  })

  it('filters payments by category', async () => {
    const wrapper = mount(PaymentList, {
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Find category filter dropdown (second select)
    const categoryFilter = wrapper.findAll('select')[1]
    await categoryFilter.setValue(PaymentCategory.INVOICE)

    await wrapper.vm.$nextTick()

    // Should only show invoice payments
    expect(wrapper.text()).toContain('$250.50')
    expect(wrapper.text()).not.toContain('$100.00')
    expect(wrapper.text()).not.toContain('$75.25')
  })

  it('clears filters when clear button is clicked', async () => {
    const wrapper = mount(PaymentList, {
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Set some filters
    store.dispatch('payments/setStatusFilter', PaymentStatus.COMPLETED)
    store.dispatch('payments/setCategoryFilter', PaymentCategory.SALARY)

    await wrapper.vm.$nextTick()

    // Click clear filters button
    const clearButton = wrapper.find('button:contains("Clear Filters")')
    if (clearButton.exists()) {
      await clearButton.trigger('click')
    }

    await wrapper.vm.$nextTick()

    // All payments should be visible again
    expect(wrapper.text()).toContain('$100.00')
    expect(wrapper.text()).toContain('$250.50')
    expect(wrapper.text()).toContain('$75.25')
  })

  it('shows empty state when no payments match filters', async () => {
    const emptyStore = createStore({
      modules: {
        users: { ...users },
        payments: {
          ...payments,
          state: {
            ...payments.state,
            payments: [] // Clear payments
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
    expect(wrapper.text()).toContain('No payments found')
  })
})