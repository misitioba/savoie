module.exports = app => {
    var apiRouter = require('express').Router()
    apiRouter.use('/auth', require('./auth')(app))
    return apiRouter
}