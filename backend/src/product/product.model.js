const { DataTypes } = require('sequelize')
const sequelize     = require('../config/database')

const Product = sequelize.define('Product', {
  nama_produk: { type: DataTypes.STRING(100), allowNull: false },
  harga:       { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName:  'products',
  paranoid:   true,
  timestamps: true,
  underscored: true,
})

module.exports = Product
