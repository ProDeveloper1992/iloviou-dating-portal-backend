const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const { isAuthenticated } = require('../../auth/auth.service');

//register user
router.post('/register', controller.register);

//forgot user password
// router.post('/forgot-password', isAuthenticated, controller.forgotPassword);

//fetch profile
router.get('/profile', isAuthenticated, controller.me);

router.post('/sendMail', controller.sendMail);

module.exports = router;