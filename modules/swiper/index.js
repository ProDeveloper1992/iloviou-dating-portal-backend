const express = require('express');
const router = express.Router();
const controller = require('./swiper-profile.controller');
const { isAuthenticated } = require('../../auth/auth.service');

//update swiper profile of user
router.put('/profile/update', isAuthenticated, controller.updateSwiperProfile);


module.exports = router;