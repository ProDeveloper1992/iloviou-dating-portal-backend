const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const _ = require('lodash');
const config = require('../../config');


exports.setup = (User) => {
    passport.use(new GoogleTokenStrategy({
        clientID: config.social.google.clientId,
        clientSecret: config.social.google.secret
    }, async (accessToken, refreshToken, profile, callback) => {
        let { id: googleId, emails, displayName: name = 'Unknown', gender = '' } = profile;
        let email = emails.length && emails[0].value;

        let newUser = {
            email,
            name,
            avatar: profile._json.picture,
            gender,
            provider: config.provider.google,
            social: {
                google: {
                    id: googleId
                }
            },
            registration: 'completed'
        };

        var user = await User.findOne({
            $or: [
                { email }, { 'google.id': googleId }
            ]
        });

        if (user) {
            user = _.merge(user, newUser);
        } else {
            user = new User(newUser);
        }

        //check validators
        try {
            await user.validate()
        } catch (error) {
            return callback(error);
        }

        //create swiper profile for the user
        if (!user.swiperProfileId) {
            try {
                await user.createSwiperProfile();
            } catch (error) {
                return callback(error);
            }
        }

        //saving user
        user.save(function (error, result) {
            if (error) {
                return callback(error);
            }

            if (result.hashedPassword) {
                delete result.hashedPassword;
            }

            return callback(null, result);
        });
    }));
}