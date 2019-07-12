var debug = require('debug')(`app:getMysqlConnection ${`${Date.now()}`.white}`)
module.exports = app => {
  let conns = {}
  return async function getMysqlConnection (options = {}) {
	let database =
	options.dbName || process.env.MYSQL_DATABASE || 'express_test'
    if (conns[database]) {
      return conns[database]
    }
    const mysql = require('mysql2/promise')
    
    conns[database] = await mysql.createConnection({
      host: process.env.MYSQL_URI || 'localhost',
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PWD,
      database
    })
    // debug(`Using password? ${!!process.env.MYSQL_PWD}`)
    return conns[database]
  }
}