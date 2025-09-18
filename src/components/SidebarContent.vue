<template>
  <div class="flex flex-col h-full bg-white border-r border-gray-200">
    <!-- Logo -->
    <div class="flex items-center h-16 px-6 border-b border-gray-200">
      <div class="flex items-center">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <CreditCardIcon class="w-5 h-5 text-white" />
        </div>
        <h1 class="ml-3 text-xl font-bold text-gray-900">PaymentSys</h1>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <router-link
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        @click="$emit('navigate')"
        class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
        :class="[
          $route.path === item.href
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        ]"
      >
        <component
          :is="item.icon"
          class="mr-3 h-5 w-5 transition-colors duration-200"
          :class="[
            $route.path === item.href
              ? 'text-blue-600'
              : 'text-gray-400 group-hover:text-gray-500'
          ]"
        />
        {{ item.name }}
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center">
        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <UserIcon class="w-4 h-4 text-gray-600" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">Admin User</p>
          <p class="text-xs text-gray-500">admin@example.com</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  UsersIcon,
  CreditCardIcon,
  UserIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

defineEmits<{
  navigate: []
}>()

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Financial', href: '/financial', icon: ChartBarIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon }
]
</script>