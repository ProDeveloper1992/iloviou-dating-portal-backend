const AWS = require('aws-sdk');
const config = require('../../config');
AWS.config.update({ region: config.aws.region });
const twilio = require('twilio');
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN; 
const twilioRegisteredPhone = process.env.TWILIO_PHONE;

class MessagingService {
    constructor() {
        this.client = new twilio(twilioAccountSid, twilioAuthToken);
        // this.sns = new AWS.SNS({ region: config.aws.region });
        // this.setSmsAttributes({
        //     attributes: {
        //         DefaultSenderID: 'TM-ILOVIOU',
        //         DefaultSMSType: 'Transactional'
        //     }
        // })
    }

    // async setSmsAttributes(attr) {
    //     try {
    //         return await this.sns.setSMSAttributes(attr).promise();
    //     } catch (error) {
    //         throw error;
    //     }
    // }

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
            return this.client.messages.create({
                body: params.Message,
                to: params.PhoneNumber,  // Text this number
                from: twilioRegisteredPhone // From a valid Twilio number
            })
            .then((message) => message);
            
            // return await this.sns.publish(params).promise();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MessagingService();


