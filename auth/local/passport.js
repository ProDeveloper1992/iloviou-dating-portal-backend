const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { MESSAGES } = require("../../utils/common.messages");

exports.setup = (User) => {
    passport.use('email-local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the user model
    }, (email, password, callback) => {
        User.findOne({
            email: email.toLowerCase()
        }, (err, user) => {
            if (err) return callback(err);
            //handle user-non existance
            if (!user) {
                return callback(null, false, { message: MESSAGES.EMAIL_NOT_REGISTERED });
            }
            //match password
            if (!user.verifyPassword(password)) {
                return callback(null, false, { message: MESSAGES.PASSWORD_NOT_CORRECT });
            }
            //return user
            return callback(null, user);
        })
    }));
}