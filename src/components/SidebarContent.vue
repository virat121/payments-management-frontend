<template>
  <div class="flex flex-col h-screen bg-white/95 backdrop-blur-md border-r border-gray-200/50 shadow-soft">
    <!-- Logo -->
    <div class="flex items-center h-16 px-6 border-b border-gray-200/50">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-glow">
          <CreditCardIcon class="w-6 h-6 text-white" />
        </div>
        <div class="ml-3">
          <h1 class="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            FinFlow
          </h1>
          <p class="text-xs text-gray-500 font-medium">Financial Suite</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-1">
      <router-link
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        @click="$emit('navigate')"
        class="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative"
        :class="[
          $route.path === item.href
            ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm border border-primary-200/50'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
        ]"
      >
        <component
          :is="item.icon"
          class="mr-3 h-5 w-5 transition-all duration-200"
          :class="[
            $route.path === item.href
              ? 'text-primary-600'
              : 'text-gray-400 group-hover:text-gray-600'
          ]"
        />
        <span class="font-medium">{{ item.name }}</span>
        
        <!-- Active indicator -->
        <div
          v-if="$route.path === item.href"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-l-full"
        ></div>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200/50 bg-gray-50/50">
      <div class="flex items-center p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-soft">
        <div class="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-glow">
          <UserIcon class="w-5 h-5 text-white" />
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-semibold text-gray-900">Admin User</p>
          <p class="text-xs text-gray-500">admin@example.com</p>
        </div>
        <div class="w-2 h-2 bg-success-500 rounded-full animate-pulse-soft"></div>
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