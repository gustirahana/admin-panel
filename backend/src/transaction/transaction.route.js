const router = require('express').Router();
const controller = require('./transaction.controller');
const verify = require('../middleware/verifySignature');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verify);
router.use(verifyJWT);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.store);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
