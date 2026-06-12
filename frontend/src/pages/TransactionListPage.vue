<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-100">Transactions</h2>
        <p class="text-gray-400 text-sm mt-1">View and manage all sales transactions.</p>
      </div>
      <button @click="openAddModal" class="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-cyan-900/20 whitespace-nowrap text-center">
        + New Transaction
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-gray-900 rounded-xl p-4 border border-gray-800 flex flex-col sm:flex-row items-end gap-4">
      <div class="w-full sm:w-auto">
        <label class="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
        <input type="date" v-model="filters.startDate" :max="today" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500">
      </div>
      <div class="w-full sm:w-auto">
        <label class="block text-sm font-medium text-gray-400 mb-1">End Date</label>
        <input type="date" v-model="filters.endDate" :max="today" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500">
      </div>
      <div class="flex gap-2 w-full sm:w-auto">
        <button @click="applyFilters" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg transition-colors font-medium w-full sm:w-auto">
          Filter
        </button>
        <button v-if="hasActiveFilters" @click="clearFilters" class="px-4 py-2 bg-transparent hover:bg-red-900/30 text-red-400 hover:text-red-300 border border-red-900/50 rounded-lg transition-colors font-medium w-full sm:w-auto">
          Clear
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-gray-900 rounded-xl shadow-lg border border-gray-800 flex flex-col">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-800">
        <thead class="bg-gray-800 border-b border-gray-700">
          <tr>
            <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Kode</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tanggal Transaksi</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Jenis Produk</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantitas</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Harga</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipe Pembayaran</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-gray-900 divide-y divide-gray-800">
          <tr v-if="transactionStore.loading && transactionStore.transactions.length === 0" v-for="i in 3" :key="'skel'+i" class="animate-pulse">
            <td class="px-6 py-6" colspan="8"><div class="h-4 bg-gray-800 rounded w-full"></div></td>
          </tr>
          <tr v-else-if="transactionStore.transactions.length === 0">
            <td colspan="8" class="px-6 py-12 text-center text-gray-500">No transactions found.</td>
          </tr>
          <tr v-for="(trx, index) in paginatedTransactions" :key="trx.id" class="hover:bg-gray-800 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-cyan-400">{{ trx.kode }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{{ formatDate(trx.tanggal) }}</td>
            <td class="px-6 py-4 text-sm text-gray-200">
              <span class="line-clamp-2" :title="getProductNameSummary(trx)">{{ getProductNameSummary(trx) }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ getTotalQty(trx) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400">Rp {{ (trx.total_harga || 0).toLocaleString('id-ID') }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">{{ trx.tipe_pembayaran }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span v-if="trx.status === 0" class="px-2 py-1 bg-yellow-900/50 text-yellow-500 rounded-md text-xs font-semibold">Pending</span>
              <span v-else-if="trx.status === 1" class="px-2 py-1 bg-green-900/50 text-green-400 rounded-md text-xs font-semibold">Complete</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button @click="openInvoiceModal(trx)" class="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Invoice
                </button>
                <button v-if="trx.status === 0" @click="openEditModal(trx)" class="px-3 py-1.5 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-800/50 text-cyan-400 rounded transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      
      <!-- Pagination Controls -->
      <div v-if="transactionStore.transactions.length > 0" class="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-800 bg-gray-900/50">
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

    <!-- Invoice Modal -->
    <div v-if="showInvoiceModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeInvoiceModal"></div>
      <div class="relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h3 class="text-xl font-bold text-gray-100">Transaction Invoice</h3>
            <p class="text-sm font-mono text-cyan-400 mt-1">{{ selectedTrx?.kode }}</p>
          </div>
          <button @click="closeInvoiceModal" class="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1">
          <div class="flex justify-between mb-6 text-sm text-gray-400">
            <div>
              <p>Date: <span class="text-gray-200">{{ formatDate(selectedTrx?.tanggal) }}</span></p>
              <p>Payment: <span class="text-gray-200 capitalize">{{ selectedTrx?.tipe_pembayaran }}</span></p>
            </div>
            <div class="text-right">
              <p>Status: 
                <span v-if="selectedTrx?.status === 0" class="text-yellow-500 font-semibold">Pending</span>
                <span v-else-if="selectedTrx?.status === 1" class="text-green-400 font-semibold">Complete</span>
              </p>
            </div>
          </div>

          <table class="w-full text-sm text-left text-gray-300">
            <thead class="text-xs text-gray-400 uppercase bg-gray-800/50">
              <tr>
                <th class="px-4 py-3 rounded-tl-lg">Item</th>
                <th class="px-4 py-3 text-right">Price</th>
                <th class="px-4 py-3 text-right">Qty</th>
                <th class="px-4 py-3 text-right rounded-tr-lg">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedTrx?.details" :key="item.id" class="border-b border-gray-800">
                <td class="px-4 py-3 font-medium text-gray-200">{{ item.product?.nama_produk || 'Deleted Item' }}</td>
                <td class="px-4 py-3 text-right">Rp {{ item.harga_satuan.toLocaleString('id-ID') }}</td>
                <td class="px-4 py-3 text-right">{{ item.quantitas }}</td>
                <td class="px-4 py-3 text-right text-cyan-400 font-medium">Rp {{ item.subtotal.toLocaleString('id-ID') }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="px-4 py-4 text-right font-bold text-gray-400">Grand Total</td>
                <td class="px-4 py-4 text-right font-bold text-green-400 text-lg">Rp {{ selectedTrx?.total_harga.toLocaleString('id-ID') }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="p-6 border-t border-gray-800 bg-gray-800/50 flex justify-end space-x-3">
          <button v-if="selectedTrx?.status === 0" @click="openVoidModal(selectedTrx)" class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">Void</button>
          <button v-if="selectedTrx?.status === 0" @click="markComplete(selectedTrx)" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">Mark Paid</button>
          <button @click="closeInvoiceModal" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">Close</button>
        </div>
      </div>
    </div>

    <!-- Void Modal -->
    <div v-if="showVoidModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeVoidModal"></div>
      <div class="relative bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 overflow-hidden">
        <div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-100 mb-4">Hapus Transaksi</h3>
          <p class="text-sm text-gray-300">
            Apakah anda yakin ingin menghapus transaksi <span class="font-bold font-mono text-cyan-400">{{ selectedTrx?.kode }}</span>? 
            Stok barang akan dikembalikan ke inventory. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div class="flex justify-end space-x-3">
          <button @click="closeVoidModal" class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Batal</button>
          <button @click="confirmVoid" :disabled="transactionStore.loading" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50">
            {{ transactionStore.loading ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Transaction Form Modal -->
    <TransactionFormModal 
      :isOpen="showFormModal" 
      :trxId="editTrxId" 
      @close="showFormModal = false" 
      @refresh="transactionStore.fetchAll()" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { useToastStore } from '@/stores/toast'
import TransactionFormModal from '@/components/TransactionFormModal.vue'

const transactionStore = useTransactionStore()
const toastStore = useToastStore()

// Form Modal Logic
const showFormModal = ref(false)
const editTrxId = ref(null)

const openAddModal = () => {
  editTrxId.value = null
  showFormModal.value = true
}

const openEditModal = (trx) => {
  editTrxId.value = trx.id
  showFormModal.value = true
}

// Filters
const filters = ref({
  startDate: '',
  endDate: ''
})

const today = new Date().toISOString().split('T')[0]

const hasActiveFilters = computed(() => filters.value.startDate || filters.value.endDate)

const applyFilters = () => {
  if (!filters.value.startDate || !filters.value.endDate) {
    toastStore.showToast('Please select both Start Date and End Date', 'error')
    return
  }

  const start = new Date(filters.value.startDate)
  const end = new Date(filters.value.endDate)
  
  if (end < start) {
    toastStore.showToast('End Date cannot be earlier than Start Date', 'error')
    return
  }

  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
  
  if (diffDays > 30) {
    toastStore.showToast('Filter range cannot exceed 30 days', 'error')
    return
  }

  const params = {
    startDate: filters.value.startDate,
    endDate: filters.value.endDate
  }
  transactionStore.fetchAll(params)
}

const clearFilters = () => {
  filters.value.startDate = ''
  filters.value.endDate = ''
  transactionStore.fetchAll()
}

// Pagination States
const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() => {
  return Math.ceil(transactionStore.transactions.length / itemsPerPage.value) || 1
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return transactionStore.transactions.slice(start, end)
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// Cart Summary Helpers
const getProductNameSummary = (trx) => {
  if (!trx.details || trx.details.length === 0) return 'No items'
  const names = trx.details.map(d => d.product?.nama_produk || 'Deleted Item')
  if (names.length <= 2) return names.join(', ')
  return `${names[0]}, ${names[1]} + ${names.length - 2} more`
}

const getTotalQty = (trx) => {
  if (!trx.details) return 0
  return trx.details.reduce((sum, d) => sum + d.quantitas, 0)
}

// Invoice Modal Logic
const showInvoiceModal = ref(false)
const openInvoiceModal = (trx) => {
  selectedTrx.value = trx
  showInvoiceModal.value = true
}
const closeInvoiceModal = () => {
  showInvoiceModal.value = false
  if (!showVoidModal.value) selectedTrx.value = null
}

// Void Modal Logic
const showVoidModal = ref(false)
const selectedTrx = ref(null)

const openVoidModal = (trx) => {
  selectedTrx.value = trx
  showVoidModal.value = true
}

const closeVoidModal = () => {
  showVoidModal.value = false
  if (!showInvoiceModal.value) selectedTrx.value = null
}

const confirmVoid = async () => {
  try {
    await transactionStore.remove(selectedTrx.value.id)
    toastStore.showToast('Transaksi berhasil dihapus dan stok dikembalikan', 'success')
    closeVoidModal()
    if (paginatedTransactions.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  } catch (e) {
    toastStore.showToast(transactionStore.error, 'error')
  }
}

const markComplete = async (trx) => {
  try {
    await transactionStore.updateStatus(trx.id, 1)
    toastStore.showToast('Transaksi ditandai sebagai Selesai', 'success')
  } catch (e) {
    toastStore.showToast(transactionStore.error, 'error')
  }
}

onMounted(() => {
  transactionStore.fetchAll()
})
</script>
