<template>
  <div class="min-h-screen bg-black text-gray-200 flex flex-col md:flex-row font-sans">
    <AppSidebar v-if="authStore.isAuthenticated" />
    
    <main class="flex-1 w-full relative">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/AppSidebar.vue'

const authStore = useAuthStore()
</script>

<style>
/* Global styles could go here, though tailwind handles most */
</style>
