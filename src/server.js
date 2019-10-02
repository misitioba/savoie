const express = require('express')
const server = express()

module.exports.start = async function start(args) {
        let PORT = args.port || process.env.PORT || 3000

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
  if (process.env.NODE_ENV === 'production') {
    let distFolder = require('path').join(process.cwd(), 'dist') + '/index.html'
    await rimraf(distFolder)
  }

  server.loadApiFunctions({
    path: require('path').join(process.cwd(), 'src/express/funql_api'),
    scope: {
      // dbName: config.db_name
    }
  })

  server.get(
    '/analytics.js',
    server.webpackMiddleware({
      entry: require('path').join(process.cwd(), 'src/js/analytics.js'),
      output: require('path').join(process.cwd(), 'tmp/analytic.js')
    })
  )

  server.get(
    '/commonHeader.js',
    server.webpackMiddleware({
      entry: require('path').join(process.cwd(), 'src/js/commonHeader.js'),
      output: require('path').join(process.cwd(), 'tmp/sharedHeaderApp.js')
    })
  )

  server.get(
    '/feedbackButton.js',
    server.webpackMiddleware({
      entry: require('path').join(process.cwd(), 'src/js/feedbackButton.js'),
      output: require('path').join(process.cwd(), 'tmp/feedbackButton.js')
    })
  )

  var debug = require('debug')(`app:server ${`${Date.now()}`.white}`)

  server.builder = require('../lib/builder')
  server.configureFunql()
  await server.generateRestClient()
  debug('loading modules')
  await server.loadModules()

  server.use('/', express.static('dist'))
  server.use('/static', express.static('src/static'))
  server.use('/api', require('./express/rest_api'))

  var debug = require('debug')(`app:server ${`${Date.now()}`.white}`)
  server.listen(PORT, () => debug(`Listening at ${PORT}`))
  server.timeout = 1000 * 60 * 10
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