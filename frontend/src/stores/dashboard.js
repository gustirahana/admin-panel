import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({
    totalTransactions: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  const loading = ref(false)
  const error   = ref(null)

  async function fetchStats() {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.get('/dashboard')
      stats.value = data.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to load dashboard'
    } finally {
      loading.value = false
    }
  }

  return { stats, loading, error, fetchStats }
})
