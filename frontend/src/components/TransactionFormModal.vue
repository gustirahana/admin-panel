<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-black bg-opacity-75" @click="$emit('close')"></div>
      
      <!-- Modal Content -->
      <div class="relative inline-block align-bottom bg-gray-900 border border-gray-800 rounded-xl text-left shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-4xl max-h-[90vh] flex flex-col">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 rounded-t-xl shrink-0">
          <div>
            <h3 class="text-xl font-bold text-gray-100">{{ isEditMode ? 'Edit Transaction' : 'New Transaction' }}</h3>
            <p class="text-gray-400 text-sm mt-1">Search products to add to your cart.</p>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoadingData" class="flex justify-center items-center h-64 shrink-0">
          <svg class="animate-spin h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <!-- Body -->
        <div v-else class="p-6 flex flex-col flex-1 overflow-y-auto custom-scrollbar">
          
          <!-- Autocomplete Search -->
          <div class="mb-6 relative z-10 shrink-0">
            <label class="block text-sm font-medium text-gray-300 mb-2">Search Product</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                v-model="searchQuery"
                @focus="showDropdown = true"
                @blur="hideDropdownDelayed"
                placeholder="Type product name (e.g. RTX 4090)..."
                class="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              >
              
              <!-- Dropdown -->
              <div v-if="showDropdown && filteredProducts.length > 0" class="absolute w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-20 custom-scrollbar">
                <div 
                  v-for="product in filteredProducts" 
                  :key="product.id"
                  @click="addToCart(product)"
                  class="px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors flex justify-between items-center border-b border-gray-700/50 last:border-0"
                  :class="{ 'opacity-50 cursor-not-allowed': product.qty <= 0 }"
                >
                  <div>
                    <div class="font-medium text-gray-200">{{ product.nama_produk }}</div>
                    <div class="text-xs text-gray-500">Stock: {{ product.qty }}</div>
                  </div>
                  <div class="text-cyan-400 font-bold text-sm">
                    Rp {{ product.harga.toLocaleString('id-ID') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Cart -->
          <div class="flex flex-col mt-4">
            <h3 class="text-lg font-bold text-gray-200 mb-4">Cart Items</h3>
            
            <div class="space-y-3 bg-gray-800/20 rounded-lg border border-gray-800 p-4 min-h-[150px]">
              <div v-if="cart.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Search products to add them
              </div>
              
              <div v-for="(item, index) in cart" :key="item.product.id" class="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700">
                <div class="flex-1 min-w-0 pr-4">
                  <h4 class="font-medium text-gray-200 truncate">{{ item.product.nama_produk }}</h4>
                  <div class="text-sm text-gray-500">@ Rp {{ item.product.harga.toLocaleString('id-ID') }}</div>
                </div>
                
                <div class="flex items-center space-x-4 shrink-0">
                  <div class="flex items-center space-x-1 bg-gray-900 rounded-lg border border-gray-700 p-1">
                    <button @click="updateQty(index, -1)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">-</button>
                    <input 
                      type="number" 
                      v-model.number="item.qty" 
                      @change="validateQty(index)"
                      class="w-10 h-6 bg-transparent text-center text-gray-200 font-medium focus:outline-none appearance-none text-sm"
                      min="1"
                    >
                    <button @click="updateQty(index, 1)" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">+</button>
                  </div>
                  
                  <div class="w-24 text-right">
                    <div class="font-bold text-cyan-400 text-sm">Rp {{ (item.product.harga * item.qty).toLocaleString('id-ID') }}</div>
                  </div>

                  <button @click="removeFromCart(index)" class="text-gray-500 hover:text-red-400 p-1 transition-colors" title="Remove Item">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer / Checkout -->
          <div class="mt-8 pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
              <select v-model="tipePembayaran" required class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all">
                <option value="" disabled>-- Select Payment --</option>
                <option value="cash">Cash</option>
                <option value="gopay">GoPay</option>
                <option value="shopee">ShopeePay</option>
                <option value="emoney">E-Money</option>
              </select>
            </div>
            
            <div class="space-y-3">
              <div class="flex justify-between items-center bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <span class="text-gray-400 font-medium text-sm">Grand Total</span>
                <span class="text-2xl font-bold text-green-400">Rp {{ grandTotal.toLocaleString('id-ID') }}</span>
              </div>
              
              <button 
                @click="submitCart" 
                :disabled="transactionStore.loading || cart.length === 0 || !tipePembayaran"
                class="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg v-if="transactionStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ transactionStore.loading ? 'Processing...' : (isEditMode ? 'Update Transaction' : 'Complete Checkout') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { useProductStore } from '@/stores/product'
import { useToastStore } from '@/stores/toast'

const props = defineProps({
  isOpen: Boolean,
  trxId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'refresh'])

const transactionStore = useTransactionStore()
const productStore = useProductStore()
const toastStore = useToastStore()

const cart = ref([])
const tipePembayaran = ref('')

const isEditMode = computed(() => !!props.trxId)
const isLoadingData = ref(false)

const searchQuery = ref('')
const showDropdown = ref(false)

onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchAll()
  }
})

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    cart.value = []
    tipePembayaran.value = ''
    searchQuery.value = ''
    
    if (isEditMode.value) {
      isLoadingData.value = true
      try {
        const trx = await transactionStore.fetchById(props.trxId)
        tipePembayaran.value = trx.tipe_pembayaran
        
        cart.value = trx.details.map(d => {
          const storeProduct = productStore.products.find(p => p.id === d.product_id)
          if (storeProduct) {
            storeProduct.qty += d.quantitas
          }
          return {
            product: storeProduct || { ...d.product, qty: d.quantitas },
            qty: d.quantitas
          }
        })
      } catch (e) {
        toastStore.showToast('Failed to load transaction data', 'error')
        emit('close')
      } finally {
        isLoadingData.value = false
      }
    }
  }
})

