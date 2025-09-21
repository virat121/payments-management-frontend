import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import PaymentList from '@/views/PaymentList.vue'
import PaymentForm from '@/views/PaymentForm.vue'
import { PaymentStatus, PaymentCategory, UserRole } from '@/types'
import users from '@/store/modules/users'
import payments from '@/store/modules/payments'

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn()
  },
  registerables: []
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/payments', name: 'payments', component: PaymentList },
    { path: '/payments/new', name: 'payment-new', component: PaymentForm }
  ]
})

describe('Core Components - Essential Tests', () => {
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
                role: UserRole.ADMIN,
                active: true,
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z'
              },
              {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: UserRole.USER,
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
                id: '1',
                amount: 1000.00,
                currency: 'USD',
                status: PaymentStatus.COMPLETED,
                category: PaymentCategory.SALARY,
                direction: 'OUTGOING' as any,
                payerId: '1',
                payeeId: '2',
                notes: 'Test payment',
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z'
              },
              {
                id: '2',
                amount: 500.00,
                currency: 'USD',
                status: PaymentStatus.PENDING,
                category: PaymentCategory.CLIENT_INVOICE,
                direction: 'INCOMING' as any,
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

  describe('Dashboard Component', () => {
    it('renders dashboard without crashing', async () => {
      const wrapper = mount(Dashboard, {
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
      expect(wrapper.text()).toContain('Welcome back')
    })

    it('displays user statistics', async () => {
      const wrapper = mount(Dashboard, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      // Should show user count
      expect(wrapper.text()).toContain('2') // Total users
      expect(wrapper.text()).toContain('Total Users')
    })

    it('displays payment statistics', async () => {
      const wrapper = mount(Dashboard, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      // Should show payment count
      expect(wrapper.text()).toContain('2') // Total payments
      expect(wrapper.text()).toContain('Total Payments')
    })
  })

  describe('PaymentList Component', () => {
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
      expect(wrapper.text()).toContain('$1000.00 USD')
      expect(wrapper.text()).toContain('$500.00 USD')
    })

    it('shows user names in payment list', async () => {
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
  })

  describe('PaymentForm Component', () => {
    it('renders payment form without crashing', async () => {
      const wrapper = mount(PaymentForm, {
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

    it('has required form fields', async () => {
      const wrapper = mount(PaymentForm, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      // Should have form fields
      expect(wrapper.find('input[type="number"]').exists()).toBe(true) // Amount
      expect(wrapper.find('select').exists()).toBe(true) // Status or category
    })

    it('shows submit button', async () => {
      const wrapper = mount(PaymentForm, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      // Should have submit button
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.exists()).toBe(true)
    })
  })

  describe('Store Integration', () => {
    it('store has users module', () => {
      expect(store.state.users).toBeDefined()
      expect(store.state.users.users).toHaveLength(2)
    })

    it('store has payments module', () => {
      expect(store.state.payments).toBeDefined()
      expect(store.state.payments.payments).toHaveLength(2)
    })

    it('can get user by id', () => {
      const user = store.getters['users/getUserById']('1')
      expect(user).toBeDefined()
      expect(user.name).toBe('John Doe')
    })

    it('can get payment by id', () => {
      const payment = store.getters['payments/getPaymentById']('1')
      expect(payment).toBeDefined()
      expect(payment.amount).toBe(1000.00)
    })
  })

  describe('Router Integration', () => {
    it('router is configured correctly', () => {
      expect(router.getRoutes()).toHaveLength(3)
      expect(router.getRoutes().some(route => route.name === 'dashboard')).toBe(true)
      expect(router.getRoutes().some(route => route.name === 'payments')).toBe(true)
      expect(router.getRoutes().some(route => route.name === 'payment-new')).toBe(true)
    })
  })
})
