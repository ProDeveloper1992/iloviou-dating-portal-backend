const config = require('../../config');
const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(config.sendGrid.apiKey);

class MailService {
    async sendMail(params) {
        let mailOptions = {
            templateId: params.templateId,
            from: config.sendGrid.mailFrom,
            to: params.to ? params.to : "",
            dynamic_template_data: params.dynamicTemplateData || {}
        }

        return await sendGridMail.send(mailOptions);
    }
}

module.exports = new MailService();


