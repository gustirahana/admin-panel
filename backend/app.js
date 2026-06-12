require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const authRoute        = require('./src/auth/auth.route')
const transactionRoute = require('./src/transaction/transaction.route')
const productRoute     = require('./src/product/product.route')
const userRoute        = require('./src/user/user.route')
const dashboardRoute   = require('./src/dashboard/dashboard.route')

const app = express()

app.use(cors())
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
