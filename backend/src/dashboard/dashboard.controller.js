const Transaction = require('../transaction/transaction.model')
const Product     = require('../product/product.model')
const User        = require('../user/user.model')

exports.index = async (req, res) => {
  try {
    const totalTransactions = await Transaction.count()
    const totalProducts     = await Product.count()
    const totalUsers        = await User.count()
    
    const revenueResult = await Transaction.sum('total_harga')
    const totalRevenue  = revenueResult || 0

    return res.json({
      success: true,
      data: {
        totalTransactions,
        totalProducts,
        totalUsers,
        totalRevenue
      }
    })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}
