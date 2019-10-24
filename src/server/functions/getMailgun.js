module.exports = app => {
    return async function getMailgun() {
        var api_key = process.env.MAILGUN_API_KEY;
        var domain = process.env.MAILGUN_DOMAIN;
        var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
        return mailgun;
    };
};