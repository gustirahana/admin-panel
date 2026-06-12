<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 flex flex-col md:flex-row font-sans overflow-x-hidden">
    
    <!-- Mobile Header with Hamburger -->
    <div v-if="authStore.isAuthenticated" class="md:hidden flex items-center justify-between bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-30">
      <div class="font-bold text-xl tracking-wider text-white">
        Admin<span class="text-cyan-400">Panel</span>
      </div>
      <button @click="isSidebarOpen = true" class="text-gray-300 hover:text-white focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div v-if="authStore.isAuthenticated && isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden transition-opacity"></div>

    <!-- Sidebar Wrapper -->
    <div v-if="authStore.isAuthenticated" :class="[
        'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]">
      <AppSidebar @close="isSidebarOpen = false" />
    </div>
    
    <!-- Main Content -->
    <main class="flex-1 w-full relative overflow-y-auto h-screen">
      <RouterView />
    </main>
    
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/AppSidebar.vue'

const authStore = useAuthStore()
const isSidebarOpen = ref(false)
</script>
