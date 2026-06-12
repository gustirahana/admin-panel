const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const auth  = req.headers['authorization']
  const token = auth && auth.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Token expired or invalid' })
  }
}
