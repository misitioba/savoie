module.exports = async(app, config) => {
    var debug = app.getDebugInstance('console')

    app.get(
        config.getRouteName('bundle.js'),
        app.webpackMiddleware({
            entry: config.getPath('src/main.js')
        })
    )

    let funql = require('funql-api')

    await funql.loadFunctionsFromFolder({
        namespace: 'auth',
        path: config.getPath('functions'),
        params: [app],
        middlewares: [
            async app => {
                if (this.req) return { err: 401 }
            }
        ]
    })

    await funql.loadFunctionsFromFolder({
        namespace: config.name,
        path: config.getPath('api/public'),
        params: [app]
    })

    await funql.loadFunctionsFromFolder({
        namespace: config.name,
        path: config.getPath('api'),
        params: [app],
        middlewares: [
            async function(app) {
                let publicFunctions = ['login']
                if (publicFunctions.includes(this.name)) {
                    return true
                } else {
                    if (await app.api.auth.authorizeRequest(this.req.body)) {
                        return true
                    }
                }
                return {
                    err: 401
                }
            }
        ]
    })

    app.get(
        config.getRouteName() + '*',
        app.builder.transformFileRoute({
            cwd: config.getPath(),
            source: 'console.pug',
            context: {
                cwd: config.getRouteName(),
                head: {
                    title: config.title
                }
            }
        })
    )
}