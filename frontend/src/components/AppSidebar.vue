<template>
  <div class="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
    <div class="mb-8 font-bold text-xl uppercase tracking-wider">
      Widya<br/>
      <span class="text-xs text-cyan-400">v1.0.0</span>
    </div>
    
    <nav class="flex-1 space-y-2">
      <router-link to="/" class="block px-4 py-2 rounded hover:bg-gray-700">🏠 Dashboard</router-link>
      <router-link to="/transactions" class="block px-4 py-2 rounded hover:bg-gray-700">📋 Transaksi</router-link>
      <router-link to="/products" class="block px-4 py-2 rounded hover:bg-gray-700">🛒 Products</router-link>
      <router-link to="/users" class="block px-4 py-2 rounded hover:bg-gray-700">👥 Users</router-link>
    </nav>
    
    <button @click="authStore.logout()" class="mt-auto px-4 py-2 text-left text-red-400 hover:bg-gray-700 rounded">
      🚪 Logout
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>
