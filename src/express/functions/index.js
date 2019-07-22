var debug = require('debug')(`app:express:functions ${`${Date.now()}`.white}`)

module.exports = app => {
  app.loadFunctions = createLoadFunctions(app)
  app.loadFunctions({
    path: __dirname
  })
}

function createLoadFunctions (app) {
  return function loadFunctions (options) {
    var folderPath = options.path || __dirname
    var sander = require('sander')
    let files = sander.readdirSync(folderPath)
    files = files
      .filter(f => f !== 'index.js')
      .filter(f => {
        return f.indexOf('.js') !== -1
      })
    var self = {}
    files.forEach(f => {
      self[f.split('.')[0]] = require(folderPath + '/' + f)
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
          impl.then(handler => onReady(app, fn, handler)).catch(onError)
        } else {
          onReady(app, fn, impl)
        }
      })
  }
}

function onReady (app, fn, impl) {
  if (typeof app[fn.name] !== 'undefined') {
    debug('Function file', fn.name, 'exists. Skipping...')
  } else {
    app.functions = app.functions || []
    app.functions.push(fn.name)
    // debug('Function file', fn.name, 'loaded')
    app[fn.name] = function () {
      let r = impl.apply(this, arguments)
      if (r instanceof Promise) {
        return new Promise(async (resolve, reject) => {
          try {
            r = await r
            /*
            debug(
              'call',
              fn.name,
              r instanceof Array
                ? 'Responded with ' + r.length + ' items'
                : `Responded with object ${printKeys(r)}`
            ) */
            resolve(r)
          } catch (err) {
            debug('call', fn.name, `Responded with error`, `${err.stack}`.red)
            reject(err)
          }
        })
      } else {
        /*
        debug(
          'call',
          fn.name,
          r instanceof Array
            ? 'Responded with ' + r.length + ' items'
            : `Responded with object ${printKeys(r)}`
        ) */
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