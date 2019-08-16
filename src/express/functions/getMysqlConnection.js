var debug = require('debug')(`app:getMysqlConnection ${`${Date.now()}`.white}`)
let pools = {}
module.exports = app => {
  let conns = {}
  return async function getMysqlConnection (options = {}) {
    let database =
      options.dbName || process.env.MYSQL_DATABASE || 'express_test'

    const mysql = require('mysql2/promise')
    let credentials = {
      connectionLimit: 10,
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PWD,
      database
    }

    if (!pools[database]) {
      pools[database] = mysql.createPool(credentials)
    }
    let conn = await pools[database].getConnection()
    conn.close = () => {
      // conn.destroy()

      conn.release()
    }
    return conn

    /*
    conns[database] = await mysql.createConnection(credentials)
    return conns[database] */
  }
}