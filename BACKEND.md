# ⚙️ Backend — Node.js + Express

## Stack

| Tool | Purpose | Install |
|------|---------|---------|
| Node.js | Runtime | - |
| Express.js | Framework | `npm install express` |
| Sequelize | ORM | `npm install sequelize sequelize-cli` |
| mysql2 | MySQL driver | `npm install mysql2` |
| jsonwebtoken | JWT auth | `npm install jsonwebtoken` |
| bcryptjs | Password hashing | `npm install bcryptjs` |
| crypto-js | AES decrypt signature | `npm install crypto-js` |
| dotenv | Env variables | `npm install dotenv` |
| cors | CORS config | `npm install cors` |
| Jest | Test framework | `npm install -D jest` |
| Supertest | HTTP test client | `npm install -D supertest` |

---

## Setup

```bash
cd backend
npm install
cp .env.example .env
# fill in .env values

npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

node app.js
# or
npm run dev   # with nodemon
```

---

## Folder Structure

```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   └── auth.route.js
│   ├── transaction/
│   │   ├── transaction.controller.js
│   │   ├── transaction.model.js
│   │   └── transaction.route.js
│   ├── user/
│   │   ├── user.controller.js
│   │   ├── user.model.js
│   │   └── user.route.js
│   ├── dashboard/
│   │   ├── dashboard.controller.js
│   │   └── dashboard.route.js
│   ├── middleware/
│   │   ├── verifySignature.js
│   │   └── verifyJWT.js
│   └── config/
│       ├── database.js
│       └── crypto.js
├── database/
│   ├── migrations/
│   └── seeders/
├── tests/
│   ├── auth.test.js
│   └── transaction.test.js
├── .env
├── .env.example
├── .sequelizerc
├── package.json
└── app.js
```

---

## .env

```bash
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=pos_transaction
DB_USER=root
DB_PASS=

JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=24h

CRYPTO_SECRET=your-32-char-secret-here
APP_NAME=pos-transaction
APP_VER=1.0.0

BCRYPT_ROUNDS=8
```

---

## Security

### How It Works

```
Every request hits route-level middleware first:

Request
  │
  ├── 1. verifySignature (all routes)
  │      Header: X-App-Signature: AES("pos-transaction:1.0.0")
  │      Mismatch → 403 Forbidden
  │
  ├── 2. verifyJWT (protected routes only)
  │      Header: Authorization: Bearer <token>
  │      Missing/expired → 401 Unauthorized
  │
  └── 3. Controller handles request
```

### src/config/crypto.js

```js
const CryptoJS = require('crypto-js')

const SECRET = process.env.CRYPTO_SECRET

// ── decrypt ──────────────────────────────────────────────────
// Decrypts CryptoJS.AES.encrypt(value, passphrase) from frontend
// Algorithm : AES-256-CBC
// Key derive : EVP_BytesToKey (MD5) — compatible with CryptoJS
function decrypt(encrypted) {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// ── decryptId ────────────────────────────────────────────────
// Decrypts URL-safe Base64 encrypted ID from frontend
function decryptId(encryptedId) {
  const base64 = encryptedId
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
  return parseInt(decrypt(padded))
}

module.exports = { decrypt, decryptId }
```

### src/middleware/verifySignature.js

```js
const { decrypt } = require('../config/crypto')

module.exports = (req, res, next) => {
  const signature = req.headers['x-app-signature']

  if (!signature) {
    return res.status(403).json({ success: false, message: 'Forbidden' })
  }

  try {
    const decrypted = decrypt(signature)
    const [name, ver] = decrypted.split(':')

    if (name !== process.env.APP_NAME || ver !== process.env.APP_VER) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    next()
  } catch (e) {
    return res.status(403).json({ success: false, message: 'Forbidden' })
  }
}
```

### src/middleware/verifyJWT.js

```js
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const auth  = req.headers['authorization']
  const token = auth && auth.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Token expired or invalid' })
  }
}
```

---

---

## Models

### src/transaction/transaction.model.js

```js
const { DataTypes } = require('sequelize')
const sequelize     = require('../config/database')

const Transaction = sequelize.define('Transaction', {
  kode:            { type: DataTypes.STRING(20), unique: true },
  tanggal:         { type: DataTypes.DATE },
  product_id:      { type: DataTypes.INTEGER },
  harga_satuan:    { type: DataTypes.INTEGER },
  quantitas:       { type: DataTypes.INTEGER },
  total_harga:     { type: DataTypes.INTEGER },
  tipe_pembayaran: { type: DataTypes.ENUM('gopay','emoney','shopee','cash') },
  status:          { type: DataTypes.TINYINT, defaultValue: 0 },
}, {
  tableName:  'transactions',
  paranoid:   true,   // soft delete
  timestamps: true,
})

module.exports = Transaction
```

