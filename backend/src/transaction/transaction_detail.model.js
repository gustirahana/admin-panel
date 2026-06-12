const { DataTypes } = require('sequelize')
const sequelize     = require('../config/database')

const TransactionDetail = sequelize.define('TransactionDetail', {
  transaction_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id:     { type: DataTypes.INTEGER, allowNull: false },
  harga_satuan:   { type: DataTypes.INTEGER, allowNull: false },
  quantitas:      { type: DataTypes.INTEGER, allowNull: false },
  subtotal:       { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName:  'transaction_details',
  timestamps: true,
  underscored: true,
})

module.exports = TransactionDetail
