const express = require('express');
const router = express.Router();
const controller = require('./upload.controller');
const { isAuthenticated } = require('../../auth/auth.service');
const { upload } = require('../../services/upload');

//fetch user
router.post('/', isAuthenticated, upload, controller.upload);

module.exports = router;