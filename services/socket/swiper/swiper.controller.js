const User = require('../../../modules/user/user.model');

exports.getUserList = async (req, res) => {
    try {
        const users = await User.find();
        return users
    } catch (error) {
        throw error;
    }
}