const filteredProducts = computed(() => {
  if (!searchQuery.value) return productStore.products
  const query = searchQuery.value.toLowerCase()
  return productStore.products.filter(p => p.nama_produk.toLowerCase().includes(query))
})

const hideDropdownDelayed = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const grandTotal = computed(() => {
  return cart.value.reduce((total, item) => total + (item.product.harga * item.qty), 0)
})

const addToCart = (product) => {
  if (product.qty <= 0) return

  const existing = cart.value.find(item => item.product.id === product.id)
  if (existing) {
    if (existing.qty < product.qty) {
      existing.qty++
      toastStore.showToast(`Increased quantity of ${product.nama_produk}`, 'success')
    } else {
      toastStore.showToast('Maximum stock reached for this item', 'error')
    }
  } else {
    cart.value.push({
      product,
      qty: 1
    })
    toastStore.showToast(`${product.nama_produk} added to cart`, 'success')
  }
  
  searchQuery.value = ''
  showDropdown.value = false
}

const validateQty = (index) => {
  const item = cart.value[index]
  if (item.qty <= 0) {
    item.qty = 1
  }
  if (item.qty > item.product.qty) {
    item.qty = item.product.qty
    toastStore.showToast(`Only ${item.product.qty} units available`, 'error')
  }
}

const updateQty = (index, delta) => {
  const item = cart.value[index]
  const newQty = item.qty + delta
  
  if (newQty <= 0) {
    item.qty = 1
  } else if (newQty > item.product.qty) {
    toastStore.showToast('Not enough stock available', 'error')
  } else {
    item.qty = newQty
  }
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
}

const submitCart = async () => {
  try {
    const payload = {
      tipe_pembayaran: tipePembayaran.value,
      items: cart.value.map(item => ({
        encrypted_product_id: item.product.id,
        qty: item.qty
      }))
    }
    
    if (isEditMode.value) {
      await transactionStore.update(props.trxId, payload)
      toastStore.showToast('Transaction successfully updated', 'success')
    } else {
      await transactionStore.create(payload)
      toastStore.showToast('Transaction successfully completed', 'success')
    }
    
    emit('refresh')
    emit('close')
  } catch (e) {
    toastStore.showToast(transactionStore.error, 'error')
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5); 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.8); 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 1); 
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
