const router     = require('express').Router()
const controller = require('./auth.controller')
const verify     = require('../middleware/verifySignature')

router.post('/login', verify, controller.login)

module.exports = router
