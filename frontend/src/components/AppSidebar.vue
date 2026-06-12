<template>
  <div class="w-64 bg-gray-900 border-r border-gray-800 text-gray-300 h-full min-h-screen p-4 flex flex-col font-sans overflow-y-auto">
    
    <!-- Desktop Logo (hidden on mobile since mobile header has it) -->
    <div class="mb-8 px-4 font-bold text-2xl tracking-wider text-white hidden md:block">
      Admin<span class="text-cyan-400">Panel</span>
    </div>

    <!-- Mobile Sidebar Header with Close Button -->
    <div class="mb-8 px-4 flex justify-between items-center md:hidden">
      <div class="font-bold text-xl tracking-wider text-white">
        Menu
      </div>
      <button @click="$emit('close')" class="text-gray-400 hover:text-white focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    
    <nav class="flex-1 space-y-1">
      <router-link to="/" @click="$emit('close')" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        Dashboard
      </router-link>
      <router-link to="/transactions" @click="$emit('close')" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
        Transactions
      </router-link>
      <router-link to="/products" @click="$emit('close')" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        Products
      </router-link>
      <router-link to="/users" @click="$emit('close')" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        Users
      </router-link>
      
      <div class="pt-6 pb-2">
        <div class="border-t border-gray-800"></div>
      </div>

      <button @click="authStore.logout()" class="w-full flex items-center px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        Logout
      </button>
    </nav>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

// Define emit so we can trigger the close event
defineEmits(['close'])

const authStore = useAuthStore()
</script>
