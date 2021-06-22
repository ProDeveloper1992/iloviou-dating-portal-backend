const config = require('../../config');
const twilio = require('twilio');

class MessagingService {
    constructor() {
        this.client = new twilio(config.twilio.accountSid, config.twilio.authToken);
    }

    generateOneTimePassword(otpLength = 6) {
        var digits = '0123456789';
        var otp = '';
        for (let i = 1; i <= otpLength; i++) {
            var index = Math.floor(Math.random() * (digits.length));
            otp = otp + digits[index];
        }
        return otp;
    }

    async sendMessage(params) {
        try {
            return await this.client.messages.create({
                body: params.Message,
                to: params.PhoneNumber,
                from: config.twilio.fromPhone // From a valid Twilio number
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MessagingService();


