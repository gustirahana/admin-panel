<template>
  <div class="min-h-screen bg-black text-gray-200 flex items-center justify-center p-4 font-sans relative overflow-hidden">
    
    <!-- Abstract Chrome/Robotic Background Elements -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gray-600/20 blur-[100px] rounded-full mix-blend-screen"></div>
      <!-- Grid lines for a robotic/system feel -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDEwaDQwTTEwIDB2NDAiLz48L2c+PC9zdmc+')] opacity-20"></div>
    </div>

    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-md">
      <div class="backdrop-blur-xl bg-gray-900/60 border border-gray-500/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-2xl p-8 overflow-hidden">
        
        <!-- Chrome Accent Line -->
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-500 via-gray-200 to-gray-500"></div>

        <div class="text-center mb-10">
          <h1 class="text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-500 uppercase">
            Admin Login
          </h1>
          <p class="text-gray-500 mt-2 text-sm tracking-wide">Enter your credentials to continue</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="error" class="bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm text-center shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            {{ error }}
          </div>

          <!-- Username -->
          <div class="relative group">
            <input 
              v-model="username" 
              type="text" 
              id="username" 
              required
              class="w-full bg-black/40 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-transparent focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all peer"
              placeholder="Username"
            />
            <label 
              for="username" 
              class="absolute left-4 -top-2.5 bg-gray-900 px-1 text-xs font-semibold text-gray-400 tracking-wider uppercase transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-400 peer-focus:bg-gray-900">
              Username
            </label>
          </div>

          <!-- Password -->
          <div class="relative group">
            <input 
              v-model="password" 
              type="password" 
              id="password" 
              required
              class="w-full bg-black/40 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-transparent focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all peer"
              placeholder="Password"
            />
            <label 
              for="password" 
              class="absolute left-4 -top-2.5 bg-gray-900 px-1 text-xs font-semibold text-gray-400 tracking-wider uppercase transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-cyan-400 peer-focus:bg-gray-900">
              Password
            </label>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full mt-8 relative overflow-hidden group bg-gray-800 border border-gray-500 text-gray-200 font-bold uppercase tracking-widest py-3 px-4 rounded-lg transition-all hover:border-cyan-400 hover:text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="relative z-10 flex items-center justify-center gap-2">
              <svg v-if="loading" class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </span>
            <!-- Button Hover Metallic Glint -->
            <div class="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-gray-300/20 to-transparent -translate-x-full group-hover:animate-[glint_1s_ease-in-out_infinite]"></div>
          </button>
        </form>

        <!-- Decorative UI elements -->
        <div class="absolute bottom-4 left-4 flex gap-1">
          <div class="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
          <div class="w-1.5 h-1.5 bg-gray-600 rounded-full animate-pulse"></div>
        </div>
        <div class="absolute bottom-4 right-4 text-[10px] text-gray-600 font-mono">
          V1.0.0
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  
  try {
    await authStore.login({ username: username.value, password: password.value })
    router.push('/')
  } catch (err) {
    // If the error response comes from Axios, usually we can grab err.response.data.message
    error.value = err.response?.data?.message || err.message || 'Authentication failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes glint {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