### src/user/user.model.js

```js
const { DataTypes } = require('sequelize')
const sequelize     = require('../config/database')

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING(100), unique: true },
  password: { type: DataTypes.STRING(255) },
}, {
  tableName:  'users',
  paranoid:   true,
  timestamps: true,
})

module.exports = User
```

### src/product/product.model.js

```js
const { DataTypes } = require('sequelize')
const sequelize     = require('../config/database')

const Product = sequelize.define('Product', {
  nama_produk: { type: DataTypes.STRING(100), allowNull: false },
  harga:       { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName:  'products',
  paranoid:   true,
  timestamps: true,
})

module.exports = Product
```

---

## Controllers

### src/auth/auth.controller.js

```js
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const User   = require('../user/user.model')

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ where: { username } })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    return res.json({ success: true, message: 'Login success', data: { token } })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}
```

### src/transaction/transaction.controller.js

```js
const crypto       = require('crypto')
const Transaction  = require('./transaction.model')
const Product      = require('../product/product.model')
const { Op }       = require('sequelize')

// Generate unique kode T-XXXXXX
async function generateKode() {
  let kode, exists
  do {
    kode   = `T-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
    exists = await Transaction.findOne({ where: { kode } })
  } while (exists)
  return kode
}

exports.index = async (req, res) => {
  try {
    const { from, to } = req.query
    const where = {}

    if (from && to) {
      where.tanggal = { [Op.between]: [new Date(from), new Date(`${to} 23:59:59`)] }
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['tanggal', 'DESC']],
    })

    return res.json({ success: true, data: transactions })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.store = async (req, res) => {
  try {
    const { tanggal, product_id, quantitas, tipe_pembayaran } = req.body

    const product = await Product.findByPk(product_id)
    if (!product) {
      return res.status(400).json({ success: false, message: 'Invalid product_id' })
    }

    const harga_satuan = product.harga
    const kode        = await generateKode()
    const total_harga = harga_satuan * quantitas

    const transaction = await Transaction.create({
      kode, tanggal, product_id,
      harga_satuan, quantitas, total_harga,
      tipe_pembayaran, status: 0,
    })

    return res.status(201).json({ success: true, message: 'Transaction created', data: transaction })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.update = async (req, res) => {
  try {
    const { id }     = req.params
    const transaction = await Transaction.findByPk(id)

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Not found' })
    }

    const { tanggal, product_id, quantitas, tipe_pembayaran } = req.body

    const product = await Product.findByPk(product_id)
    if (!product) {
      return res.status(400).json({ success: false, message: 'Invalid product_id' })
    }

    const harga_satuan = product.harga
    const total_harga  = harga_satuan * quantitas

    await transaction.update({
      tanggal, product_id,
      harga_satuan, quantitas,
      total_harga, tipe_pembayaran,
    })

    return res.json({ success: true, message: 'Transaction updated', data: transaction })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.updateStatus = async (req, res) => {
  try {
    const { id }      = req.params
    const { status }  = req.body
    const transaction = await Transaction.findByPk(id)

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Not found' })
    }

    // Status lock — once complete or failed, cannot change
    if (transaction.status !== 0) {
      return res.status(400).json({ success: false, message: 'Status already finalized' })
    }

    // Only allow complete(1) or failed(2)
    if (![1, 2].includes(Number(status))) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    await transaction.update({ status })
    return res.json({ success: true, message: 'Status updated', data: transaction })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.destroy = async (req, res) => {
  try {
    const { id }      = req.params
    const transaction = await Transaction.findByPk(id)

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Not found' })
    }

    await transaction.destroy() // soft delete via paranoid
    return res.json({ success: true, message: 'Transaction deleted' })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}
```

---

## Routes

### src/auth/auth.route.js

```js
const router     = require('express').Router()
const controller = require('./auth.controller')
const verify     = require('../middleware/verifySignature')

router.post('/login', verify, controller.login)

module.exports = router
```

### src/transaction/transaction.route.js

```js
const router     = require('express').Router()
const controller = require('./transaction.controller')
const verify     = require('../middleware/verifySignature')
const verifyJWT  = require('../middleware/verifyJWT')

router.use(verify)
router.use(verifyJWT)

router.get('/',              controller.index)
router.post('/',             controller.store)
router.put('/:id',           controller.update)
router.patch('/:id/status',  controller.updateStatus)
router.delete('/:id',        controller.destroy)

module.exports = router
```

---

## app.js

```js
require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const authRoute        = require('./src/auth/auth.route')
const transactionRoute = require('./src/transaction/transaction.route')
const productRoute     = require('./src/product/product.route')
const userRoute        = require('./src/user/user.route')
const dashboardRoute   = require('./src/dashboard/dashboard.route')

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth',         authRoute)
app.use('/api/transactions', transactionRoute)
app.use('/api/products',     productRoute)
app.use('/api/users',        userRoute)
app.use('/api/dashboard',    dashboardRoute)

module.exports = app

if (require.main === module) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}
```

---

## API Response Standard

```json
{ "success": true,  "message": "...", "data": { ... } }
{ "success": false, "message": "..." }
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Signature | Login |
| GET | `/api/transactions?from=&to=` | Signature + JWT | List with date filter |
| POST | `/api/transactions` | Signature + JWT | Create |
| PUT | `/api/transactions/:id` | Signature + JWT | Update |
| PATCH | `/api/transactions/:id/status` | Signature + JWT | Update status only |
| DELETE | `/api/transactions/:id` | Signature + JWT | Soft delete |
| GET | `/api/users` | Signature + JWT | List users |
| POST | `/api/users` | Signature + JWT | Add user |
| DELETE | `/api/users/:id` | Signature + JWT | Soft delete user |
| GET | `/api/dashboard` | Signature + JWT | Summary stats |

---

## Jest Tests

### tests/auth.test.js

```js
const request = require('supertest')
const app     = require('../app')

const SIGNATURE = 'encrypted-signature-here' // generate in test setup

describe('Auth', () => {
  test('POST /login success → returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('X-App-Signature', SIGNATURE)
      .send({ username: 'admin', password: 'Admin123@' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.token).toBeDefined()
  })

  test('POST /login wrong password → 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('X-App-Signature', SIGNATURE)
      .send({ username: 'admin', password: 'wrongpassword' })

    expect(res.status).toBe(401)
  })

  test('POST /login no signature → 403', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'Admin123@' })

    expect(res.status).toBe(403)
  })
})
```

### tests/transaction.test.js

```js
describe('Transactions', () => {
  test('POST /transactions → kode starts with T-', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('X-App-Signature', SIGNATURE)
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({
        tanggal: '2025-06-01 10:00:00',
        jenis_produk: 'oli',
        quantitas: 2,
        tipe_pembayaran: 'cash',
      })

    expect(res.status).toBe(201)
    expect(res.body.data.kode).toMatch(/^T-[A-F0-9]{6}$/)
    expect(res.body.data.total_harga).toBe(40000) // 20000 × 2
    expect(res.body.data.status).toBe(0)          // default pending
  })

  test('GET /transactions → date filter works', async () => {
    const res = await request(app)
      .get('/api/transactions?from=2025-06-01&to=2025-06-30')
      .set('X-App-Signature', SIGNATURE)
      .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  test('PATCH /transactions/:id/status → pending to complete', async () => {
    const res = await request(app)
      .patch(`/api/transactions/${TRANSACTION_ID}/status`)
      .set('X-App-Signature', SIGNATURE)
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ status: 1 })

    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe(1)
  })

  test('PATCH /transactions/:id/status → complete is locked', async () => {
    const res = await request(app)
      .patch(`/api/transactions/${TRANSACTION_ID}/status`)
      .set('X-App-Signature', SIGNATURE)
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ status: 2 })

    expect(res.status).toBe(400) // already finalized
  })

  test('DELETE /transactions/:id → soft delete', async () => {
    const res = await request(app)
      .delete(`/api/transactions/${TRANSACTION_ID}`)
      .set('X-App-Signature', SIGNATURE)
      .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)

    // Should not appear in list anymore
    const list = await request(app)
      .get('/api/transactions')
      .set('X-App-Signature', SIGNATURE)
      .set('Authorization', `Bearer ${TOKEN}`)

    const found = list.body.data.find(t => t.id === TRANSACTION_ID)
    expect(found).toBeUndefined()
  })
})
```

---

## Security Checklist

- [x] X-App-Signature header required on all routes
- [x] JWT required on all protected routes
- [x] Passwords bcrypt hashed (rounds: 8 dev)
- [x] Status transition locked once finalized
- [x] Soft delete — data never lost
- [x] Total harga calculated on backend — never trusted from frontend
- [x] Harga satuan pulled from config — never trusted from frontend
- [x] CORS restricted to frontend origin
