const { DataTypes } = require('sequelize')
const sequelize     = require('../config/database')

const Transaction = sequelize.define('Transaction', {
  kode:            { type: DataTypes.STRING(30), unique: true },
  tanggal:         { type: DataTypes.DATE },
  total_harga:     { type: DataTypes.INTEGER, defaultValue: 0 },
  tipe_pembayaran: { type: DataTypes.ENUM('gopay','emoney','shopee','cash') },
  status:          { type: DataTypes.TINYINT, defaultValue: 0 },
}, {
  tableName:  'transactions',
  paranoid:   true,   // soft delete
  timestamps: true,
  underscored: true,
})

module.exports = Transaction
