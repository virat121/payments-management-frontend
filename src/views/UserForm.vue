<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEditing ? 'Edit User' : 'Create User' }}
      </h1>
      <p class="text-gray-600 mt-1">
        {{ isEditing ? 'Update user information' : 'Add a new user to the system' }}
      </p>
    </div>

    <BaseCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            v-model="form.name"
            label="Full Name"
            placeholder="Enter full name"
            required
            :error="errors.name"
          />

          <TextInput
            v-model="form.email"
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            required
            :error="errors.email"
          />

          <Select
            v-model="form.role"
            label="Role"
            :options="roleOptions"
            placeholder="Select role"
            required
            :error="errors.role"
          />

          <div class="flex items-center space-x-3">
            <label class="flex items-center">
              <input
                v-model="form.active"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm font-medium text-gray-700">Active User</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="handleCancel"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update User' : 'Create User') }}
          </button>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { UserRole, type User } from '@/types'
import BaseCard from '@/components/BaseCard.vue'
import TextInput from '@/components/TextInput.vue'
import Select from '@/components/Select.vue'

const router = useRouter()
const route = useRoute()
const store = useStore()

const isEditing = computed(() => !!route.params.id)
const userId = computed(() => route.params.id as string)

const form = ref({
  name: '',
  email: '',
  role: UserRole.USER,
  active: true
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const roleOptions = Object.values(UserRole).map((role: UserRole) => ({
  value: role,
  label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
}))

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
  }
  
  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }
  
  if (!form.value.role) {
    errors.value.role = 'Role is required'
  }
  
  // Check for duplicate email (excluding current user if editing)
  const existingUser = store.state.users.users.find((user: any) => 
    user.email === form.value.email && (!isEditing.value || user.id !== userId.value)
  )
  if (existingUser) {
    errors.value.email = 'Email address is already in use'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      role: form.value.role as UserRole,
      active: form.value.active
    }
    
    if (isEditing.value) {
      await store.dispatch('users/updateUser', { id: userId.value, userData })
    } else {
      await store.dispatch('users/createUser', userData)
    }
    
    router.push('/users')
  } catch (error) {
    console.error('Error saving user:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push('/users')
}

onMounted(() => {
  if (isEditing.value) {
    const user = store.getters['users/getUserById'](userId.value)
    if (user) {
      form.value = {
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active
      }
    }
  }
})
</script>