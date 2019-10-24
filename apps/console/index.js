module.exports = async(app, config) => {
    var debug = app.getDebugInstance('console')

    app.use(
        config.getRouteName(),
        require('express').static(config.getPath('src/static'))
    )

    app.get(
        config.getRouteName('bundle.js'),
        app.webpackMiddleware({
            entry: config.getPath('src/index.js')
        })
    )

    await app.funql.loadFunctionsFromFolder({
        namespace: 'auth',
        path: config.getPath('functions'),
        params: [app],
        middlewares: [
            async app => {
                if (this.req) return { err: 401 }
            }
        ]
    })

    await app.funql.loadFunctionsFromFolder({
        namespace: config.name,
        path: config.getPath('api/public'),
        params: [app]
    })

    await app.funql.loadFunctionsFromFolder({
        namespace: config.name,
        path: config.getPath('api'),
        params: [app],
        middlewares: [
            async function(app) {
                if (await app.api.auth.authorizeRequest(this.req.body)) {
                    return true
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