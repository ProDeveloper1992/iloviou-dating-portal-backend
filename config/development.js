// Development specific configuration
module.exports = {
    // MongoDB connection options
    mongo: {
        uri: process.env.MONGO_URI || 'mongodb://localhost/iloviou-dev',
    },

    //social
    social: {
        facebook: {
            appId: process.env.FACEBOOK_APP_ID,
            appSecret: process.env.FACEBOOK_APP_SECRET
        }
    },

    //AWS connection options
    aws: {

    },

    //Stripe options
    stripeOptions: {

    }
}