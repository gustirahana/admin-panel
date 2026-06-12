const router     = require('express').Router()
const controller = require('./dashboard.controller')
const verify     = require('../middleware/verifySignature')
const verifyJWT  = require('../middleware/verifyJWT')

router.use(verify)
router.use(verifyJWT)

router.get('/', controller.index)

module.exports = router
