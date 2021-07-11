const express = require('express');
const passport = require('passport');
const { MESSAGES } = require('../../utils/common.messages');
const router = express.Router();


router.post('/', (req, res, next) => {
    passport.authenticate('google-token', function (error, user, info) {
        if (error) {
            return res.status(403).json({
                message: error.message || MESSAGES.UNAUTHORIZED,
            })
        }
        if (info) {
            return res.status(403).json({
                message: info.message || MESSAGES.UNAUTHORIZED,
            })
        }

        req.login(user, (err) => {
            if (err) {
                return res.status(403).send(err);
            }

            return res.status(200).json({
                message: MESSAGES.AUTHORIZED_COMPLETED,
                data: user
            })
        })
    })(req, res, next);
});


module.exports = router;