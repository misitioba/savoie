const express = require('express')
const app = express()

module.exports.start = async function start(args) {
    require('./express/functions')(app)

    var debug = app.getDebugInstance('server')

    let pkg = require('sander').readFileSync(
        __dirname.substring(0, __dirname.lastIndexOf('/')),
        'package.json'
    )
    pkg = JSON.parse(pkg.toString('utf-8'))
    app.pkg = pkg

    let PORT = args.port || process.env.PORT || 3000

    app.setupBodyParser()

    app.setupMysqlSessionMiddleware()

    await app.cleanOutputDirectory()

    const funqlApi = require('funql-api')
    app.funqlApi = funqlApi
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
        allowCORS: true,
        transformScope: {
            moment: require('moment-timezone')
        },
        postMiddlewares: [app.authenticateUser()]
    })

    app.use('/api', require('./express/rest_api'))
    app.timeout = 1000 * 60 * 10
    await listenAsync(app)
    let nodeEnv =
        process.env.NODE_ENV === 'production' ? 'production' : 'development'
    let listeningMessage = `Listening on PORT ${PORT}, ${nodeEnv}, version ${
        app.pkg.version
        }`
    debug(listeningMessage)

    if (!process.env.DEBUG) {
        console.log(
            `For debugging, enable debug with process.env.DEBUG=app*,funql* (https://www.npmjs.com/package/debug)`
                .blue
        )
        console.log(listeningMessage.green)
    }

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