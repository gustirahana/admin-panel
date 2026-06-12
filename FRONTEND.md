# 🖥️ Frontend — Vue 3

## Stack

| Tool | Version | Purpose | Install |
|------|---------|---------|---------|
| Vue 3 | latest | UI Framework | included |
| Vite | latest | Dev server + build | included |
| Vue Router 4 | latest | Routing | `npm install vue-router@4` |
| Pinia | latest | State management | `npm install pinia` |
| Axios | latest | HTTP client | `npm install axios` |
| Tailwind CSS | v3 | Styling | `npm install -D tailwindcss postcss autoprefixer` |
| CryptoJS | latest | AES-256-CBC encryption | `npm install crypto-js` |

---

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## .env

```bash
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=pos-transaction
VITE_APP_VER=1.0.0
VITE_CRYPTO_SECRET=your-32-char-secret-here
```

> `VITE_CRYPTO_SECRET` must match `CRYPTO_SECRET` in backend `.env` exactly.

---

## Folder Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.vue
│   │   ├── DashboardPage.vue
│   │   ├── TransactionListPage.vue
│   │   ├── TransactionFormPage.vue    ← handles both add & edit
│   │   ├── ProductsPage.vue
│   │   └── UsersPage.vue
│   ├── components/
│   │   ├── AppSidebar.vue
│   │   ├── DeleteModal.vue
│   │   └── ErrorAlert.vue
│   ├── stores/
│   │   ├── auth.js
│   │   ├── transaction.js
│   │   ├── product.js
│   │   ├── user.js
│   │   └── dashboard.js
│   ├── router/
│   │   └── index.js
│   ├── utils/
│   │   ├── axios.js
│   │   └── crypto.js
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── .env
├── .env.example
├── tailwind.config.js
└── vite.config.js
```

---

## Config Files

### tailwind.config.js
```js
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: { extend: {} },
  plugins: [],
}
```

### src/style.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### src/main.js
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
```

---

## CryptoJS — Encryption

### Algorithm Details

| Property | Value |
|----------|-------|
| Algorithm | AES-256-CBC |
| Key derivation | EVP_BytesToKey (MD5, OpenSSL-compatible) |
| Output | Base64 string |

### src/utils/crypto.js
```js
import CryptoJS from 'crypto-js'

const SECRET   = import.meta.env.VITE_CRYPTO_SECRET
const APP_NAME = import.meta.env.VITE_APP_NAME
const APP_VER  = import.meta.env.VITE_APP_VER

// ── generateSignature ────────────────────────────────────────
// Encrypts APP_NAME:APP_VER → sent as X-App-Signature header
// Regenerated on every request (new salt each time)
export function generateSignature() {
  return CryptoJS.AES.encrypt(
    `${APP_NAME}:${APP_VER}`,
    SECRET
  ).toString()
}

// ── encrypt ──────────────────────────────────────────────────
// Use for: sensitive request body fields
export function encrypt(value) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(value),
    SECRET
  ).toString()
}

// ── encryptId ────────────────────────────────────────────────
// Use for: /{id} in URL — URL-safe Base64
export function encryptId(id) {
  return CryptoJS.AES.encrypt(String(id), SECRET)
    .toString()
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// ── decrypt ──────────────────────────────────────────────────
// Use for: decrypting backend encrypted responses (if needed)
export function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}
```

---

## Axios — HTTP Client

### src/utils/axios.js
```js
import axios from 'axios'
import { generateSignature } from './crypto'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  }
})

// Attach X-App-Signature + Bearer token on every request
api.interceptors.request.use(config => {
  // Regenerate signature each request (new encrypted value)
  config.headers['X-App-Signature'] = generateSignature()

  const token = localStorage.getItem('token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`

  return config
})

// 401 → force logout
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
```

---

## Router

### src/router/index.js
```js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginPage          from '@/pages/LoginPage.vue'
import DashboardPage      from '@/pages/DashboardPage.vue'
import TransactionListPage from '@/pages/TransactionListPage.vue'
import TransactionFormPage from '@/pages/TransactionFormPage.vue'
import ProductsPage       from '@/pages/ProductsPage.vue'
import UsersPage          from '@/pages/UsersPage.vue'

const routes = [
  { path: '/login',              component: LoginPage,          meta: { guest: true } },
  { path: '/',                   component: DashboardPage,      meta: { auth: true } },
  { path: '/transactions',       component: TransactionListPage, meta: { auth: true } },
  { path: '/transactions/add',   component: TransactionFormPage, meta: { auth: true } },
  { path: '/transactions/:id',   component: TransactionFormPage, meta: { auth: true } },
  { path: '/products',           component: ProductsPage,        meta: { auth: true } },
  { path: '/users',              component: UsersPage,           meta: { auth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth  && !auth.isAuthenticated) return '/login'
  if (to.meta.guest && auth.isAuthenticated)  return '/'
})

