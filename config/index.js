
const path = require('path');
const _ = require('lodash');


//All configuration will extend these options
const defaultConfig = {
    env: process.env.NODE_ENV,

    //Root of the server
    root: path.normalize(__dirname + '../..'),

    //Server port
    port: process.env.PORT || 9000,

    //Secrets for security purpose, in various features
    secrets: {
        session: process.env.SESSION_SECRET
    },

    // MongoDB connection options
    mongo: {
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },

    // Providers
    provider: {
        local: 'local',
        facebook: 'facebook'
    }
}

module.exports = _.merge(defaultConfig, require('./' + process.env.NODE_ENV + '.js') || {});