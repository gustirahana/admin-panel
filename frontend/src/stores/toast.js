import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let nextId = 1

  function addToast(type, message) {
    const id = nextId++
    toasts.value.push({ id, type, message })
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function showToast(message, type = 'success') {
    addToast(type, message)
  }

  return { toasts, addToast, showToast, removeToast }
})
