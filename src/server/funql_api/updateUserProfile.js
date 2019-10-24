var debug = require('debug')(`app:updateUserProfile ${`${Date.now()}`.white}`)
module.exports = app => {
  return async function updateUserProfile ({ email, newPassword }) {
    if (this.req.user) {
      let savePassword = false
      if (newPassword) {
        savePassword = await app.editUserPassword(
          this.req.user.email,
          newPassword,
          newPassword
        )
        sendEmailNotification(app, this.req.user.email, newPassword)
      }

      return {
        savePassword,
        saveEmail: await saveEmail(app, this.req.user.id, email)
      }
    } else {
      return {
        err: 401
      }
    }
  }
}

async function saveEmail (app, userId, newEmail) {
  if (!newEmail) return false
  const isEmailInUse = await app.dbExecute(
    `SELECT 1 FROM users WHERE id <> ? AND email = ?`,
    [userId, newEmail],
    {
      exists: true
    }
  )
  if (!isEmailInUse) {
    return await app.dbExecute(`UPDATE users SET email = ? WHERE id = ?`, [
      newEmail,
      userId
    ])
  }
}

async function sendEmailNotification (app, email, newPassword) {
  if (!newPassword) return false

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
}