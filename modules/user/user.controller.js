const User = require('./user.model');
const _ = require('lodash');
const { MESSAGES } = require('../../utils/common.messages');
const { sendMail } = require('../../services/mail');

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

        //check if user exists with given phone
        if (body.phone && body.countryCode) {
            const userWithDuplicatePhone = await User.findOne({
                _id: { $ne: user._id },
                phone: body.phone,
                countryCode: body.countryCode,
            });
            if (userWithDuplicatePhone) {
                return res.status(422).json({
                    message: MESSAGES.DUPLICATE_PHONE
                })
            }
        }

        user.registration = 'completed';
        //saving change
        await user.save();

        res.status(200).json({
            message: MESSAGES.REGISTRATION_COMPLETED
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// exports.forgotPassword = async (req, res) => {
//     try {
//         let { body } = req;
//         var user = await User.findOne({ _id: req.user.id });
//         user = _.merge(user, body);

//         //saving change
//         await user.save();
//         req.logout();
//         res.status(200).json({
//             message: MESSAGES.FORGOT_PASSWORD
//         })
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// }

//fetch user profile
exports.me = (req, res) => {
    try {
        const user = req.user;
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.sendMail = (req, res) => {
    sendMail({
        to: "mihirpatel2015@gmail.com",
        subject: "test",
        text: "hello word",
        html: "<h1>Word test</h1>"
    }).then(resData => {
        res.status(200).send(resData);
    }, err => {
        res.status(400).send(err)
    })
}