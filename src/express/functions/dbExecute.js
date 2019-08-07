var debug = require('debug')(`app:dbExecute ${`${Date.now()}`.white}`)
module.exports = app => {
  return async function dbExecute (query, params, options = {}) {
    try {
      let conn = await app.getMysqlConnection(options)
      let [rows, fields] = await conn.execute(query, params)
      if (options.single) {
        return (rows && rows.length > 0 && rows[0]) || null
      }
      if (options.exists) {
        return !!(rows && rows.length > 0)
      }
      return rows
      conn.close()
    } catch (err) {
      debug(
        `error on query`.red,
        query.yellow,
        process.env.NODE_ENV !== 'production' ? params : '[params hidden]'
      )
      throw err
    }
  }
}