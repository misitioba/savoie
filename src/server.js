const express = require('express')
const app = express()

module.exports.start = async function start(args) {
        var debug = require('debug')(
                `${'app:server'.padEnd(15, ' ')} ${`${Date.now()}`.white}`
  )

  let PORT = args.port || process.env.PORT || 3000

  require('./express/functions')(app)

  const bodyParser = require('body-parser')
  app.use(
    bodyParser.json({
      limit: '50mb'
    })
  )

  // mysql session
  app.use(
    app.getMysqlSessionMiddleware({
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PWD,
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      database: process.env.MYSQL_DATABASE
    })
  )

  app.use((req, res, next) => {
    app.functions.forEach(
      functionName => (req[functionName] = app[functionName])
    )
    next()
  })

  app.use((req, res, next) => {
    debug(`${req.url}`)
    next()
  })

  await cleanOutputDirectory()

  app.loadApiFunctions({
    path: require('path').join(process.cwd(), 'src/express/funql_api'),
    scope: {
      // dbName: config.db_name
    }
  })

  app.get(
    '/analytics.js',
    app.webpackMiddleware({
      entry: require('path').join(process.cwd(), 'src/js/analytics.js'),
      output: require('path').join(process.cwd(), 'tmp/analytic.js')
    })
  )

  app.get(
    '/commonHeader.js',
    app.webpackMiddleware({
      entry: require('path').join(process.cwd(), 'src/js/commonHeader.js'),
      output: require('path').join(process.cwd(), 'tmp/sharedHeaderApp.js')
    })
  )

  app.get(
    '/feedbackButton.js',
    app.webpackMiddleware({
      entry: require('path').join(process.cwd(), 'src/js/feedbackButton.js'),
      output: require('path').join(process.cwd(), 'tmp/feedbackButton.js')
    })
  )

  app.builder = require('../lib/builder')
  app.configureFunql()
  await app.generateRestClient()
  await app.loadModules()

  app.use('/', express.static('dist'))
  app.use('/static', express.static('src/static'))
  app.use('/api', require('./express/rest_api'))

  app.get('/health', (req, res) => res.send('alive'))
  app.get('/version', async (req, res) =>
    res.send(
      JSON.parse(
        (await require('sander').readFile(
          require('path').join(process.cwd(), 'package.json')
        )).toString('utf-8')
      ).version
    )
  )

  app.listen(PORT, () => debug(`Listening at ${PORT}`))
  app.timeout = 1000 * 60 * 10
}

async function cleanOutputDirectory () {
  let distFolder = require('path').join(process.cwd(), 'dist') + '**'
  await rimraf(distFolder)

  function rimraf (glob) {
    var debug = require('debug')(
      `${'app:rimraf'.padEnd(15, ' ')} ${`${Date.now()}`.white}`
    )
    debug(glob)
    return new Promise((resolve, reject) => {
      require('rimraf')(glob, err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}