
const Profile = require('./profile.model');
const { MESSAGES } = require('../../utils/common.messages');
const _ = require('lodash');
const User = require('../user/user.model');

//update profile of user
exports.updateProfile = async (req, res) => {
    try {
        let { body, user } = req;
        var userProfile = await Profile.findOne({ userId: user._id });
        if (!userProfile) {
            return res.status(404).send({ message: MESSAGES.PROFILE_NOT_FOUND_FOR_USER });
        }
        //merge new data
        let updatedProfile = _.merge(userProfile, body);
        //validate before update
        const validError = updatedProfile.validateSync();
        if (validError) {
            return res.status(422).json({
                message: validError.message,
            });
        }

        //update swiper profile
        await userProfile.save();

        res.status(200).json({
            data: userProfile,
            message: MESSAGES.PROFILE_UPDATED_SUCCESSFULLY
        })
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

exports.getUsersProfile = async () => {
    try {
        const users = await User.find().populate('profileId');
        return users;
    } catch (error) {
        throw error;
    }
}