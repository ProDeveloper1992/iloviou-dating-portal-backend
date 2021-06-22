const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../modules/user/user.model');
const messagingService = require('../../services/messaging');
const { MESSAGES } = require('../../utils/common.messages');

router.post('/send-otp', async (req, res) => {
    try {
        let { phone, countryCode } = req.body;
        let user = await User.findOne({ phone, countryCode });

        if (user) {
            let oneTimePassword = messagingService.generateOneTimePassword(6);
            user.otp = oneTimePassword;
            user.isVerified = false;

            let otpSendResponse = await messagingService.sendMessage({
                Message: MESSAGES.VERIFICATION_CODE_MESSAGE.replace('{OTP}',  oneTimePassword),
                PhoneNumber: `${user.countryCode} ${user.phone}`,
            })

            if (otpSendResponse && otpSendResponse.sid) {
                await user.save();
                return res.status(200).send({
                    message: MESSAGES.VERIFICATION_CODE_SENT.replace('{PHONE_NUMBER}', `${user.countryCode} ${user.phone}`),
                    data: {
                        countryCode: user.countryCode,
                        phone: user.phone
                    }
                })
            }

            return res.status(403).send({
                message: MESSAGES.FAIL_PHONE_VERIFICATION
            })
        }

        return res.status(404).send({
            message: MESSAGES.FAIL_USER_NOT_REGISTERED
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/verify-otp', async (req, res, next) => {
    let { phone, countryCode, otp: userOneTimePassword } = req.body;

    let user = await User.findOne({ phone, countryCode });
    if (user && user.otp) {
        if (+userOneTimePassword === +user.otp) {
            user.isVerified = true;
            await user.save();

            req.body = {
                phone: user.phone,
                phoneUser: user
            }

            //authentication
            passport.authenticate('phone-local', (error, user, info) => {
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
                    })
                })
            })(req, res, next)
        } else {
            return res.status(401).send({
                message: MESSAGES.FAIL_VERIFICATION_CODE,
            })
        }
    }

    return res.status(404).send({
        message: MESSAGES.FAIL_PHONE_PARAMETERS
    })
});


module.exports = router;