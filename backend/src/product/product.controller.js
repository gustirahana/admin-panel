const Product = require('./product.model')

exports.index = async (req, res) => {
  try {
    const products = await Product.findAll()
    return res.json({ success: true, data: products })
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

    const product = await Product.create({ nama_produk, harga, qty: qty || 0 })
    return res.status(201).json({ success: true, message: 'Product created', data: product })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { nama_produk, harga, qty } = req.body

    const product = await Product.findByPk(id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Not found' })
    }

    await product.update({ nama_produk, harga, qty })
    return res.json({ success: true, message: 'Product updated', data: product })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}

exports.destroy = async (req, res) => {
  try {
    const { id } = req.params
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
