var debug = require('debug')(`app:getMysqlConnection ${`${Date.now()}`.white}`)
let pools = {}
module.exports = app => {
  let conns = {}
  return async function getMysqlConnection(options = {}) {
    let database =
      options.dbName || process.env.MYSQL_DATABASE || 'savoie'

    const mysql = require('mysql2/promise')
    let credentials = {
      connectionLimit: 10,
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PWD,
      database,
      multipleStatements: true
    }
    if (!pools[database]) {
      pools[database] = mysql.createPool(credentials)
    }
    pools[database].release = () => { }
    return pools[database]
    // let conn = await pools[database].getConnection()
    /* conn.close = () => {
      // conn.destroy()
      console.log('RELEASE')
      conn.release()
    } */
    // return conn
  }
}