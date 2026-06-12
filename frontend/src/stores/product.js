import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const loading  = ref(false)
  const error    = ref(null)

  async function fetchAll() {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.get('/products')
      products.value = data.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to load products'
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.post('/products', payload)
      return data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to create product'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id, payload) {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.put(`/products/${id}`, payload)
      return data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to update product'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id) {
    loading.value = true
    error.value   = null
    try {
      await api.delete(`/products/${id}`)
      products.value = products.value.filter(p => p.id !== id)
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to delete product'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { products, loading, error, fetchAll, create, update, remove }
})
