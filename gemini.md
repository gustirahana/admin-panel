# 🤖 gemini.md — Agent Rules & TODO

> This file is the source of truth for the AI agent.
> **Update status after every completed task.**
> **Follow git rules strictly — commit after every feature.**

---

## Project Overview

**App:** Pos Transaction App
**Company:** PT Pos Inovasi Indonesia
**Stack:** Node.js + Express + MySQL + Sequelize + Vue 3 + Vite + Tailwind CSS + CryptoJS + JWT
**Repo:** Monorepo — `pos-test/`
**Tests:** Jest + Supertest + GitHub Actions

---

## Agent Rules

### General
- Always read the relevant MD file before starting a feature
- `BACKEND.md` → backend features
- `FRONTEND.md` → frontend features
- `DATABASE.md` → schema and migrations
- Update this file's status after EVERY completed task
- Never skip a task — complete in order listed
- If a task is blocked, mark as `🔴 Blocked` and note why

### Code Rules
- Feature-based folder structure for backend
- Composition API for all Vue components
- No raw SQL — Sequelize ORM only
- No logic in routes — controllers only
- `total_harga` and `harga_satuan` always calculated on backend — never trust frontend values
- All passwords bcrypt hashed
- Always validate input before processing

### Security Rules
- Every route must have `verifySignature` middleware
- Every protected route must have `verifyJWT` middleware
- Status transition must be enforced: pending → complete/failed only, then locked
- Soft delete only — never hard delete

### Git Rules — Strictly Follow
- Commit after EVERY completed feature (not every file)
- Never batch multiple features in one commit
- Use this exact commit format:

```
feat: <what you built>
fix: <what you fixed>
test: <what you tested>
docs: <what you documented>
chore: <setup, config, deps>
```

#### Commit Order to Follow
```
chore: init monorepo structure
chore: setup backend express + sequelize
chore: setup frontend vue3 + vite + tailwind
feat: database migrations and seeders
feat: crypto service and app signature middleware
feat: jwt middleware
feat: auth login endpoint
feat: transaction model
feat: transaction CRUD endpoints
feat: transaction status update endpoint with lock
feat: user CRUD endpoints
feat: dashboard summary endpoint
feat: vue router and pinia setup
feat: axios interceptor with signature and jwt
feat: login page
feat: sidebar component
feat: dashboard page
feat: transaction list page with date filter
feat: transaction form page add and edit
feat: delete confirmation modal
feat: users page
feat: product CRUD endpoints
feat: products page
test: jest auth tests
test: jest transaction tests
chore: github actions ci workflow
docs: update readme
```

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Not Yet |
| 🔄 | On Progress |
| ✅ | Done |
| 🔴 | Blocked |

---

## TODO — Backend

### 🛠️ Setup & Config

| Task | Status |
|------|--------|
| Init backend folder + `npm init` | ✅ |
| Install all dependencies | ✅ |
| Create `.env` + `.env.example` | ✅ |
| Configure `app.js` (express + cors + routes) | ✅ |
| Configure `.sequelizerc` | ✅ |
| Configure `src/config/database.js` | ✅ |
| Configure `src/config/crypto.js` (decrypt + decryptId) | ✅ |
| Configure `src/config/products.js` (price constants) | ✅ |

### 🗄️ Database

| Task | Status |
|------|--------|
| Migration: `create_users_table` | ✅ |
| Migration: `create_transactions_table` | ✅ |
| Seeder: `UserSeeder` (admin / Admin123@) | ✅ |
| Run `npx sequelize-cli db:migrate` | ✅ |
| Run `npx sequelize-cli db:seed:all` | ✅ |

### 🔐 Middleware

| Task | Status |
|------|--------|
| `src/middleware/verifySignature.js` | ✅ |
| `src/middleware/verifyJWT.js` | ✅ |

### 📦 Models

| Task | Status |
|------|--------|
| `src/user/user.model.js` (paranoid: true) | ✅ |
| `src/transaction/transaction.model.js` (paranoid: true) | ✅ |

### 🎮 Auth Feature

| Task | Status |
|------|--------|
| `src/auth/auth.controller.js` (login) | ✅ |
| `src/auth/auth.route.js` | ✅ |
| Wire to `app.js` | ✅ |
| **Git commit:** `feat: auth login endpoint` | ⬜ |

### 💳 Transaction Feature

