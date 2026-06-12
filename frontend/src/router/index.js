import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginPage          from '@/pages/LoginPage.vue'
import DashboardPage      from '@/pages/DashboardPage.vue'
import TransactionListPage from '@/pages/TransactionListPage.vue'
import ProductsPage       from '@/pages/ProductsPage.vue'

const routes = [
  { path: '/login',              component: LoginPage,          meta: { guest: true } },
  { path: '/',                   component: DashboardPage,      meta: { auth: true } },
  { path: '/transactions',       component: TransactionListPage, meta: { auth: true } },
  { path: '/products',           component: ProductsPage,        meta: { auth: true } },
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
