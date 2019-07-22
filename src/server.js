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
server.use('/api', require('./express/api'))

/*
//generateProject().then(
  function generateProject () {
    return require('./app/generator')(server) // promise
  }
  */

// asyncInit().then(listen)
asyncInit()

async function asyncInit () {
  if (process.env.NODE_ENV === 'production') {
    let distFolder = require('path').join(process.cwd(), 'dist') + '/index.html'
    await rimraf(distFolder)
  }

  server.builder = require('../lib/builder')
  server.configureFunql()
  await server.generateRestClient()
  await server.loadModules()
  listen()
}

function rimraf (glob) {
  var debug = require('debug')(`app:rimraf ${`${Date.now()}`.white}`)
  debug(glob)
  return new Promise((resolve, reject) => {
    require('rimraf')(glob, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function listen () {
  var debug = require('debug')(`app:server ${`${Date.now()}`.white}`)
  var PORT = process.env.PORT || 3000
  // debug('LISTEN')
  server.listen(PORT, () => debug(`Listening at ${PORT}`))
}

process.on('SIGINT', () => {
  server.close()
  console.log('Bye bye!')
  process.exit()
})

process

  // Handle normal exits
  .on('exit', code => {
    server.close()
    console.log('Bye bye 2!')
    process.exit(0)
  })