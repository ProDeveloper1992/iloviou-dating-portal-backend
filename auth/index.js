const express = require('express');
const router = express.Router();
const User = require('../modules/user/user.model');
const localAuth = require('./local');
const facebookAuth = require('./facebook');

// Passport Configuration
require('./local/passport').setup(User);
require('./facebook/passport').setup(User);

router.use('/', localAuth);
router.use('/facebook', facebookAuth);

module.exports = router;