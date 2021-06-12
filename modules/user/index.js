const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const { isAuthenticated } = require('../../auth/auth.service');

//register user
router.post('/register', controller.register);

//fetch profile
router.get('/profile', isAuthenticated, controller.me);

module.exports = router;