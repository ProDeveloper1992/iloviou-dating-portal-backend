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
    heigth: Number,
    heigthType: String,
    weight: Number,
    weightType: String,
    relationshipStatus: String,
    languages: [String],
    interests: [String],
    lookingFor: [String],
    aboutYou: String,
    images: [String],
    currentLocation: String
}, {
    timestamps: true,
})