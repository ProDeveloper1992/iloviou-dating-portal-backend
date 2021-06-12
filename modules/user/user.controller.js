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
                status: 422,
                message: error.message,
            });
        }

        user.registration = 'completed';
        //saving change
        await user.save();

        res.status(200).json({
            message: 'Successfully registered!'
        })
    } catch (error) {
        res.status(500).send(error);
    }
}

//fetch user profile
exports.me = (req, res) => {
    try {
        const user = req.user;
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
}