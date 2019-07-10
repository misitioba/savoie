module.exports = app => {
  return function getMysqlSessionMiddleware (options) {
    var session = require('express-session')
    var MySQLStore = require('express-mysql-session')(session)

    var options = {
      host: options.host || 'localhost',
      port: options.port || 3306,
      user: options.user || 'session_test',
      password: options.password || 'password',
      database: options.database || 'express_mysql_session_test'
      /*
      schema: {
        tableName: 'custom_sessions_table_name',
        columnNames: {
          session_id: 'custom_session_id',
          expires: 'custom_expires_column_name',
          data: 'custom_data_column_name'
        }
      }
      */
    }

    var sessionStore = new MySQLStore(options)
    return session({
      // key: 'session_cookie_name',
      secret: process.env.SESSION_SECRET || 'secret',
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  }
}
