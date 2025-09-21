import { describe, it, expect, beforeEach } from 'vitest'
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

describe('PaymentForm - Essential Tests', () => {
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

    // Should have amount input
    const amountInput = wrapper.find('input[type="number"]')
    expect(amountInput.exists()).toBe(true)

    // Should have select fields
    const selects = wrapper.findAll('select')
    expect(selects.length).toBeGreaterThan(0)
  })

  it('has submit button', async () => {
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

  it('accepts input values', async () => {
    const wrapper = mount(PaymentForm, {
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Test amount input
    const amountInput = wrapper.find('input[type="number"]')
    await amountInput.setValue('1000')
    expect(amountInput.element.value).toBe('1000')
  })

  it('shows user options in payer/payee selects', async () => {
    const wrapper = mount(PaymentForm, {
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': true
        }
      }
    })

    await wrapper.vm.$nextTick()

    // Should show user names in the form
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Jane Smith')
  })
})