| Task | Status |
|------|--------|
| `src/transaction/transaction.controller.js` | ⬜ |
| → `index` (list with date filter) | ⬜ |
| → `store` (create + auto-generate kode T-XXXXXX) | ⬜ |
| → `update` (edit, recalc total_harga) | ⬜ |
| → `updateStatus` (pending → complete/failed, lock) | ⬜ |
| → `destroy` (soft delete) | ⬜ |
| `src/transaction/transaction.route.js` | ⬜ |
| Wire to `app.js` | ⬜ |
| **Git commit:** `feat: transaction CRUD endpoints` | ⬜ |
| **Git commit:** `feat: transaction status update endpoint with lock` | ⬜ |

### 👥 User Feature

| Task | Status |
|------|--------|
| `src/user/user.controller.js` | ⬜ |
| → `index` (list users) | ⬜ |
| → `store` (add user with bcrypt) | ⬜ |
| → `destroy` (soft delete) | ⬜ |
| `src/user/user.route.js` | ⬜ |
| Wire to `app.js` | ⬜ |
| **Git commit:** `feat: user CRUD endpoints` | ⬜ |

### 🛒 Product Feature

| Task | Status |
|------|--------|
| `src/product/product.model.js` | ✅ |
| `src/product/product.controller.js` | ⬜ |
| → `index` (list products) | ⬜ |
| → `store` (add product) | ⬜ |
| → `update` (edit product) | ⬜ |
| → `destroy` (soft delete) | ⬜ |
| `src/product/product.route.js` | ⬜ |
| Wire to `app.js` | ⬜ |
| **Git commit:** `feat: product CRUD endpoints` | ⬜ |

### 📊 Dashboard Feature

| Task | Status |
|------|--------|
| `src/dashboard/dashboard.controller.js` | ⬜ |
| → total transactions today | ⬜ |
| → count by status (pending, complete, failed) | ⬜ |
| `src/dashboard/dashboard.route.js` | ⬜ |
| Wire to `app.js` | ⬜ |
| **Git commit:** `feat: dashboard summary endpoint` | ⬜ |

---

## TODO — Frontend

### 🛠️ Setup & Config

| Task | Status |
|------|--------|
| Scaffold Vue 3 project (`npm create vue@latest`) | ✅ |
| Install dependencies (vue-router, pinia, axios, crypto-js) | ✅ |
| Install Tailwind CSS v3 | ✅ |
| Configure `tailwind.config.js` | ✅ |
| Configure `src/style.css` | ✅ |
| Configure `src/main.js` (Pinia + Router) | ✅ |
| Configure `.env` (VITE_API_URL, VITE_APP_NAME, VITE_APP_VER, VITE_CRYPTO_SECRET) | ✅ |
| **Git commit:** `chore: setup frontend vue3 + vite + tailwind` | ⬜ |

### 🔧 Utilities

| Task | Status |
|------|--------|
| `src/utils/crypto.js` (generateSignature, encrypt, encryptId, decrypt) | ✅ |
| `src/utils/axios.js` (X-App-Signature + Bearer + 401 handler) | ✅ |
| **Git commit:** `feat: axios interceptor with signature and jwt` | ⬜ |

### 🌐 Router

| Task | Status |
|------|--------|
| `src/router/index.js` — all routes defined | ⬜ |
| Auth guard (redirect if not logged in) | ⬜ |
| Guest guard (redirect if already logged in) | ⬜ |
| **Git commit:** `feat: vue router and pinia setup` | ⬜ |

### 🏪 Pinia Stores

| Task | Status |
|------|--------|
| `src/stores/auth.js` (login, logout, isAuthenticated) | ✅ |
| `src/stores/transaction.js` (fetchAll, create, update, updateStatus, remove) | ⬜ |
| `src/stores/user.js` (fetchAll, create, remove) | ⬜ |
| `src/stores/dashboard.js` (fetchSummary) | ⬜ |

### 🧩 Components

| Task | Status |
|------|--------|
| `AppSidebar.vue` (nav links, logout) | ⬜ |
| `DeleteModal.vue` (confirm Ya/Batal) | ⬜ |
| `ErrorAlert.vue` | ⬜ |
| **Git commit:** `feat: sidebar component` | ⬜ |

### 📄 Pages

