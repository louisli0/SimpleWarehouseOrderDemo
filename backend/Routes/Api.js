const router = require('express').Router();
// API Version
router.use('/v1', require('./V1APIRoutes'));

module.exports = router;
