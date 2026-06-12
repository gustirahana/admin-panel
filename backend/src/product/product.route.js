const router     = require('express').Router()
const controller = require('./product.controller')
const verify     = require('../middleware/verifySignature')
const verifyJWT  = require('../middleware/verifyJWT')

router.use(verify)
router.use(verifyJWT)

router.get('/',       controller.index)
router.post('/',      controller.store)
router.put('/:id',    controller.update)
router.delete('/:id', controller.destroy)

module.exports = router