| Task | Status |
|------|--------|
| `LoginPage.vue` (username + password, loading state) | ✅ |
| **Git commit:** `feat: login page` | ⬜ |
| `DashboardPage.vue` (4 summary cards) | ⬜ |
| **Git commit:** `feat: dashboard page` | ⬜ |
| `TransactionListPage.vue` | ⬜ |
| → Date range filter (from/to) | ⬜ |
| → Transaction table (No, Kode, Tanggal, Jenis, Qty, Total, Tipe, Status, Aksi) | ⬜ |
| → Status badge colors | ⬜ |
| → Edit button → /transactions/:id | ⬜ |
| → Delete button → DeleteModal → soft delete | ⬜ |
| **Git commit:** `feat: transaction list page with date filter` | ⬜ |
| `TransactionFormPage.vue` (add & edit) | ⬜ |
| → Detect add/edit mode from route.params.id | ⬜ |
| → Harga satuan auto-fills on product select | ⬜ |
| → Status dropdown only in edit mode | ⬜ |
| → Status options: Complete / Failed (Batal) | ⬜ |
| → Payment method editable in edit mode | ⬜ |
| **Git commit:** `feat: transaction form page add and edit` | ⬜ |
| `UsersPage.vue` | ⬜ |
| → List users table | ⬜ |
| → Add user form | ⬜ |
| → Delete button → soft delete | ⬜ |
| **Git commit:** `feat: users page` | ⬜ |
| `ProductsPage.vue` | ⬜ |
| → List products table | ⬜ |
| → Add product form | ⬜ |
| → Edit product form | ⬜ |
| → Delete button → soft delete | ⬜ |
| **Git commit:** `feat: products page` | ⬜ |

---

## TODO — Tests

| Task | Status |
|------|--------|
| Install Jest + Supertest | ⬜ |
| Configure `jest.config.js` | ⬜ |
| Setup test DB in `.env.test` | ⬜ |
| `tests/auth.test.js` | ⬜ |
| → POST /login success → returns token | ⬜ |
| → POST /login wrong password → 401 | ⬜ |
| → POST /login no signature → 403 | ⬜ |
| `tests/transaction.test.js` | ⬜ |
| → POST /transactions → kode starts with T- | ⬜ |
| → POST /transactions → total_harga correct | ⬜ |
| → GET /transactions → date filter works | ⬜ |
| → PATCH /transactions/:id/status → pending to complete | ⬜ |
| → PATCH /transactions/:id/status → complete is locked | ⬜ |
| → DELETE /transactions/:id → soft delete | ⬜ |
| **Git commit:** `test: jest auth tests` | ⬜ |
| **Git commit:** `test: jest transaction tests` | ⬜ |

---

## TODO — CI/CD

| Task | Status |
|------|--------|
| Create `.github/workflows/test.yml` | ⬜ |
| → Trigger on push | ⬜ |
| → Setup Node.js | ⬜ |
| → Setup MySQL service | ⬜ |
| → Run migrations | ⬜ |
| → Run `npm test` | ⬜ |
| Push to GitHub — verify green checkmark | ⬜ |
| **Git commit:** `chore: github actions ci workflow` | ⬜ |

---

## TODO — README

| Task | Status |
|------|--------|
| Requirements & installation steps | ⬜ |
| How to run (backend + frontend) | ⬜ |
| How to run automated tests | ⬜ |
| App info (features, stack, demo account) | ⬜ |
| **Git commit:** `docs: update readme` | ⬜ |

---

## API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Signature | Login |
| GET | `/api/transactions?from=&to=` | Signature + JWT | List |
| POST | `/api/transactions` | Signature + JWT | Create |
| PUT | `/api/transactions/:id` | Signature + JWT | Update |
| PATCH | `/api/transactions/:id/status` | Signature + JWT | Update status |
| DELETE | `/api/transactions/:id` | Signature + JWT | Soft delete |
| GET | `/api/users` | Signature + JWT | List users |
| POST | `/api/users` | Signature + JWT | Add user |
| DELETE | `/api/users/:id` | Signature + JWT | Soft delete user |
| GET | `/api/dashboard` | Signature + JWT | Summary stats |
| GET | `/api/products` | Signature + JWT | List products |
| POST | `/api/products` | Signature + JWT | Add product |
| PUT | `/api/products/:id` | Signature + JWT | Update product |
| DELETE | `/api/products/:id` | Signature + JWT | Soft delete product |

---

## Demo Accounts

| Username | Password | Note |
|----------|----------|------|
| admin | Admin123@ | Default seeded account |

---

## Status Reference

| Value | Label | Color |
|-------|-------|-------|
| 0 | Pending | Yellow |
| 1 | Complete | Green |
| 2 | Batal (Failed) | Red |

**Transition:** pending → complete or failed → locked (cannot change again)
