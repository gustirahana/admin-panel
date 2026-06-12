const Product = require('./product.model')
const { decryptId, encryptId } = require('../config/crypto')

exports.index = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['id', 'DESC']] })
    
    // Encrypt IDs before sending to frontend
    const data = products.map(p => {
      const plain = p.toJSON()
      return { ...plain, id: encryptId(plain.id) }
    })
    
    return res.json({ success: true, data })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.store = async (req, res) => {
  try {
    const { nama_produk, harga, qty } = req.body
    if (!nama_produk || harga == null) {
      return res.status(400).json({ success: false, message: 'nama_produk and harga are required' })
    }

    const parsedQty = Number(qty) || 0
    const product = await Product.create({ nama_produk, harga: Number(harga), qty: parsedQty })
    
    const plain = product.toJSON()
    plain.id = encryptId(plain.id)
    
    return res.status(201).json({ success: true, message: 'Product created', data: plain })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.update = async (req, res) => {
  try {
    const encryptedId = req.params.id
    const id = decryptId(encryptedId)
    console.log('Update PATCH Hit! Encrypted:', encryptedId, 'Decrypted:', id)
    
    const { nama_produk, harga, qty } = req.body

    const product = await Product.findByPk(id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Not found' })
    }

    const parsedQty = qty !== undefined ? Number(qty) : product.qty
    await product.update({ 
      nama_produk: nama_produk || product.nama_produk, 
      harga: harga !== undefined ? Number(harga) : product.harga, 
      qty: parsedQty 
    })
    
    const plain = product.toJSON()
    plain.id = encryptId(plain.id)

    return res.json({ success: true, message: 'Product updated', data: plain })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.destroy = async (req, res) => {
  try {
    const id = decryptId(req.params.id)
    const product = await Product.findByPk(id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Not found' })
    }

    await product.destroy() // soft delete via paranoid
    return res.json({ success: true, message: 'Product deleted' })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}
