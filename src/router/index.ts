import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import FinancialDashboard from '@/views/FinancialDashboard.vue'
import UserList from '@/views/UserList.vue'
import UserForm from '@/views/UserForm.vue'
import PaymentList from '@/views/PaymentList.vue'
import PaymentDetail from '@/views/PaymentDetail.vue'
import PaymentForm from '@/views/PaymentForm.vue'

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/payments-management-frontend/' : '/'),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/financial',
      name: 'financial',
      component: FinancialDashboard
    },
    {
      path: '/users',
      name: 'users',
      component: UserList
    },
    {
      path: '/users/new',
      name: 'user-new',
      component: UserForm
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: UserForm,
      props: true
    },
    {
      path: '/payments',
      name: 'payments',
      component: PaymentList
    },
    {
      path: '/payments/new',
      name: 'payment-new',
      component: PaymentForm
    },
    {
      path: '/payments/:id',
      name: 'payment-detail',
      component: PaymentDetail,
      props: true
    },
    {
      path: '/payments/:id/edit',
      name: 'payment-edit',
      component: PaymentForm,
      props: true
    }
  ]
})

export default router