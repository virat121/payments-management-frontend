import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import PaymentForm from '@/views/PaymentForm.vue'
import UserForm from '@/views/UserForm.vue'
import { PaymentStatus, PaymentCategory, UserRole } from '@/types'
import users from '@/store/modules/users'
import payments from '@/store/modules/payments'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/payments/new', name: 'payment-new', component: PaymentForm },
    { path: '/users/new', name: 'user-new', component: UserForm }
  ]
})

describe('Form Validation - Critical Tests', () => {
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
              }
            ]
          }
        },
        payments: { ...payments }
      }
    })
  })

  describe('PaymentForm Validation', () => {
    it('renders payment form', async () => {
      const wrapper = mount(PaymentForm, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Payment')
    })

    it('has amount input field', async () => {
      const wrapper = mount(PaymentForm, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      const amountInput = wrapper.find('input[type="number"]')
      expect(amountInput.exists()).toBe(true)
    })

    it('has status select field', async () => {
      const wrapper = mount(PaymentForm, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

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

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.exists()).toBe(true)
    })
  })

  describe('UserForm Validation', () => {
    it('renders user form', async () => {
      const wrapper = mount(UserForm, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('User')
    })

    it('has name input field', async () => {
      const wrapper = mount(UserForm, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      const nameInput = wrapper.find('input[type="text"]')
      expect(nameInput.exists()).toBe(true)
    })

    it('has email input field', async () => {
      const wrapper = mount(UserForm, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      const emailInput = wrapper.find('input[type="email"]')
      expect(emailInput.exists()).toBe(true)
    })

    it('has role select field', async () => {
      const wrapper = mount(UserForm, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      const roleSelect = wrapper.find('select')
      expect(roleSelect.exists()).toBe(true)
    })

    it('has submit button', async () => {
      const wrapper = mount(UserForm, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.exists()).toBe(true)
    })
  })

  describe('Form Interaction', () => {
    it('payment form accepts input values', async () => {
      const wrapper = mount(PaymentForm, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      const amountInput = wrapper.find('input[type="number"]')
      await amountInput.setValue('1000')

      expect(amountInput.element.value).toBe('1000')
    })

    it('user form accepts input values', async () => {
      const wrapper = mount(UserForm, {
        global: {
          plugins: [router, store],
          stubs: {
            'router-link': true
          }
        }
      })

      await wrapper.vm.$nextTick()

      const nameInput = wrapper.find('input[type="text"]')
      await nameInput.setValue('Test User')

      expect(nameInput.element.value).toBe('Test User')
    })
  })
})
