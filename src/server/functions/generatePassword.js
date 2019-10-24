var debug = require('debug')(`app:generatePassword ${`${Date.now()}`.white}`)
module.exports = app => {
  return async function generatePassword (newPassword) {
    const bcrypt = require('bcrypt')
    return await bcrypt.hash(newPassword, 10)
  }
}