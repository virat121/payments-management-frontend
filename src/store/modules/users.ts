import { User, UserRole, UserFormData } from '@/types'

interface UserState {
  users: User[]
  loading: boolean
  searchQuery: string
}

const state: UserState = {
  users: [],
  loading: false,
  searchQuery: ''
}

const getters = {
  filteredUsers: (state: UserState) => {
    if (!state.searchQuery) return state.users

    return state.users.filter(user =>
      user.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(state.searchQuery.toLowerCase())
    )
  },

  getUserById: (state: UserState) => (id: string) => {
    return state.users.find(user => user.id === id)
  },

  activeUsers: (state: UserState) => state.users.filter(user => user.active),
}

const mutations = {
  SET_USERS(state: UserState, users: User[]) {
    state.users = users
  },

  SET_LOADING(state: UserState, loading: boolean) {
    state.loading = loading
  },

  SET_SEARCH_QUERY(state: UserState, query: string) {
    state.searchQuery = query
  },

  ADD_USER(state: UserState, user: User) {
    state.users.push(user)
  },

  UPDATE_USER(state: UserState, updatedUser: User) {
    const index = state.users.findIndex(user => user.id === updatedUser.id)
    if (index !== -1) {
      state.users[index] = updatedUser
    }
  },

  DELETE_USER(state: UserState, userId: string) {
    const index = state.users.findIndex(user => user.id === userId)
    if (index !== -1) {
      state.users.splice(index, 1)
    }
  }
}

const actions = {
  initializeStore({ commit }: any) {
    loadFromStorage({ commit })
    if (state.users.length === 0) {
      seedInitialData({ commit })
    }
  },

  async createUser({ commit, state }: any, userData: UserFormData): Promise<User> {
    commit('SET_LOADING', true)

    // Generate sequential ID
    const nextId = Math.max(...state.users.map((u: User) => parseInt(u.id) || 0), 0) + 1

    const newUser: User = {
      id: nextId.toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    commit('ADD_USER', newUser)
    saveToStorage({ state })
    commit('SET_LOADING', false)

    return newUser
  },

  async updateUser({ commit }: any, { id, userData }: { id: string, userData: Partial<UserFormData> }): Promise<User> {
    commit('SET_LOADING', true)

    const user = state.users.find(u => u.id === id)
    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date().toISOString()
    }

    commit('UPDATE_USER', updatedUser)
    saveToStorage({ state })
    commit('SET_LOADING', false)

    return updatedUser
  },

  async deleteUser({ commit }: any, id: string): Promise<void> {
    commit('SET_LOADING', true)

    const user = state.users.find(u => u.id === id)
    if (!user) {
      throw new Error('User not found')
    }

    commit('DELETE_USER', id)
    saveToStorage({ state })
    commit('SET_LOADING', false)
  },

  setSearchQuery({ commit }: any, query: string) {
    commit('SET_SEARCH_QUERY', query)
  }
}

function loadFromStorage({ commit }: any) {
  const stored = localStorage.getItem('payments_users')
  if (stored) {
    const users = JSON.parse(stored)
    commit('SET_USERS', users)
  }
}

function saveToStorage({ state }: any) {
  localStorage.setItem('payments_users', JSON.stringify(state.users))
}

function seedInitialData({ commit }: any) {
  const initialUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.ADMIN,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: UserRole.USER,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: UserRole.MANAGER,
      active: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  commit('SET_USERS', initialUsers)
  // Save to storage after setting users
  localStorage.setItem('payments_users', JSON.stringify(initialUsers))
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
