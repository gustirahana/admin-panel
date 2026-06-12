<template>
  <div class="p-8 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-gray-100">Dashboard Overview</h1>

    <div v-if="dashboardStore.loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
    </div>
    
    <div v-else-if="dashboardStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {{ dashboardStore.error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Total Transactions -->
      <div class="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 flex items-center">
        <div class="p-4 rounded-full bg-blue-50 text-blue-600 mr-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
        </div>
        <div>
          <p class="text-sm text-gray-400 font-medium uppercase tracking-wider">Transactions</p>
          <p class="text-3xl font-bold text-gray-100">{{ dashboardStore.stats.totalTransactions }}</p>
        </div>
      </div>

      <!-- Total Revenue -->
      <div class="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 flex items-center">
        <div class="p-4 rounded-full bg-emerald-50 text-emerald-600 mr-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <p class="text-sm text-gray-400 font-medium uppercase tracking-wider">Revenue</p>
          <p class="text-3xl font-bold text-gray-100">Rp {{ dashboardStore.stats.totalRevenue.toLocaleString('id-ID') }}</p>
        </div>
      </div>

      <!-- Total Products -->
      <div class="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 flex items-center">
        <div class="p-4 rounded-full bg-purple-50 text-purple-600 mr-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
        </div>
        <div>
          <p class="text-sm text-gray-400 font-medium uppercase tracking-wider">Products</p>
          <p class="text-3xl font-bold text-gray-100">{{ dashboardStore.stats.totalProducts }}</p>
        </div>
      </div>

      <!-- Total Users -->
      <div class="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 flex items-center">
        <div class="p-4 rounded-full bg-orange-50 text-orange-600 mr-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <div>
          <p class="text-sm text-gray-400 font-medium uppercase tracking-wider">Users</p>
          <p class="text-3xl font-bold text-gray-100">{{ dashboardStore.stats.totalUsers }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.fetchStats()
})
</script>
