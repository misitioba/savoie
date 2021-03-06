module.exports = app => {
        var debug = app.getDebugInstance('modules')

        async function LoadSingleModule(module) {
            let name = module.title
                .split(' ')
                .join('-')
                .toLowerCase()

            try {
                module.name = name
                module.dbName = module.db_name
                let requirePath = require('path').join(process.cwd(), 'apps', module.name)
                module.basePath = requirePath
                app.builder.distFolder = `dist/${name}`
                app.builder.cwd = module.basePath
                module.getPath = p => {
                    if (!p) return requirePath
                    else return require('path').join(requirePath, p)
                }
                module.getRouteName = p => {
                        if (!p) return `/` + module.name
                        return require('path').join('/' + module.name, p)
                    }
                    // debug(`${module.title} loading... ${name}`)
                let moduleResponse = require(requirePath)(app, module)
                if (moduleResponse instanceof Promise) {
                    moduleResponse = await moduleResponse
                }
                // debug(`${module.title} loaded as ${name}`)
            } catch (err) {
                debug(`${module.title} failed to load`, {
                    err: err.stack
                })
            }
            app.builder.distFolder = ''
            app.builder.cwd = ''
        }

        return async function loadModules() {
                let conn = await app.getMysqlConnection()
                let isProduction = process.env.NODE_ENV === 'production'
                let [modules, fields] = await conn.execute(
                        `SELECT * FROM modules ${isProduction ? `WHERE enabled = 1` : ``}`,
      []
    )
    conn.release()
    let promises = modules.map(module => {
      return () => LoadSingleModule(module)
    })
    const sequential = require('promise-sequential')
    await sequential(promises)
    debug(
      `${modules.length} modules loaded from ${
        process.env.MYSQL_DATABASE
      }.modules`
    )
  }
}