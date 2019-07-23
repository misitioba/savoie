var apiRouter = require('express').Router()
apiRouter.use('/auth', require('./auth'))
module.exports = apiRouter