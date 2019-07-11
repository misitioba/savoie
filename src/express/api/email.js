var router = require('express').Router()

var debug = require('debug')(`app:api:email ${`${Date.now()}`.white}`)

router.post('/guest/contact', async (req, res) => {
  var data = {
    from: 'misitioba (Tech Cooperative at Savoie) <no-reply@misitioba.com>',
    to: 'arancibiajav@gmail.com',
    subject: 'Test email',
    text: 'Testing some Mailgun awesomeness!'
  };
  let mailgun = await req.getMailgun();
  mailgun.messages().send(data, function (error, body) {
    error && debug(`contact`, error);
    res.json({
      result: !error
    });
  });
});

router.post('/guest/request_demo', async (req, res) => {
  var moment = require('moment');
  var data = {
    from: 'misitioba(Tech Cooperative at Savoie) <no-reply@misitioba.com>',
    to: 'arancibiajav@gmail.com',
    subject: `${req.body.email} requested a demo`,
    text: `${req.body.email} requested a demo<br>
    Date: ${moment(Date.now()).format("DD-MM-YYYY HH:mm")}
    `
  };
  let mailgun = await req.getMailgun();
  mailgun.messages().send(data, function (error, body) {
    error && debug(`request_demo`, error);
    res.json({
      result: !error
    });
  });
});

module.exports = router