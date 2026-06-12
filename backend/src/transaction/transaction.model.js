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
  underscored: true,
})

module.exports = Transaction
