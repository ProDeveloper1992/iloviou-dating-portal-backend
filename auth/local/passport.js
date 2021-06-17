const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


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
                return callback(null, false, { message: 'The given email is not registered!' });
            }
            //match password
            if (!user.verifyPassword(password)) {
                return callback(null, false, { message: 'Provided password is not correct!' });
            }
            //return user
            return callback(null, user);
        })
    }));
}