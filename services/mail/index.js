const config = require('../../config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendGrid.apiKey);

class MailService {

    async sendMail(params) {
        return new Promise((resolve, reject) => {
            const msg = {
                to: params.to ? params.to : '', // Change to your recipient
                from: 'info@iloviou.com', // Change to your verified sender
                subject: params.subject ? params.subject : '',
                text: params.text ? params.text : '',
                html: params.html ? params.html : ''
            }
    
            sgMail
                .send(msg)
                .then((response) => {
                   resolve(response);
                })
                .catch((error) => {
                    reject(error);
                })

        })
        // try {
        // } catch (error) {
        //     throw error;
        // }
    }
}

module.exports = new MailService();


