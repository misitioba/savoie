require('dotenv').config({ silent: true })
require('colors')
const express = require('express')
const server = express()
require('./express/functions')(server)

const bodyParser = require('body-parser')
server.use(
    bodyParser.json({
        limit: '50mb'
    })
)

// mysql session
server.use(
    server.getMysqlSessionMiddleware({
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PWD,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DATABASE
    })
)

server.use((req, res, next) => {
    server.functions.forEach(
        functionName => (req[functionName] = server[functionName])
    )
    next()
})

server.use((req, res, next) => {
            var debug = require('debug')(`app:request ${`${Date.now()}`.white}`)
  debug(`${req.url}`)
  next()
})

server.use('/', express.static('dist'))
server.use('/static', express.static('src/static'))
server.use('/admin_pages', express.static('src/app/pages'))
server.use('/styles', express.static('src/app/styles'))
server.use('/api', require('./express/api'))

/*
//generateProject().then(
  function generateProject () {
    return require('./app/generator')(server) // promise
  }
  */

asyncInit()

async function asyncInit () {
  server.builder = require('../lib/builder')
  server.configureFunql()
  await server.generateRestClient()
  await server.loadModules()
  listen()
}

function listen () {
  var PORT = process.env.PORT || 3000
  var debug = require('debug')(`app:server ${`${Date.now()}`.white}`)
  server.listen(PORT, () => debug(`Listening at ${PORT}`))
}