const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const _ = require('lodash');
const config = require('../../config');

exports.setup = (User) => {
    passport.use(new FacebookTokenStrategy({
        clientID: config.social.facebook.appId,
        clientSecret: config.social.facebook.appSecret,
        fbGraphVersion: 'v3.0',
        profileFields: [
            'id', 'displayName', 'picture.type(large)', 'emails', 'gender'
        ]
    }, async (accessToken, refreshToken, profile, callback) => {
        let { id: facebookId, emails, displayName: name = 'Unknown', gender = '' } = profile;
        let email = emails.length && emails[0].value;

        let newUser = {
            email,
            name,
            avatar: `https://graph.facebook.com/${facebookId}/picture?access_token=${accessToken}`,
            gender,
            provider: config.provider.facebook,
            social: {
                facebook: {
                    id: facebookId
                }
            },
            registration: 'completed'
        };

        var user = await User.findOne({
            $or: [
                { email }, { 'facebook.id': facebookId }
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

        //saving user
        user.save(function (error, result) {
            if (error) {
                return callback(error);
            }

            return callback(null, result);
        });
    }));
}