<template>
  <header class="bg-white/95 backdrop-blur-md shadow-soft border-b border-gray-200/50 sticky top-0 z-30">
    <div class="px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <button
            class="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
            @click="toggleSidebar"
          >
            <Bars3Icon class="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          <div class="min-w-0 flex-1 lg:flex-none lg:max-w-md">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 truncate">
              {{ pageTitle }}
            </h2>
            <p v-if="pageSubtitle" class="text-xs sm:text-sm text-gray-500 font-medium truncate">
              {{ pageSubtitle }}
            </p>
          </div>
        </div>

        <!-- Center Search - Only on desktop -->
        <div class="hidden lg:flex flex-1 justify-center max-w-md mx-8">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search payments, users..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-2 lg:space-x-3">
          <!-- Notifications -->
          <button class="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm">
            <BellIcon class="h-5 w-5" />
            <span class="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full animate-pulse-soft"></span>
          </button>

          <!-- Profile dropdown -->
          <div class="relative">
            <button
              class="flex items-center space-x-2 lg:space-x-3 p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
              @click="toggleProfileMenu"
            >
              <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-glow">
                <span class="text-sm font-bold text-white">AD</span>
              </div>
              <div class="hidden lg:block text-left min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">Admin User</p>
                <p class="text-xs text-gray-500 truncate">Online</p>
              </div>
              <ChevronDownIcon class="h-4 w-4 flex-shrink-0" />
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
                class="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-large border border-gray-200/50 z-50"
              >
                <div class="py-2">
                  <div class="px-4 py-3 border-b border-gray-100/50">
                    <p class="text-sm font-semibold text-gray-900">Admin User</p>
                    <p class="text-sm text-gray-500">admin@example.com</p>
                    <div class="flex items-center mt-1">
                      <div class="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
                      <span class="text-xs text-success-600 font-medium">Online</span>
                    </div>
                  </div>
                  <a
                    href="#"
                    class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <UserIcon class="h-4 w-4 mr-3 text-gray-400" />
                    Profile Settings
                  </a>
                  <a
                    href="#"
                    class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Cog6ToothIcon class="h-4 w-4 mr-3 text-gray-400" />
                    Preferences
                  </a>
                  <div class="border-t border-gray-100/50 my-1"></div>
                  <a
                    href="#"
                    class="flex items-center px-4 py-3 text-sm text-error-600 hover:bg-error-50 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon class="h-4 w-4 mr-3" />
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
import { 
  Bars3Icon, 
  BellIcon, 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

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