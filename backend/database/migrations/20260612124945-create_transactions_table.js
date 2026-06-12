'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kode: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      tanggal: {
        type: Sequelize.DATE,
        allowNull: false
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      harga_satuan: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      quantitas: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_harga: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tipe_pembayaran: {
        type: Sequelize.ENUM('gopay', 'emoney', 'shopee', 'cash'),
        allowNull: false
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};
