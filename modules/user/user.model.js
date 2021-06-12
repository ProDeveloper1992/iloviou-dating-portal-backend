const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const { validateEmail } = require('../../utils/common.validation');

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    gender: String,
    interest: {
        type: String,
        default: 'friendship'
    },
    sexualOrientation: {
        type: String,
        default: 'straight'
    },
    registration: {
        type: String,
        default: 'draft'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    hashedPassword: String,
    salt: String,
}, {
    timestamps: true,
})


if (!UserSchema.options.toObject) UserSchema.options.toObject = {};
UserSchema.options.toObject.transform = function (doc, ret) {
    delete ret.hashedPassword;
    delete ret.salt;
    return ret;
};


//Virtual fields
UserSchema.virtual('password').set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
}).get(function () {
    return this._password;
})


/**  Validations **/
UserSchema.path('email').validate(function (value) {
    return validateEmail(value);
}, 'Email is not valid');

UserSchema.path('email').validate(async function (value) {
    const User = this.collection;
    const user = await User.findOne({ email: value, _id: { $ne: this._id } });
    return !user;
}, 'Duplicate email');

// Validate empty password
UserSchema.path('hashedPassword').validate(function (hashedPassword) {
    return hashedPassword.length;
}, 'Password cannot be blank');



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
    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },
    encryptPassword: function (password) {
        if (!password || !this.salt) return '';

        var salt = Buffer.from(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('base64');
    }
}

module.exports = mongoose.model('User', UserSchema);