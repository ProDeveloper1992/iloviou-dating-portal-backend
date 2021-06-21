const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { MESSAGES } = require('../../utils/common.messages')

exports.setup = () => {
    passport.use('phone-local', new LocalStrategy({
        usernameField: 'phone',
        passwordField: 'phone',
        passReqToCallback: true
    }, (req, phone, password, callback) => {
        if (req.body && req.body.phoneUser) {
            return callback(null, req.body.phoneUser);
        }

        return callback(null, false, { message: MESSAGES.USER_NOT_FOUND });
    }));
}