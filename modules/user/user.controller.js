const User = require('./user.model');
const _ = require('lodash');

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
                    message: 'The given phone number is already existed in system, duplicate phone!'
                })
            }
        }

        user.registration = 'completed';
        //saving change
        await user.save();

        res.status(200).json({
            message: 'Successfully registered!'
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