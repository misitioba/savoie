var debug = require('debug')(
        `app:express:api:functions ${`${Date.now()}`.white}`
)
module.exports = app => {
  return async function loadApiFunctions (options = {}) {
    // options.path

    var path = require('path')
    // let readdirPath = path.join(process.cwd(), options.path)
    let readdirPath = options.path
    var sander = require('sander')
    let files = await sander.readdir(readdirPath)
    files = files
      .filter(f => f !== 'index.js')
      .filter(f => {
        return f.indexOf('.js') !== -1
      })

    var self = {}

    files.forEach(f => {
      let requirePath = path.join(options.path, f)
      self[f.split('.')[0]] = require(requirePath)
    })
    Object.keys(self)
      .map((k, index) => {
        var mod = self[k]
        return {
          name: k,
          handler: mod.handler ? mod.handler : mod
        }
      })
      .forEach(fn => {
        let impl = fn.handler(app)
        if (impl instanceof Promise) {
          impl
            .then(handler => onReady(app, fn, handler, options))
            .catch(onError)
        } else {
          onReady(app, fn, impl, options)
        }
      })
  }
}

function onReady (app, fn, impl, options = {}) {
  // console.log('TRACE DEF', options)

  app.api = app.api || []
  if (typeof app.api[fn.name] !== 'undefined') {
    debug('API Function file', fn.name, 'exists. Skipping...')
  } else {
    // debug('API Function file', fn.name, 'loaded')
    app.api[fn.name] = function () {
      let optionsScope = {}
      if (typeof options.scope === 'function') {
        optionsScope = options.scope(this) || {}
      }
      var mergedScope = Object.assign({}, this, optionsScope)
      let r = impl.apply(mergedScope || {}, arguments)
      if (r instanceof Promise) {
        return new Promise(async (resolve, reject) => {
          try {
            r = await r
            debug(
              'api call',
              fn.name,
              r instanceof Array
                ? 'Responded with ' + r.length + ' items'
                : `Responded with object ${printKeys(r)}`
            )
            resolve(r)
          } catch (err) {
            debug(
              'api call',
              fn.name,
              `Responded with error`,
              `${err.stack}`.red
            )
            reject(err)
          }
        })
      } else {
        debug(
          'api call',
          fn.name,
          r instanceof Array
            ? 'Responded with ' + r.length + ' items'
            : `Responded with object ${printKeys(r)}`
        )
        return r
      }
    }
  }
}

function onError (err) {
  console.error('ERROR (Function)', err.stack || err)
  process.exit(1)
}

function printKeys (object = {}) {
  if (!object) {
    return object
  }
  let keys = Object.keys(object)
  if (keys.length > 10) {
    let count = keys.length
    keys = keys.filter((k, index) => index < 10)
    return `{${keys.join(', ')}... (${count} more)}`
  } else {
    return `{${keys.join(', ')}}`
  }
}