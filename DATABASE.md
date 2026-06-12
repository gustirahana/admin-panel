# 🗄️ Database — MySQL

## Access Config

### backend/.env
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pos_transaction
DB_USER=root
DB_PASS=
```

---

## Architecture

Single database, no multi-tenant.
All access goes through **Sequelize ORM** with `paranoid: true` for soft delete.

---

## Tables

### `users`
Default admin user seeded on setup.

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| username | VARCHAR(100) UNIQUE | |
| password | VARCHAR(255) | bcrypt hashed |
| deleted_at | TIMESTAMP NULL | soft delete |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

```sql
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### `products`

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| nama_produk | VARCHAR(100) | |
| harga | INT | |
| deleted_at | TIMESTAMP NULL | soft delete |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

```sql
CREATE TABLE products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nama_produk VARCHAR(100) NOT NULL,
  harga       INT NOT NULL,
  deleted_at  TIMESTAMP NULL DEFAULT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### `transactions`

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| kode | VARCHAR(20) UNIQUE | auto-generated T-XXXXXX |
| tanggal | DATETIME | transaction date & time |
| product_id | INT FK | references products(id) |
| harga_satuan | INT | auto-filled from product |
| quantitas | INT | |
| total_harga | INT | stored = harga_satuan × quantitas |
| tipe_pembayaran | ENUM | gopay, emoney, shopee, cash |
| status | TINYINT DEFAULT 0 | 0=pending 1=complete 2=failed |
| deleted_at | TIMESTAMP NULL | soft delete |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

```sql
CREATE TABLE transactions (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  kode            VARCHAR(20) NOT NULL UNIQUE,
  tanggal         DATETIME NOT NULL,
  product_id      INT NOT NULL,
  harga_satuan    INT NOT NULL,
  quantitas       INT NOT NULL,
  total_harga     INT NOT NULL,
  tipe_pembayaran ENUM('gopay','emoney','shopee','cash') NOT NULL,
  status          TINYINT DEFAULT 0,
  deleted_at      TIMESTAMP NULL DEFAULT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

---

## Status Reference

| Value | Label | Description |
|-------|-------|-------------|
| 0 | Pending | Default on create |
| 1 | Complete | Final — cannot change |
| 2 | Failed (Batal) | Final — cannot change |

**Transition rules:**
```
pending (0) → complete (1) ✅
pending (0) → failed   (2) ✅
complete(1) → any          ❌ locked
failed  (2) → any          ❌ locked
```

---

## Soft Delete

Both tables use `paranoid: true` in Sequelize.

```js
// Sequelize model config
{
  paranoid: true,      // handles deleted_at automatically
  timestamps: true,
}
```

- `DELETE` → sets `deleted_at = NOW()`
- `SELECT` → automatically adds `WHERE deleted_at IS NULL`
- Data never physically removed

---

## Auto-generate Kode

```js
const crypto = require('crypto')

function generateKode() {
  return `T-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
}
// → T-A3F9B2
```

Uniqueness enforced by UNIQUE constraint on `kode` column.
If collision (extremely rare) → retry generation.

---

## Sequelize Setup

### src/config/database.js
```js
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host:    process.env.DB_HOST,
    port:    process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
)

module.exports = sequelize
```

---

## Migrations Order

```
1. create_users_table
2. create_products_table
3. create_transactions_table
```

## Seeders Order

```
1. UserSeeder → creates default admin user
```

### Default Admin
```js
{
  username: 'admin',
  password: bcrypt.hashSync('Admin123@', 8)
}
```

---

## Security

- Passwords → bcrypt hashed (rounds: 8 for dev)
- No raw SQL — all queries through Sequelize ORM
- Soft delete — data never lost
- `kode` unique constraint at DB level prevents duplicates
