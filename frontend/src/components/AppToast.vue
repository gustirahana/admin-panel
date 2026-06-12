<template>
  <div class="fixed top-4 right-4 z-[9999] flex flex-col space-y-2 pointer-events-none w-80">
    <TransitionGroup name="toast" tag="div" class="flex flex-col space-y-2">
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id"
        class="bg-gray-900 border border-gray-800 shadow-2xl rounded-lg p-4 flex items-start pointer-events-auto overflow-hidden relative"
      >
        <!-- Color Accent Line -->
        <div 
          class="absolute left-0 top-0 bottom-0 w-1" 
          :class="toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'"
        ></div>

        <!-- Icon -->
        <div class="mr-3 flex-shrink-0 mt-0.5">
          <svg v-if="toast.type === 'success'" class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <svg v-else class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>

        <!-- Message -->
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-200">{{ toast.message }}</p>
        </div>

        <!-- Close Button -->
        <button @click="toastStore.removeToast(toast.id)" class="ml-4 text-gray-500 hover:text-gray-300 focus:outline-none flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'
const toastStore = useToastStore()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}
</style>
