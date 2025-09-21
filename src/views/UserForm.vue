<template>
  <div class="max-w-2xl mx-auto p-4 sm:p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center space-x-4 mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-glow">
          <UserIcon class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
            {{ isEditing ? 'Edit User' : 'Create User' }}
          </h1>
          <p class="text-gray-600 mt-1">
            {{ isEditing ? 'Update user information' : 'Add a new user to the system' }}
          </p>
        </div>
      </div>
    </div>

    <BaseCard variant="elevated" class="overflow-hidden">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- User Information Section -->
        <div class="space-y-6">
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <IdentificationIcon class="w-5 h-5 mr-2 text-primary-600" />
              User Information
            </h3>
            <p class="text-sm text-gray-500 mt-1">Enter the user's basic details</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TextInput
              v-model="form.name"
              label="Full Name"
              placeholder="Enter full name"
              required
              :error="errors.name"
              helper-text="Enter the user's complete name"
            />

            <TextInput
              v-model="form.email"
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              required
              :error="errors.email"
              helper-text="User's email for login and notifications"
            />
          </div>
        </div>

        <!-- Role & Permissions Section -->
        <div class="space-y-6">
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <ShieldCheckIcon class="w-5 h-5 mr-2 text-primary-600" />
              Role & Permissions
            </h3>
            <p class="text-sm text-gray-500 mt-1">Set user role and access level</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              v-model="form.role"
              label="Role"
              :options="roleOptions"
              placeholder="Select role"
              required
              :error="errors.role"
              helper-text="Choose the user's role in the system"
            />

            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-700">
                Account Status
              </label>
              <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="form.active"
                    type="checkbox"
                    class="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors duration-200"
                  />
                  <span class="ml-3 text-sm font-medium text-gray-700">Active User</span>
                </label>
                <div class="flex-1">
                  <p class="text-xs text-gray-500">Active users can log in and access the system</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="handleCancel"
            class="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-glow"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>
              {{ isEditing ? 'Update User' : 'Create User' }}
            </span>
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
import {
  UserIcon,
  IdentificationIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

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