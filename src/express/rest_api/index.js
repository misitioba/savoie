var apiRouter = require('express').Router()

module.exports = app => {
    apiRouter.use('/auth', require('./auth')(app))
    return apiRouter
}