export default router
```

---

## Pinia Stores

### src/stores/auth.js
```js
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
```

### src/stores/transaction.js
```js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const loading      = ref(false)
  const error        = ref(null)

  async function fetchAll(from = null, to = null) {
    loading.value = true
    error.value   = null
    try {
      const params = {}
      if (from) params.from = from
      if (to)   params.to   = to
      const { data } = await api.get('/transactions', { params })
      transactions.value = data.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to load'
    } finally {
      loading.value = false
    }
  }

  async function create(payload) {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.post('/transactions', payload)
      return data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to create'
    } finally {
      loading.value = false
    }
  }

  async function update(id, payload) {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.put(`/transactions/${id}`, payload)
      return data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to update'
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id, status) {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.patch(`/transactions/${id}/status`, { status })
      return data
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to update status'
    } finally {
      loading.value = false
    }
  }

  async function remove(id) {
    loading.value = true
    error.value   = null
    try {
      await api.delete(`/transactions/${id}`)
      transactions.value = transactions.value.filter(t => t.id !== id)
    } catch (e) {
      error.value = e.response?.data?.message || 'Failed to delete'
    } finally {
      loading.value = false
    }
  }

  return { transactions, loading, error, fetchAll, create, update, updateStatus, remove }
})
```

---

## Pages

### TransactionFormPage.vue — Add & Edit

Detect mode by checking `route.params.id`:

```js
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transaction'
import api from '@/utils/axios'

const route  = useRoute()
const router = useRouter()
const store  = useTransactionStore()

// Mode detection
const isEdit = computed(() => !!route.params.id)

const products = ref([])

const form = ref({
  tanggal:         '',
  product_id:      '',
  harga_satuan:    0,
  quantitas:       1,
  tipe_pembayaran: '',
  status:          null,   // only used in edit mode
})

// Auto-fill harga_satuan when product_id changes
function onProductChange() {
  const selected = products.value.find(p => p.id === form.value.product_id)
  form.value.harga_satuan = selected ? selected.harga : 0
}

// Load existing data in edit mode and fetch products
onMounted(async () => {
  const res = await api.get('/products')
  products.value = res.data.data

  if (isEdit.value) {
    const { data } = await api.get(`/transactions/${route.params.id}`)
    Object.assign(form.value, data.data)
  }
})

async function handleSubmit() {
  if (isEdit.value) {
    await store.update(route.params.id, form.value)
  } else {
    await store.create(form.value)
  }
  router.push('/transactions')
}
```

---

## Sidebar

### AppSidebar.vue — Structure
```
┌────────────────┐
│  Pos         │
│  v1.0.0        │
├────────────────┤
│ 🏠 Dashboard   │
│ 📋 Transaksi   │
│ 🛒 Products    │
│ 👥 Users       │
├────────────────┤
│ 🚪 Logout      │
└────────────────┘
```

---

## Status Badge Colors

```
0 = Pending  → yellow badge
1 = Complete → green badge
2 = Failed   → red badge
```

```vue
<span :class="{
  'bg-yellow-100 text-yellow-700': tx.status === 0,
  'bg-green-100  text-green-700':  tx.status === 1,
  'bg-red-100    text-red-700':    tx.status === 2,
}" class="px-2 py-1 rounded-full text-xs font-medium">
  {{ ['Pending','Complete','Batal'][tx.status] }}
</span>
```

---

## Pages Summary

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Username + password |
| Dashboard | `/` | Summary cards |
| Transaction List | `/transactions` | Table + date filter + delete modal |
| Transaction Form | `/transactions/add` | Add form |
| Transaction Form | `/transactions/:id` | Edit form (same component) |
| Products | `/products` | List + add + edit + soft delete |
| Users | `/users` | List + add + soft delete |

---

## Security

| Layer | What |
|-------|------|
| X-App-Signature | Auto-attached on every request via Axios interceptor |
| JWT Bearer token | Auto-attached from localStorage |
| 401 handler | Auto-logout + redirect to /login |
| Router guard | Auth check before every navigation |

---

## Checklist

- [x] Vue 3 Composition API
- [x] Vite dev server
- [x] Tailwind CSS v3
- [x] Vue Router 4 with auth guard
- [x] Pinia stores (auth, transaction, user, dashboard)
- [x] Axios with X-App-Signature interceptor
- [x] Axios with Bearer token interceptor
- [x] CryptoJS generateSignature() — new signature per request
- [x] 401 auto-logout
- [x] Loading state on all async actions
- [x] Error state on all async actions
- [x] Delete confirmation modal
- [x] TransactionFormPage handles both add & edit
- [x] Harga satuan auto-fills on product select
- [x] Status dropdown only in edit mode
- [x] Status badge colors (pending/complete/failed)
- [x] Sidebar navigation
