const express = require('express');
const passport = require('passport');
const router = express.Router();


router.post('/', (req, res, next) => {
    passport.authenticate('facebook-token', function (error, user, info) {
        if (error) {
            return res.status(403).json({
                message: error.message || 'Unauthorized',
            })
        }
        if (info) {
            return res.status(403).json({
                message: info.message || 'Unauthorized',
            })
        }

        req.login(user, (err) => {
            if (err) {
                return res.status(403).send(err);
            }

            return res.status(200).json({
                message: 'Authorized successfully!'
            })
        })
    })(req, res, next);
});


module.exports = router;