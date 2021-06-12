const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../../config');

exports.setup = (User) => {
    passport.use(new FacebookStrategy({
        clientID: config.social.facebook.appId,
        clientSecret: config.social.facebook.appSecret,
        callbackURL: "http://localhost:5000/api/authentication/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'emai.l']
    }, (accessToken, refreshToken, profile, callback) => {
        console.log("profile-->", profile)
        let { email, name, gender } = profile;
        User.findOneAndUpdate({
            email: email.toLowerCase(),
        }, {
            name,
            email,
            gender
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        }, (error, user) => {
            if (error) {
                return callback(error);
            }

            return callback(null, user);
        })
    }));

    passport.serializeUser((user, callback) => {
        callback(null, user.id);
    });

    passport.deserializeUser((id, callback) => {
        User.findById(id, { hashedPassword: 0, salt: 0 }, (err, user) => {
            callback(err, user)
        })
    })
}