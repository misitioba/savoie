module.exports = app => {
        var debug = require('debug')(`app:modules ${`${Date.now()}`.white}`)

  async function LoadSingleModule (module) {
    let name = module.title
      .split(' ')
      .join('-')
      .toLowerCase()

    try {
      module.name = name
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
      await require(requirePath)(app, module)
      // debug(`${module.title} loaded as ${name}`)
    } catch (err) {
      debug(`${module.title} load error`, {
        err: err.stack
      })
    }
    app.builder.distFolder = ''
    app.builder.cwd = ''
  }

  return async function loadModules () {
    let conn = await app.getMysqlConnection()

    let [modules, fields] = await conn.execute(
      `SELECT * FROM modules WHERE enabled = 1`,
      []
    )
    let promises = modules.map(module => {
      return () => LoadSingleModule(module)
    })
    const sequential = require('promise-sequential')
    await sequential(promises)
  }
}