const { decrypt } = require('../config/crypto')

module.exports = (req, res, next) => {
  const signature = req.headers['x-app-signature']

  if (!signature) {
    return res.status(403).json({ success: false, message: 'Forbidden' })
  }

  try {
    const decrypted = decrypt(signature)
    const [name, ver] = decrypted.split(':')

    if (name !== process.env.APP_NAME || ver !== process.env.APP_VER) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    next()
  } catch (e) {
    return res.status(403).json({ success: false, message: 'Forbidden' })
  }
}
