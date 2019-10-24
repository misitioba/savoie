var debug = require('debug')(`app:authenticateUser ${`${Date.now()}`.white}`)
module.exports = app => {
  return function authenticateUser () {
    return async function (req, res, next) {
      if (req.session.isLogged && req.session.userId) {
        req.user = await req.findUser({
          id: req.session.userId
        })

        if (req.user) {
          let userModules = await app.dbExecute(
            `SELECT * FROM user_modules WHERE user_id = ?`,
            [req.user.id]
          )
          req.user.modules = userModules
        }

        next()
      } else {
        next()
      }
    }
  }
}