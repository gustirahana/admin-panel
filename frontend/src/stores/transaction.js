import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll(params = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get('/transactions', { params })
      transactions.value = data.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to fetch transactions'
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get(`/transactions/${id}`)
      return data.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to fetch transaction'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/transactions', payload)
      return data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to create transaction'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id, payload) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.patch(`/transactions/${id}`, payload)
      return data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to update transaction'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id, status) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.patch(`/transactions/${id}`, { status })
      const index = transactions.value.findIndex(t => t.id === id)
      if (index !== -1) {
        transactions.value[index].status = status
      }
      return data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to update transaction status'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/transactions/${id}`)
      transactions.value = transactions.value.filter(t => t.id !== id)
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to void transaction'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    transactions,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    updateStatus,
    remove
  }
})
