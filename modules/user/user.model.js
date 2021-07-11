const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('../../config');
const Profile = require('../profile/profile.model');

const Schema = mongoose.Schema;
const { validateEmail, validatePhone, validateCoutryCode } = require('../../utils/common.validation');
const { MESSAGES } = require('../../utils/common.messages');

const UserSchema = new Schema({
    name: String,
    avatar: String,
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
    },
    phone: {
        type: Number
    },
    countryCode: {
        type: String,
        trim: true,
    },
    gender: String,
    birthday: Date,
    interest: {
        type: String,
        default: 'friendship',
        trim: true
    },
    sexualOrientation: {
        type: String,
        default: 'straight',
        trim: true
    },
    registration: {
        type: String,
        default: 'draft'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    social: {
        facebook: {
            id: String,
        },
        google: {
            id: String,
        }
    },
    // Apears when user in reset-password process
    resetToken: String,
    provider: {
        type: String,
        default: 'local'
    },
    hashedPassword: String,
    profileId: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
}, {
    timestamps: true,
})


if (!UserSchema.options.toObject) UserSchema.options.toObject = {};
UserSchema.options.toObject.transform = function (doc, ret) {
    delete ret.hashedPassword;
    return ret;
};


//Virtual fields
UserSchema.virtual('password').set(function (password) {
    this._password = password;
    this.hashedPassword = this.encryptPassword(password);
}).get(function () {
    return this._password;
})


/**  Validations **/
UserSchema.path('email').validate(function (value) {
    return validateEmail(value);
}, MESSAGES.EMAIL_NOT_VALID);

UserSchema.path('email').validate(async function (email) {
    const User = this.collection;
    const user = await User.findOne({ email, _id: { $ne: this._id } });
    return !user;
}, MESSAGES.DUPLICATE_EMAIL);

//Validate phone
UserSchema.path('phone').validate(function (phone) {
    return validatePhone(phone);
}, MESSAGES.PHONE_NOT_VALID);

UserSchema.path('countryCode').validate(function (cntryCode) {
    return validateCoutryCode(cntryCode);
}, MESSAGES.COUNTRY_CODE_NOT_VALID);

// Validate empty password
UserSchema.path('hashedPassword').validate(function (hashedPassword) {
    return hashedPassword.length;
}, MESSAGES.PASSWORD_BLANK);



/** Pre-save hook **/
UserSchema.pre('save', async function (next) {
    // feel free to code please
});

/** Pre-remove hook from document **/
UserSchema.pre('remove', { document: true }, async function (next) {
    // feel free to code please
})



/** Static methods - this refers to user model **/
UserSchema.statics = {

}

/** Methods - this refers to document (user's record) **/
UserSchema.methods = {
    verifyPassword: function (plainPassword) {
        return this.encryptPassword(plainPassword) === this.hashedPassword;
    },
    encryptPassword: function (password) {
        if (!password) return '';

        var salt = Buffer.from(config.auth.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('base64');
    },
    createProfile: async function () {
        try {
            let user = this;
            let updateData = { userId: user._id }

            let profile = await Profile.findOneAndUpdate(
                { ...updateData },
                { $set: updateData },
                {
                    new: true,
                    lean: true,
                    upsert: true,
                }
            );

            if (profile) {
                user.profileId = profile._id;
            }

            //saving changes and returned
            return await user.save();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = mongoose.model('User', UserSchema);