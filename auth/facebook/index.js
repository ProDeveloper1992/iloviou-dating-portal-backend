const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get('/', passport.authenticate("facebook"));


router.get('/callback', passport.authenticate('facebook'), (req, res) => {
    console.log("facebook redirect url works")
    return res.status(200).json({
        message: 'Authorized successfully!',
    })
})


module.exports = router;