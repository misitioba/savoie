var debug = require('debug')(`app:changeUserPassword ${`${Date.now()}`.white}`)
module.exports = app => {
  return async function changeUserPassword (email) {
    if (
      !(await app.dbExecute(`SELECT 1 FROM users WHERE email = ?`, [email], {
        exists: true
      }))
    ) {
      return {
        result: false
      }
    }

    const shortid = require('shortid')
    shortid.characters(
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
    )
    const newPassword = shortid.generate()

    await app.editUserPassword(email, newPassword, newPassword)

    let mailgun = await app.getMailgun()
    mailgun.messages().send(
      {
        from: 'misitioba (Tech Cooperative at Savoie) <no-reply@misitioba.com>',
        to: email,
        subject: 'Vous avez changé votre mot de passe',
        text: `Votre nouveau mot de passe est ${newPassword}`
      },
      function (error, body) {
        if (error) {
          debug(`while sending email`, error)
        }
      }
    )

    return {
      result: true
    }
  }
}