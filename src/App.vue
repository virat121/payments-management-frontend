<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <div class="flex h-screen">
      <!-- Sidebar -->
      <Sidebar ref="sidebarRef" />

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Navbar -->
        <Navbar @toggle-sidebar="toggleSidebar" />

        <!-- Page Content -->
        <main class="flex-1 overflow-auto">
          <div class="container mx-auto px-6 py-8">
            <router-view />
          </div>
        </main>
      </div>
    </div>

    <!-- Toast Container -->
    <Toast ref="toastRef" />
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