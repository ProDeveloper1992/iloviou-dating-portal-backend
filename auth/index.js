const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../modules/user/user.model');
const localAuth = require('./local');
const facebookAuth = require('./facebook');
const phoneAuth = require('./phone');

//Passport Configuration
require('./local/passport').setup(User);
require('./facebook/passport').setup(User);
require('./phone/passport').setup();

//Passport User Serialization
passport.serializeUser((user, callback) => {
    callback(null, user.id);
});

//Passport User Deserialization
passport.deserializeUser((id, callback) => {
    User.findById(id, { hashedPassword: 0 }, (err, user) => {
        callback(err, user)
    })
})

//Auth Routes
router.use('/', localAuth);
router.use('/facebook', facebookAuth);
router.use('/phone', phoneAuth);


module.exports = router;