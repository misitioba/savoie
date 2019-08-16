var debug = require('debug')(
        `app:getPasswordHashFromUserByEmail ${`${Date.now()}`.white}`
)
module.exports = app => {
  return async function getPasswordHashFromUserByEmail (email) {
    let dbConnection = await app.getMysqlConnection()
    const [rows, fields] = await dbConnection.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    )
    dbConnection.release()
    if (rows.length > 0) {
      return rows[0].password
    } else {
      debug(`no hash found for email ${email}`)
      return ''
    }
  }
}