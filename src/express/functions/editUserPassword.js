var debug = require('debug')(`app:editUserPassword ${`${Date.now()}`.white}`)
module.exports = app => {
  return async function editUserPassword (email, oldPassword, newPassword) {
    const bcrypt = require('bcrypt')
    hashedPassword = await bcrypt.hash(newPassword, 10)
    let dbConnection = await app.getMysqlConnection()
    // WIP: oldPassword check
    let result = await dbConnection.execute(
      `UPDATE users SET password = ? WHERE email = ?`,
      [hashedPassword, email]
    )
    dbConnection.release()
    debug({
      email //, oldPassword, newPassword
    })
  }
}