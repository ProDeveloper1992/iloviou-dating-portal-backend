
const SwiperProfile = require('./swiper-profile.model');
const { MESSAGES } = require('../../utils/common.messages');
const _ = require('lodash');

//update swiper profile of user
exports.updateSwiperProfile = async (req, res) => {
    try {
        let { body, user } = req;
        var userSwiperProfile = await SwiperProfile.findOne({ userId: user._id });
        if (!userSwiperProfile) {
            return res.status(404).send({ message: MESSAGES.SWIPER_PROFILE_NOT_FOUND_FOR_USER });
        }
        //merge new data
        let updatedSwiperProfile = _.merge(userSwiperProfile, body);
        //validate before update
        const validError = updatedSwiperProfile.validateSync();
        if (validError) {
            return res.status(422).json({
                message: validError.message,
            });
        }

        //update swiper profile
        await userSwiperProfile.save();

        res.status(200).json({
            data: userSwiperProfile,
            message: MESSAGES.SWIPER_PROFILE_UPDATED_SUCCESSFULLY
        })
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

