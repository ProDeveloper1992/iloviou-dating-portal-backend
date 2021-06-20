const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../modules/user/user.model');
const messagingService = require('../../services/messaging');

router.post('/send-otp', async (req, res) => {
    try {
        let { phone, countryCode } = req.body;
        let user = await User.findOne({ phone, countryCode });

        if (user) {
            let oneTimePassword = messagingService.generateOneTimePassword(6);
            user.otp = oneTimePassword;
            user.isVerified = false;

            let otpSendResponse = await messagingService.sendMessage({
                Message: `${oneTimePassword} is your Iloviou verification code for connect using phone. Please DO NOT share this OTP with anyone to ensure account's security.`,
                PhoneNumber: `${user.countryCode} ${user.phone}`,
            })

            if (otpSendResponse && otpSendResponse.sid) {
                await user.save();
                return res.status(200).send({
                    message: `Success, Verification code has been sent to your mobile number ${user.countryCode} ${user.phone} successfully, Please verify it.`,
                    data: {
                        countryCode: user.countryCode,
                        phone: user.phone
                    }
                })
            }

            return res.status(403).send({
                message: "Failure, An error occurring creating phone verification, Please try again later!"
            })
        }

        return res.status(404).send({
            message: 'Failure, User not registered with the given phone number in the system!'
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
                        message: 'Unauthorized',
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
                        message: 'Authorized successfully!',
                    })
                })
            })(req, res, next)
        } else {
            return res.status(401).send({
                message: 'Failure, The phone verification code was incorrect',
            })
        }
    }

    return res.status(404).send({
        message: 'Failure, The phone verification was not found with the parameters given!'
    })
});


module.exports = router;