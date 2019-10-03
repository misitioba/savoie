const express = require('express')
const app = express()

module.exports.start = async function start(args) {
    require('./express/functions')(app)

    var debug = app.getDebugInstance('server')

    let PORT = args.port || process.env.PORT || 3000

    app.setupBodyParser()

    app.setupMysqlSessionMiddleware()

    await app.cleanOutputDirectory()

    const funqlApi = require('funql-api')
    await funqlApi.loadFunctionsFromFolder({
        params: [app],
        path: require('path').join(process.cwd(), 'src/express/funql_api')
    })

    await app.setupServerCommonRoutes()
    app.builder = require('../lib/builder')

    await app.generateRestClient()
    await app.setupDefaultModules()
    await app.loadModules()

    funqlApi.middleware(app, {
        attachToExpress: true,
        allowGet: true,
        allowOverwrite: false,
        transformScope: {
            moment: require('moment-timezone')
        },
        postMiddlewares: [
            function(req, res, next) {
                // console.log('QWEASD', req.body, Object.keys(app.api))
                next()
            },
            app.authenticateUser(),
            require('cors')()
        ]
    })

    app.use('/api', require('./express/rest_api'))
    app.timeout = 1000 * 60 * 10
    await listenAsync(app)
    debug(`Listening at ${PORT}`)

    function listenAsync(app) {
        return new Promise((resolve, reject) => {
            try {
                app.listen(PORT, () => {
                    resolve()
                })
            } catch (err) {
                reject(err)
            }
        })
    }
}