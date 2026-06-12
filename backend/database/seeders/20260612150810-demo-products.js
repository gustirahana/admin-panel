'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const products = [
      { nama_produk: 'Intel Core i9-14900K', harga: 9500000, qty: 15, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'AMD Ryzen 9 7950X3D', harga: 11000000, qty: 10, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'ASUS ROG Strix Z790-E', harga: 7200000, qty: 25, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'MSI MAG B650 Tomahawk', harga: 3800000, qty: 30, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'Corsair Vengeance DDR5 32GB', harga: 2100000, qty: 50, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'G.Skill Trident Z5 RGB 32GB', harga: 2400000, qty: 45, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'Samsung 990 PRO 2TB NVMe', harga: 3200000, qty: 60, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'WD Black SN850X 1TB', harga: 1800000, qty: 80, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'NVIDIA RTX 4090 24GB', harga: 32000000, qty: 5, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'AMD Radeon RX 7900 XTX', harga: 18500000, qty: 8, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'Corsair RM1000x 1000W Gold', harga: 2800000, qty: 20, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'NZXT Kraken Elite 360mm', harga: 4500000, qty: 15, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'Lian Li O11 Dynamic EVO', harga: 2600000, qty: 18, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'Logitech G Pro X Superlight', harga: 1900000, qty: 40, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'Keychron Q1 Pro Wireless', harga: 2900000, qty: 25, created_at: new Date(), updated_at: new Date() },
      { nama_produk: 'ASUS ROG Swift OLED 27"', harga: 15000000, qty: 12, created_at: new Date(), updated_at: new Date() }
    ];

    await queryInterface.bulkInsert('products', products, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
