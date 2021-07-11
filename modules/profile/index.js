const express = require('express');
const router = express.Router();
const controller = require('./profile.controller');
const { isAuthenticated } = require('../../auth/auth.service');

//update swiper profile of user
router.put('/update', isAuthenticated, controller.updateProfile);


module.exports = router;