const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const User   = require('../user/user.model')

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ where: { username } })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    return res.json({ success: true, message: 'Login success', data: { token } })
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message })
  }
}
