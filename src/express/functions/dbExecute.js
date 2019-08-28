var debug = require('debug')(`app:dbExecute ${`${Date.now()}`.white}`)
module.exports = app => {
  return async function dbExecute(query, params = [], options = {}) {
    if (params.filter(p => p === undefined).length > 0) {
      debug('Undefined passed as parameter', {
        query,
        params
      })
    }
    let conn = null
    try {
      conn = await app.getMysqlConnection(options)
      let [rows, fields] = await conn.execute(query, params)
      if (options.single) {
        return (rows && rows.length > 0 && rows[0]) || null
      }
      if (options.exists) {
        return !!(rows && rows.length > 0)
      }
      conn.release()
      return rows
    } catch (err) {
      debug(
        `error on query`.red,
        query.yellow,
        process.env.NODE_ENV !== 'production' ? params : '[params hidden]'
      )
      try {
        conn.release()
      } catch (err) { }
      throw err
    }
  }
}