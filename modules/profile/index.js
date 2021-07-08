const express = require('express');
const router = express.Router();
const controller = require('./profile.controller');
const { isAuthenticated } = require('../../auth/auth.service');

//fetch profile
// router.get('/', isAuthenticated, controller.me);


module.exports = router;