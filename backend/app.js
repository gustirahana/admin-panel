require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const authRoute        = require('./src/auth/auth.route')
const transactionRoute = require('./src/transaction/transaction.route')
const productRoute     = require('./src/product/product.route')
const dashboardRoute   = require('./src/dashboard/dashboard.route')

const app = express()

const Product = require('./src/product/product.model')
const Transaction = require('./src/transaction/transaction.model')
const TransactionDetail = require('./src/transaction/transaction_detail.model')

Transaction.hasMany(TransactionDetail, { foreignKey: 'transaction_id', as: 'details' })
TransactionDetail.belongsTo(Transaction, { foreignKey: 'transaction_id' })

Product.hasMany(TransactionDetail, { foreignKey: 'product_id' })
TransactionDetail.belongsTo(Product, { foreignKey: 'product_id', as: 'product' })

app.use(cors())
app.use(express.json())

app.use('/auth',         authRoute)
app.use('/transactions', transactionRoute)
app.use('/products',     productRoute)
app.use('/dashboard',    dashboardRoute)

module.exports = app

if (require.main === module) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}
