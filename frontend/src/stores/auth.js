import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/axios'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials) {
    const { data } = await api.post('/auth/login', credentials)
    token.value = data.data.token
    localStorage.setItem('token', data.data.token)
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('token')
  }

  return { user, token, isAuthenticated, login, logout }
})
