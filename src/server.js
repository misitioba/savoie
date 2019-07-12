require('dotenv').config({ silent: true })

const express = require('express')
const server = express()

require('colors')
require('./express/functions')(server)

// parse json
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

generateProject().then(async () => {

  await server.generateRestClient();

  loadModules().then(listen)
})

function generateProject () {
  return require('./app/generator')(server) // promise
}

async function loadModules () {
  let conn = await server.getMysqlConnection()
  var debug = require('debug')(`app:modules ${`${Date.now()}`.white}`)
  let [modules, fields] = await conn.execute(`SELECT * FROM modules`, [])
  let promises = modules.map(module => {
    return (async function () {
      let name = module.title
        .split(' ')
        .join('-')
        .toLowerCase()
      server.builder.distFolder = `dist/${name}`
      server.builder.cwd = module.path
      try {
        module.name = name
        await require(module.path)(server, module)
        debug(`${module.title} loaded as ${name}`)
      } catch (err) {
        debug(`${module.title} load error`, {
          err: err.stack
        })
      }
      server.builder.distFolder = ''
      server.builder.cwd = ''
    })()
  })
  await Promise.all(promises)
}

function listen () {
  var PORT = process.env.PORT || 3000
  var debug = require('debug')(`app:server ${`${Date.now()}`.white}`)
  server.listen(PORT, () => debug(`Listening at ${PORT}`))
}