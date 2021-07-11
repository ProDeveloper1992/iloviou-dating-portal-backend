const User = require('../user/user.model');

exports.getSwiperUsers = async (req, res) => {
    try {
        const users = await User.find().populate('swiperProfileId');

        return users;
    } catch (error) {
        throw error;
    }
}