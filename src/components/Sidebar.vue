<template>
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
      class="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
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
      class="fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-md shadow-2xl lg:hidden"
    >
      <SidebarContent @navigate="closeMobileMenu" />
    </div>
  </Transition>

  <!-- Desktop sidebar -->
  <div class="hidden lg:flex lg:w-64 lg:flex-col lg:h-full">
    <SidebarContent />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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