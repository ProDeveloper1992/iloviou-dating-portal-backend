const express = require('express');
const router = express.Router();
const localAuth = require('./local');
const facebookAuth = require('./facebook');

router.use('/', localAuth);
router.use('/facebook', facebookAuth);

module.exports = router;