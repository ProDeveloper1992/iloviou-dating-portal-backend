const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const { isAuthenticated } = require('../../auth/auth.service');

//fetch user
router.get('/', isAuthenticated, controller.me);

//register user
router.post('/register', controller.register);

//forgot user password
router.get('/request-reset-password', controller.requestResetPassword);

//reset password
router.post('/reset-password', controller.resetPassword);



module.exports = router;