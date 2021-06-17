const AWS = require('aws-sdk');
const config = require('../../config');
AWS.config.update({ region: config.aws.region });

class MessagingService {
    constructor() {
        this.sns = new AWS.SNS({ region: config.aws.region });
        this.setSmsAttributes({
            attributes: {
                DefaultSenderID: 'TM-ILOVIOU',
                DefaultSMSType: 'Transactional'
            }
        })
    }

    async setSmsAttributes(attr) {
        try {
            return await this.sns.setSMSAttributes(attr).promise();
        } catch (error) {
            throw error;
        }
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
            return await this.sns.publish(params).promise();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MessagingService();


