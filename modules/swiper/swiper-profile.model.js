const mongoose = require('mongoose');
const config = require('../../config');

const Schema = mongoose.Schema;
const { MESSAGES } = require('../../utils/common.messages');

const ProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    bust: String,
    hip: String,
    height: Number,
    heightType: String,
    weight: Number,
    weightType: String,
    relationshipStatus: String,
    languages: [String],
    interests: [String],
    lookingFor: [String],
    about: String,
    images: [String],
    currentLocation: String
}, {
    timestamps: true,
})


module.exports = mongoose.model('SwiperProfile', ProfileSchema);