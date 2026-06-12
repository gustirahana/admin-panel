const { DataTypes } = require('sequelize')
const sequelize     = require('../config/database')

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING(100), unique: true },
  password: { type: DataTypes.STRING(255) },
}, {
  tableName:  'users',
  paranoid:   true,
  timestamps: true,
  underscored: true,
})

module.exports = User
