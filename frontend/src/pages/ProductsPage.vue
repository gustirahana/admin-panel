<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-100">Products Management</h1>
      <button @click="openAddModal" class="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Add Product
      </button>
    </div>

    <!-- Data Table -->
    <div class="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-800">
        <thead class="bg-gray-800 border-b border-gray-700">
          <tr>
            <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product Name</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price (Rp)</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Qty</th>
            <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-gray-900 divide-y divide-gray-800">
          <tr v-if="productStore.loading" v-for="i in 3" :key="'skel'+i" class="animate-pulse">
            <td class="px-6 py-6"><div class="h-4 bg-gray-800 rounded w-48"></div></td>
            <td class="px-6 py-6"><div class="h-4 bg-gray-800 rounded w-24"></div></td>
            <td class="px-6 py-6"><div class="h-4 bg-gray-800 rounded w-full"></div></td>
          </tr>
          <tr v-else-if="productStore.products.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-gray-500">No products found.</td>
          </tr>
          <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-800 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{{ product.nama_produk }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Rp {{ product.harga.toLocaleString('id-ID') }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ (product.qty || 0).toLocaleString('id-ID') }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openEditModal(product)" class="text-cyan-600 hover:text-cyan-900 mr-4 transition-colors">Edit</button>
              <button @click="openDeleteModal(product)" class="text-red-600 hover:text-red-900 transition-colors">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination Controls -->
      <div v-if="productStore.products.length > 0" class="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-800 bg-gray-900/50">
        <div class="flex items-center text-sm text-gray-400 mb-4 sm:mb-0">
          <span>Show</span>
          <select v-model="itemsPerPage" class="mx-2 bg-gray-800 border border-gray-700 text-gray-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-cyan-500">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span>entries</span>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded disabled:opacity-50 hover:bg-gray-700 transition-colors">Prev</button>
          <span class="text-sm text-gray-400 mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded disabled:opacity-50 hover:bg-gray-700 transition-colors">Next</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" @click="closeModal"></div>
        <div class="relative inline-block align-bottom bg-gray-900 border border-gray-800 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div class="bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-xl leading-6 font-bold text-gray-100 mb-6" id="modal-title">
                  {{ isEdit ? 'Edit Product' : 'Add New Product' }}
                </h3>
                <div class="space-y-4 w-full">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
                    <input type="text" v-model="form.nama_produk" class="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-gray-500" placeholder="e.g., Kopi Susu">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Price (Rp)</label>
                    <input type="text" v-model="displayHarga" class="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-gray-500" placeholder="0">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                    <input type="text" v-model="displayQty" class="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-gray-500" placeholder="0">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="saveProduct" :disabled="isSaving" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50">
              {{ isSaving ? 'Saving...' : 'Save Product' }}
            </button>
            <button type="button" @click="closeModal" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-black bg-opacity-75" @click="closeDeleteModal"></div>
        <div class="relative inline-block align-bottom bg-gray-900 border border-gray-800 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div class="bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 border border-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-xl leading-6 font-bold text-gray-100 mb-2">Delete Product</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-400">
                    Are you sure you want to delete <span class="font-bold text-gray-200">{{ selectedProduct?.nama_produk }}</span>? 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="confirmDelete" :disabled="isDeleting" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50">
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
            <button type="button" @click="closeDeleteModal" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useToastStore } from '@/stores/toast'

const productStore = useProductStore()
const toastStore = useToastStore()

// Modal States
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEdit = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)

const selectedProduct = ref(null)

const form = ref({
  nama_produk: '',
  harga: '',
  qty: ''
})

// Pagination States
const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() => {
  return Math.ceil(productStore.products.length / itemsPerPage.value) || 1
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return productStore.products.slice(start, end)
})

// Auto-formatting computed properties
const displayHarga = computed({
  get: () => form.value.harga ? Number(form.value.harga).toLocaleString('id-ID') : '',
  set: (val) => {
    const raw = parseInt(val.replace(/\D/g, ''), 10)
    form.value.harga = isNaN(raw) ? '' : raw
  }
})

const displayQty = computed({
  get: () => form.value.qty ? Number(form.value.qty).toLocaleString('id-ID') : '',
  set: (val) => {
    const raw = parseInt(val.replace(/\D/g, ''), 10)
    form.value.qty = isNaN(raw) ? '' : raw
  }
})

onMounted(() => {
  productStore.fetchAll()
})

function openAddModal() {
  isEdit.value = false
  form.value = { nama_produk: '', harga: '', qty: '' }
  selectedProduct.value = null
  isModalOpen.value = true
}

function openEditModal(product) {
  isEdit.value = true
  selectedProduct.value = product
  form.value = { nama_produk: product.nama_produk, harga: product.harga, qty: product.qty }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

async function saveProduct() {
  isSaving.value = true
  try {
    if (isEdit.value) {
      await productStore.update(selectedProduct.value.id, form.value)
      toastStore.addToast('success', 'Product updated successfully')
    } else {
      await productStore.create(form.value)
      toastStore.addToast('success', 'Product created successfully')
    }
    closeModal()
    productStore.fetchAll() // refresh list
  } catch (e) {
    toastStore.addToast('error', productStore.error || 'Operation failed')
  } finally {
    isSaving.value = false
  }
}

function openDeleteModal(product) {
  selectedProduct.value = product
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  selectedProduct.value = null
}

async function confirmDelete() {
  isDeleting.value = true
  try {
    await productStore.remove(selectedProduct.value.id)
    toastStore.addToast('success', 'Product deleted successfully')
    closeDeleteModal()
  } catch (e) {
    toastStore.addToast('error', productStore.error || 'Failed to delete')
  } finally {
    isDeleting.value = false
  }
}
</script>
