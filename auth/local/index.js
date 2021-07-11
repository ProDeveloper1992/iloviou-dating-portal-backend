const express = require('express');
const passport = require('passport');
const { MESSAGES } = require('../../utils/common.messages');
const router = express.Router();

router.post('/', (req, res, next) => {
    passport.authenticate('email-local', (error, user, info) => {
        if (error) {
            return res.status(403).json({
                message: MESSAGES.UNAUTHORIZED,
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
    })(req, res, next)
})


router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send({
        message: MESSAGES.LOGOUT_COMPLETED
    });
})

module.exports = router;