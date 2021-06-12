const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


exports.setup = (User) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the user model
    }, (email, password, callback) => {
        User.findOne({
            email: email.toLowerCase()
        }, (err, user) => {
            if (err) return callback(err);
            //handle user-non existance
            if (!user) {
                return callback(null, false, { message: 'This email is not registered.' });
            }
            //match password
            if (!user.verifyPassword(password)) {
                return callback(null, false, { message: 'This password is not correct.' });
            }
            //return user
            return callback(null, user);
        })
    }));

    passport.serializeUser((user, callback) => {
        console.log("serialize called", user)
        callback(null, user.id);
    });

    passport.deserializeUser((id, callback) => {
        console.log("deserializeUser called", id)

        User.findById(id, { hashedPassword: 0, salt: 0 }, (err, user) => {
            callback(err, user)
        })
    })
}