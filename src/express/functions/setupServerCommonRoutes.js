module.exports = app => {
        var debug = require('debug')(
                `${'app:common'.padEnd(15, ' ')} ${`${Date.now()}`.white}`
  )
  return async function setupServerCommonRoutes () {
    app.use((req, res, next) => {
      var debug = require('debug')(
        `${'app:request'.padEnd(15, ' ')} ${`${Date.now()}`.white}`
      )
      debug(`${req.url}`)
      next()
    })
    app.use((req, res, next) => {
      app.functions.forEach(
        functionName => (req[functionName] = app[functionName])
      )
      next()
    })

    app.get(
      '/analytics.js',
      app.webpackMiddleware({
        entry: require('path').join(process.cwd(), 'src/js/analytics.js')
      })
    )

    app.get(
      '/commonHeader.js',
      app.webpackMiddleware({
        entry: require('path').join(process.cwd(), 'src/js/commonHeader.js')
      })
    )

    app.get(
      '/feedbackButton.js',
      app.webpackMiddleware({
        entry: require('path').join(process.cwd(), 'src/js/feedbackButton.js')
      })
    )
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

    const express = require('express')
    app.use('/', express.static('dist'))
    app.use('/static', express.static('src/static'))
  }
}