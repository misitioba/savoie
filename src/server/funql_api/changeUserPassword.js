var debug = require('debug')(`app:changeUserPassword ${`${Date.now()}`.white}`)
module.exports = app => {
  return async function changeUserPassword ({ newPassword }) {
    if (!!newPassword && this.req.user) {
      await app.editUserPassword(this.req.user.email, newPassword, newPassword)

      let mailgun = await app.getMailgun()
      mailgun.messages().send(
        {
          from:
            'misitioba (Tech Cooperative at Savoie) <no-reply@misitioba.com>',
          to: this.req.user.email,
          subject: 'Vous avez changé votre mot de passe',
          text: `Votre nouveau mot de passe est ${newPassword}`
        },
        function (error, body) {
          if (error) {
            debug(`while sending email`, error)
          }
        }
      )
    }
  }
}