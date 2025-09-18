<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            class="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            @click="toggleSidebar"
          >
            <Bars3Icon class="h-6 w-6" />
          </button>
          
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              {{ pageTitle }}
            </h2>
            <p v-if="pageSubtitle" class="text-sm text-gray-500">
              {{ pageSubtitle }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200">
            <BellIcon class="h-6 w-6" />
          </button>

          <!-- Profile dropdown -->
          <div class="relative">
            <button
              class="flex items-center space-x-2 p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              @click="toggleProfileMenu"
            >
              <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-white">AD</span>
              </div>
              <ChevronDownIcon class="h-4 w-4" />
            </button>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-if="profileMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
              >
                <div class="py-1">
                  <div class="px-4 py-2 border-b border-gray-100">
                    <p class="text-sm font-medium text-gray-900">Admin User</p>
                    <p class="text-sm text-gray-500">admin@example.com</p>
                  </div>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Profile Settings
                  </a>
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Bars3Icon, BellIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const route = useRoute()
const profileMenuOpen = ref(false)

const pageTitle = computed(() => {
  const titleMap: Record<string, string> = {
    dashboard: 'Dashboard',
    users: 'Users',
    'user-new': 'Add User',
    'user-edit': 'Edit User',
    payments: 'Payments',
    'payment-new': 'Add Payment',
    'payment-edit': 'Edit Payment',
    'payment-detail': 'Payment Details'
  }
  return titleMap[route.name as string] || 'PaymentPro'
})

const pageSubtitle = computed(() => {
  const subtitleMap: Record<string, string> = {
    dashboard: 'Overview of your payment system',
    users: 'Manage system users',
    payments: 'Track and manage payments'
  }
  return subtitleMap[route.name as string] || ''
})

function toggleSidebar() {
  emit('toggle-sidebar')
}

function toggleProfileMenu() {
  profileMenuOpen.value = !profileMenuOpen.value
}

function closeProfileMenu() {
  profileMenuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      closeProfileMenu()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeProfileMenu)
})
</script>