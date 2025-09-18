<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Mobile backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-linear"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-linear"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
        @click="closeMobileMenu"
      />
    </Transition>

    <!-- Mobile sidebar -->
    <Transition
      enter-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300 transform"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
      >
        <SidebarContent @navigate="closeMobileMenu" />
      </div>
    </Transition>

    <!-- Desktop sidebar -->
    <div class="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <SidebarContent />
    </div>

    <!-- Main content -->
    <div class="flex flex-col flex-1 lg:pl-64">
      <!-- Mobile header -->
      <div class="sticky top-0 z-10 flex h-16 bg-white shadow lg:hidden">
        <button
          @click="toggleMobileMenu"
          class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
        >
          <Bars3Icon class="h-6 w-6" />
        </button>
        <div class="flex-1 px-4 flex justify-between items-center">
          <h1 class="text-lg font-semibold text-gray-900">Payment System</h1>
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import SidebarContent from './SidebarContent.vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

defineExpose({
  toggleMobileMenu
})
</script>