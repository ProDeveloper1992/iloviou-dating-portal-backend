// Development specific configuration
module.exports = {
    // MongoDB connection options
    mongo: {
        uri: process.env.MONGO_URI || 'mongodb://localhost/iloviou-dev',
    },

    //AWS connection options
    aws: {

    },

    //Stripe options
    stripeOptions: {

    }
}