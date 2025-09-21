<template>
    <div id="app" class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Desktop Sidebar - Fixed positioned -->
    <div class="hidden lg:block fixed inset-y-0 left-0 z-20">
      <Sidebar ref="sidebarRef" />
    </div>

    <!-- Main Content - With proper left margin for desktop -->
    <div class="lg:ml-64 flex flex-col min-h-screen">
      <!-- Navbar -->
      <Navbar @toggle-sidebar="toggleSidebar" />

      <!-- Page Content -->
            <main class="flex-1 overflow-auto bg-slate-50/30">
        <div class="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div class="animate-fade-in-up">
            <router-view />
          </div>
        </div>
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div class="lg:hidden">
      <Sidebar ref="sidebarRef" />
    </div>

    <!-- Toast Container -->
    <Toast ref="toastRef" title="System Ready" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import Toast from '@/components/Toast.vue'

const store = useStore()
const sidebarRef = ref()
const toastRef = ref()

function toggleSidebar() {
  sidebarRef.value?.toggleMobileMenu()
}

onMounted(() => {
  // Initialize stores with data
  store.dispatch('users/initializeStore')
  store.dispatch('payments/initializeStore')
})
</script>