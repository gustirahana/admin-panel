# Admin Panel Transaction App

Aplikasi Point of Sale (POS) sederhana dan responsif yang dirancang untuk mengelola inventaris produk dan melacak transaksi penjualan. Aplikasi ini menggunakan arsitektur modern dengan pemisahan antara frontend (Vue.js) dan backend (Node.js/Express) serta MySQL untuk penyimpanan data.

## Fitur Utama
- **Dashboard Analitik**: Ringkasan total pendapatan, jumlah transaksi, dan performa penjualan.
- **Manajemen Produk**: Sistem CRUD untuk inventaris barang (Nama, Harga, Stok).
- **Sistem POS & Keranjang**: Pencarian produk, penambahan ke keranjang, dan perhitungan total secara real-time.
- **Transaksi Dinamis**: Riwayat transaksi, cetak invoice, dan kemampuan "Void" (batal transaksi) yang secara otomatis mengembalikan stok inventaris.
- **Keamanan Data**: Menggunakan enkripsi untuk ID Transaksi untuk menghindari akses tidak sah (`ID Enumeration/Insecure Direct Object Reference`).

---

## 1. Requirements & Cara Instalasi

Aplikasi ini menggunakan **Docker** untuk mempermudah proses instalasi dan deployment. Pastikan Anda telah menginstal:
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop)
- *Opsional*: [Node.js (v20+)](https://nodejs.org/) jika ingin menjalankan aplikasi secara lokal tanpa Docker.

---

## 2. Cara Menjalankan Aplikasi

Langkah pertama adalah menyiapkan konfigurasi *environment variables*. Salin file `.env.example` menjadi `.env` di dalam folder `backend` dan `frontend`:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
*(Atau Anda bisa menduplikat file tersebut secara manual dan mengubah namanya menjadi `.env`)*

Setelah itu, jalankan perintah berikut di terminal pada root folder proyek Anda:

```bash
docker compose up -d --build
```

Perintah di atas akan secara otomatis mengunduh dependency, memigrasikan database, dan menjalankan tiga service:
1. **MySQL Database**: Berjalan di port `3306`
2. **Backend API**: Berjalan di port `3000` (Node.js/Express.js)
3. **Frontend Panel**: Berjalan di port `5173` (Vue 3/Vite)

**Akses Aplikasi:**
- Akses frontend di browser: `http://localhost:5173`
- Username default Admin: `admin`
- Password default Admin: `Admin123@`

---

## 3. Cara Menjalankan Automated Test (API & Unit Testing)

Aplikasi backend telah dilengkapi dengan integrasi pengujian (Testing) untuk memastikan endpoint API berfungsi dengan baik dan stok berkurang secara akurat.

Untuk menjalankan *Automated Test* pada Backend:
1. Masuk ke terminal container backend:
   ```bash
   docker exec -it adminpanel-backend sh
   ```
2. Jalankan perintah test:
   ```bash
   npm run test
   ```
   *(Pengujian akan secara otomatis memvalidasi fungsi enkripsi, CRUD produk, dan logika keranjang belanja)*

---

## 4. Informasi Tambahan

### Tech Stack
- **Frontend**: Vue 3, Vite, TailwindCSS, Pinia, Axios, Vue Router.
- **Backend**: Node.js, Express.js, Sequelize (ORM), bcryptjs, CryptoJS.
- **Database**: MySQL 8.0.

### Struktur Proyek
- `/frontend` - Source code antarmuka pengguna
- `/backend` - Source code logika server dan koneksi database
- `docker-compose.yml` - Konfigurasi orkestrasi container

### Keamanan (Security)
- Semua password administrator di-hash menggunakan algoritma **Bcrypt** dengan salt 10-rounds.
- **ID Obfuscation**: ID transaksi yang dikirim ke klien dienkripsi (misal: dari `id: 1` menjadi `U2Fsd...`) menggunakan algoritma `AES-256`. Ini melindungi aplikasi dari upaya *scraping* atau modifikasi ID yang tidak disengaja.
