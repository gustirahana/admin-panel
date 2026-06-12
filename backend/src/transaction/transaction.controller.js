const Transaction = require('./transaction.model')
const TransactionDetail = require('./transaction_detail.model')
const Product = require('../product/product.model')
const sequelize = require('../config/database')
const { encryptId, decryptId } = require('../config/crypto')
const { Op } = require('sequelize')

exports.index = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const where = {}

    if (startDate && endDate) {
      where.tanggal = {
        [Op.between]: [new Date(startDate), new Date(endDate + 'T23:59:59.999Z')]
      }
    }

    const transactions = await Transaction.findAll({
      where,
      include: [
        { 
          model: TransactionDetail, 
          as: 'details',
          include: [{ model: Product, as: 'product', attributes: ['id', 'nama_produk', 'harga'] }]
        }
      ],
      order: [['id', 'DESC']]
    })
    
    const data = transactions.map(t => {
      const plain = t.toJSON()
      return {
        ...plain,
        id: encryptId(plain.id),
        details: plain.details.map(d => ({
          ...d,
          id: encryptId(d.id),
          transaction_id: encryptId(d.transaction_id),
          product_id: encryptId(d.product_id),
          product: d.product ? { ...d.product, id: encryptId(d.product.id) } : null
        }))
      }
    })

    return res.json({ success: true, data })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.show = async (req, res) => {
  try {
    const id = decryptId(req.params.id)
    const transaction = await Transaction.findByPk(id, {
      include: [
        { 
          model: TransactionDetail, 
          as: 'details',
          include: [{ model: Product, as: 'product', attributes: ['id', 'nama_produk', 'harga', 'qty'] }]
        }
      ]
    })

    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' })

    const plain = transaction.toJSON()
    plain.id = encryptId(plain.id)
    plain.details = plain.details.map(d => ({
      ...d,
      id: encryptId(d.id),
      transaction_id: encryptId(d.transaction_id),
      product_id: encryptId(d.product_id),
      product: d.product ? { ...d.product, id: encryptId(d.product.id) } : null
    }))

    return res.json({ success: true, data: plain })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.store = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const { items, tipe_pembayaran } = req.body
    
    if (!items || !Array.isArray(items) || items.length === 0 || !tipe_pembayaran) {
      await t.rollback()
      return res.status(400).json({ success: false, message: 'Invalid payload' })
    }

    let grand_total = 0
    const detailsToInsert = []

    for (const item of items) {
      const productId = decryptId(item.encrypted_product_id)
      const qty = Number(item.qty)
      
      const product = await Product.findByPk(productId, { transaction: t })
      if (!product || product.qty < qty) {
        await t.rollback()
        return res.status(400).json({ success: false, message: `Insufficient stock for a selected product.` })
      }

      product.qty -= qty
      await product.save({ transaction: t })

      const subtotal = product.harga * qty
      grand_total += subtotal

      detailsToInsert.push({
        product_id: product.id,
        harga_satuan: product.harga,
        quantitas: qty,
        subtotal
      })
    }

    const transaction = await Transaction.create({
      kode: `TRX-${Date.now()}`,
      tanggal: new Date(),
      total_harga: grand_total,
      tipe_pembayaran
    }, { transaction: t })

    const detailsWithTrxId = detailsToInsert.map(d => ({ ...d, transaction_id: transaction.id }))
    await TransactionDetail.bulkCreate(detailsWithTrxId, { transaction: t })

    await t.commit()
    return res.status(201).json({ success: true, message: 'Transaction successful' })
  } catch (e) {
    await t.rollback()
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.update = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const id = decryptId(req.params.id)
    const { items, tipe_pembayaran, status } = req.body

    const transaction = await Transaction.findByPk(id, {
      include: [{ model: TransactionDetail, as: 'details' }],
      transaction: t
    })

    if (!transaction) {
      await t.rollback()
      return res.status(404).json({ success: false, message: 'Transaction not found' })
    }

    // Handle partial update (e.g. status only)
    if (status !== undefined && !items) {
      transaction.status = status
      await transaction.save({ transaction: t })
      await t.commit()
      return res.json({ success: true, message: 'Transaction updated successfully' })
    }

    // Normal full update (Cart Items)
    if (!items || !Array.isArray(items) || items.length === 0 || !tipe_pembayaran) {
      await t.rollback()
      return res.status(400).json({ success: false, message: 'Invalid payload' })
    }

    // 1. Refund old stock
    for (const detail of transaction.details) {
      const product = await Product.findByPk(detail.product_id, { transaction: t })
      if (product) {
        product.qty += detail.quantitas
        await product.save({ transaction: t })
      }
    }

    // 2. Delete old details
    await TransactionDetail.destroy({ where: { transaction_id: transaction.id }, transaction: t })

    // 3. Process new items
    let grand_total = 0
    const detailsToInsert = []

    for (const item of items) {
      const productId = decryptId(item.encrypted_product_id)
      const qty = Number(item.qty)
      
      const product = await Product.findByPk(productId, { transaction: t })
      if (!product || product.qty < qty) {
        await t.rollback()
        return res.status(400).json({ success: false, message: `Insufficient stock for a selected product.` })
      }

      product.qty -= qty
      await product.save({ transaction: t })

      const subtotal = product.harga * qty
      grand_total += subtotal

      detailsToInsert.push({
        transaction_id: transaction.id,
        product_id: product.id,
        harga_satuan: product.harga,
        quantitas: qty,
        subtotal
      })
    }

    // 4. Update header & insert new details
    transaction.total_harga = grand_total
    transaction.tipe_pembayaran = tipe_pembayaran
    await transaction.save({ transaction: t })

    await TransactionDetail.bulkCreate(detailsToInsert, { transaction: t })

    await t.commit()
    return res.json({ success: true, message: 'Transaction updated successfully' })
  } catch (e) {
    await t.rollback()
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.destroy = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const id = decryptId(req.params.id)
    const transaction = await Transaction.findByPk(id, {
      include: [{ model: TransactionDetail, as: 'details' }],
      transaction: t 
    })
    
    if (!transaction) {
      await t.rollback()
      return res.status(404).json({ success: false, message: 'Transaction not found' })
    }

    for (const detail of transaction.details) {
      const product = await Product.findByPk(detail.product_id, { transaction: t })
      if (product) {
        product.qty += detail.quantitas
        await product.save({ transaction: t })
      }
    }

    await transaction.destroy({ transaction: t })
    await t.commit()

    return res.json({ success: true, message: 'Transaction voided successfully' })
  } catch (e) {
    await t.rollback()
    return res.status(500).json({ success: false, message: e.message })
  }
}
