var debug = require('debug')(`app:changeUserPassword ${`${Date.now()}`.white}`)
module.exports = app => {
  return async function changeUserPassword ({ newPassword }) {
    if (!!newPassword && this.req.user) {
      await app.editUserPassword(this.req.user.email, newPassword, newPassword)
    }
  }
}