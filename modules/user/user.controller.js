const User = require('./user.model');
const _ = require('lodash');
const config = require('../../config');
const { MESSAGES } = require('../../utils/common.messages');
const { sendMail } = require('../../services/mail');
const authService = require('../../auth/auth.service');

//create new user
exports.register = async (req, res) => {
    try {
        let { body } = req;
        var user = await User.findOne({ email: body.email, registration: 'draft' });
        if (user) {
            user = _.merge(user, body);
        } else {
            user = new User(body);
        }

        try {
            await user.validate()
        } catch (error) {
            return res.status(422).json({
                message: error.message,
            });
        }

        //saving change
        user.registration = 'completed';
        await user.save();

        res.status(200).json({
            message: MESSAGES.REGISTRATION_COMPLETED
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//fetch user profile
exports.me = (req, res) => {
    try {
        const user = req.user;
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//send reset password link to user
exports.requestResetPassword = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email, provider: 'local' });
        if (!user) {
            return res.status(404).send({ message: MESSAGES.USER_NOT_FOUND });
        }
        if (user.provider === 'google') {
            return res.status(400).send({ message: MESSAGES.GOOGLE_REGISTERED });
        }
        if (user.provider === 'facebook') {
            return res.status(400).send({ message: MESSAGES.FACEBOOK_REGISTERED });
        }

        //generate reset token
        const resetToken = authService.signToken({ _id: user._id });
        let resetPasswordLink = `${req.protocol}://${req.get('host')}/api/users/password-recover?token=${resetToken}`;

        //send reset password mail with reset-password link
        await sendMail({
            to: user.email,
            templateId: config.sendGrid.templatesIds.forgotPassword,
            dynamicTemplateData: {
                subject: "Password Reset",
                name: user.name,
                resetPasswordLink
            }
        })

        //saving reset token
        user.resetToken = resetToken;
        await user.save();

        res.status(200).send({ message: "Reset password link has been sent to the given email, Please reset your password by visiting it!" })
    } catch (error) {
        res.status(500).send(error.message);
    }
}




exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, password } = req.body;
        const payload = authService.verifyToken(resetToken);
        const user = await User.findById(payload._id);
        if (!user) {
            return res.status(404).send({ message: MESSAGES.INCORRECT_TOKEN });
        }
        if (!user.resetToken || (user.resetToken !== resetToken)) {
            return res.status(400).send({ message: MESSAGES.INCORRECT_TOKEN });
        }

        //setting new password for user
        user.password = password;
        user.resetToken = undefined;
        await user.save();

        res.status(200).send({ message: MESSAGES.RESET_NEW_PASSWORD_SUCCESS });
    } catch (error) {
        if (error.name && error.name === "TokenExpiredError") {
            return res.status(401).send({ message: MESSAGES.RESET_PASSWORD_TOKEN_EXPIRED })
        }

        res.status(500).send(error);
    }
}