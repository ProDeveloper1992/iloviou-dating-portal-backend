// Development specific configuration
module.exports = {
    // MongoDB connection options
    mongo: {
        uri: process.env.MONGO_URI || 'mongodb://localhost/iloviou-dev',
    },

    //auth
    auth: {
        salt: process.env.AUTH_SALT
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
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        s3Bucket: process.env.AWS_S3_BUCKET
    },

    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        fromPhone: process.env.TWILIO_PHONE
    },

    //Stripe options
    stripeOptions: {

    }
}