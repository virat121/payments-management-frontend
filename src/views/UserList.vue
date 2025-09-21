<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Users</h1>
        <p class="text-gray-600 mt-1">Manage system users and their roles</p>
      </div>
      <router-link
        to="/users/new"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Add User
      </router-link>
    </div>

    <BaseCard>
      <!-- Search and filters -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <TextInput
            v-model="searchQuery"
            placeholder="Search users by name or email..."
            class="w-full"
          >
            <template #prefix>
              <MagnifyingGlassIcon class="w-4 h-4 text-gray-400" />
            </template>
          </TextInput>
        </div>
        <Select
          v-model="roleFilter"
          :options="roleFilterOptions"
          placeholder="Filter by role"
          class="w-full sm:w-48"
        />
        <Select
          v-model="statusFilter"
          :options="statusFilterOptions"
          placeholder="Filter by status"
          class="w-full sm:w-48"
        />
      </div>

      <!-- Users table -->
      <BaseTable
        :columns="columns"
        :data="filteredUsers"
        :loading="loading"
        @sort="handleSort"
      >
        <template #cell-status="{ item }">
          <StatusBadge :status="item.active ? 'active' : 'inactive'" type="user" />
        </template>
        <template #cell-role="{ item }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getRoleClasses(item.role)">
            {{ item.role.charAt(0).toUpperCase() + item.role.slice(1) }}
          </span>
        </template>
        <template #cell-actions="{ item }">
          <div class="flex items-center space-x-2">
            <router-link
              :to="`/users/${item.id}/edit`"
              class="text-blue-600 hover:text-blue-900 transition-colors duration-200"
              title="Edit user"
            >
              <PencilIcon class="w-4 h-4" />
            </router-link>
            <button
              @click="confirmDelete(item)"
              class="text-red-600 hover:text-red-900 transition-colors duration-200"
              title="Delete user"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </template>
        <template #empty>
          <div class="text-center py-12">
            <UsersIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating a new user.' }}
            </p>
            <div class="mt-6" v-if="!searchQuery">
              <router-link
                to="/users/new"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <PlusIcon class="w-4 h-4 mr-2" />
                Add User
              </router-link>
            </div>
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <!-- Delete confirmation dialog -->
    <ConfirmDialog
      v-if="userToDelete"
      :isOpen="!!userToDelete"
      title="Delete User"
      :message="`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`"
      confirm-text="Delete"
      type="danger"
      @confirm="handleDelete"
      @cancel="userToDelete = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { UserRole, type User } from '@/types'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import BaseCard from '@/components/BaseCard.vue'
import BaseTable from '@/components/BaseTable.vue'
import TextInput from '@/components/TextInput.vue'
import Select from '@/components/Select.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const store = useStore()

const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const loading = ref(false)
const userToDelete = ref<User | null>(null)

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
]

const roleFilterOptions = [
  { value: '', label: 'All Roles' },
  ...Object.values(UserRole).map((role: UserRole) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1)
  }))
]

const statusFilterOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

const filteredUsers = computed(() => {
  let users = [...store.state.users.users]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    users = users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  // Role filter
  if (roleFilter.value) {
    users = users.filter(user => user.role === roleFilter.value)
  }

  // Status filter
  if (statusFilter.value) {
    const isActive = statusFilter.value === 'active'
    users = users.filter(user => user.active === isActive)
  }

  return users
})

const getRoleClasses = (role: UserRole) => {
  const classes = {
    [UserRole.ADMIN]: 'bg-purple-100 text-purple-800',
    [UserRole.USER]: 'bg-blue-100 text-blue-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const handleSort = (column: string, direction: 'asc' | 'desc') => {
  // Implement sorting logic if needed
  console.log('Sort:', column, direction)
}

const confirmDelete = (user: User) => {
  userToDelete.value = user
}

const handleDelete = async () => {
  if (userToDelete.value) {
    await store.dispatch('users/deleteUser', userToDelete.value.id)
    userToDelete.value = null
  }
}

onMounted(() => {
  // Users are already loaded from the store initialization
})
</script>