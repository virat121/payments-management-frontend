import { createStore } from 'vuex'
import users from './modules/users'
import payments from './modules/payments'

export default createStore({
  modules: {
    users,
    payments
  }
})
