module.exports = app => {
        const router = require('express').Router()
        const createDebug = require('../functions/getDebugInstance')(app)
        const debug = createDebug(`api:auth ${`${Date.now()}`.white}`)

  router.get('/logout', app.authorizeMiddleware(), (req, res) => {
    req.session.isLogged = false
    delete req.session.userId
    res.status(200).json(true)
  })

  router.get('/check', app.authorizeMiddleware(), (req, res) => {
    var _ = require('lodash')
    res.json({
      authorized: true,
      user: _.omit(req.user, ['password'])
    })
  })

  router.get('/loggedUser', app.authorizeMiddleware(), (req, res) => {
    var _ = require('lodash')
    res.json(_.omit(req.user, ['password']))
  })

  router.post('/', async (req, res) => {
    debug('API AUTH')

    // WIP: new email should be tracked
    var bcrypt = require('bcrypt')
    let hash = await req.getPasswordHashFromUserByEmail(req.body.email)
    let isPasswordOk = await bcrypt.compare(req.body.password, hash)
    req.session.isLogged = true
    req.session.email = req.body.email
    if (!isPasswordOk) {
      // track password failed
      return res.json({
        err: 'INVALID_PASSWORD'
      })
    }
    req.user = await req.findUser({
      email: req.body.email
    })
    if (!req.user) {
      // track email failed
      return res.json({
        err: 'INVALID_EMAIL'
      })
    }
    req.session.userId = req.user.id
    var _ = require('lodash')
    res.json(_.omit(req.user, ['password']))
  })

  router.post('/password', async (req, res) => {
    await req.editUserPassword(req.body.email, 'oldPassword', req.body.password)
    res.json({
      result: true
    })
  })
  return router
}