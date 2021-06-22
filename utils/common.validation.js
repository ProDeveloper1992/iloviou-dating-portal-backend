//validators
module.exports = {
    validateEmail: function (email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    },
    validatePhone: function (phone) {
        //internation phone format - accepts with or without country code
        return /^[\s()+-]*([0-9][\s()+-]*){6,20}$/.test(phone);
    },
    validateCoutryCode: function (countryCode) {
        //international coutry code
        return /^\+(\d{1}\-)?(\d{1,3})$/.test(countryCode);
    }
}