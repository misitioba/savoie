var debug = require('debug')(`app:builder ${`${Date.now()}`.white}`)
var builder = {
  distFolder: '',
  cwd: ''
}

function getDistPath (options) {
  return options.dist || builder.distFolder || 'dist'
}

builder.transformFileRoute = function (options) {
  let cache = {}
  return async function (req, res) {
    let _options = Object.assign({}, options)
    if (!_options.target) {
      _options.target = require('path').join(req.url, `index.html`)
    }

    try {
      var fullUrl = req.protocol + '://' + req.get('host')
      _options.context.head.image = fullUrl + _options.context.head.image
    } catch (err) {}

    _options.context.fn = {}
    _options.context.fn.cwd = function (v = '/') {
      let _cwd = _options.context.cwd
      if (_cwd) {
        if (v) {
          return require('path').join(_cwd, v || '/')
        } else {
          return _cwd + v
        }
      } else {
        return v
      }
    }

    if (process.env.NODE_ENV === 'production') {
      if (_options.mode === 'pug') {
        let expectedWritePath = require('path').join(
          _options.cwd || process.cwd(),
          getDistPath(_options),
          _options.target
        )
        if (cache[expectedWritePath] === true) {
          return res.sendFile(expectedWritePath)
        }
      }
    }
    let result = await builder.transformFile(_options)
    if (process.env.NODE_ENV === 'production') {
      cache[result.path] = true
    }
    return res.sendFile(result.path)
  }
}

builder.transformFile = async options => {
  var path = require('path')

  if (!options.mode) {
    if (options.source.indexOf('.pug') !== -1) {
      options.mode = 'pug'
    }
  }

  let cwd = ''
  cwd = options.cwd || builder.cwd

  if (cwd) {
    options.source = path.join(cwd, options.source)
  }

  debug(`source`, {
    cwd,
    source: options.source
  })

  if (options.mode === 'pug') {
    let pugOptions = {
      pretty: process.env.NODE_ENV !== 'production'
    }
    var html = require('pug').compileFile(options.source, pugOptions)(
      options.context
    )

    if (options.transform) {
      const sequential = require('promise-sequential')
      var res = await sequential(
        options.transform.map((transformHandler, index) => {
          return function (previousResponse, responses, count) {
            return transformHandler(previousResponse || html)
          }
        })
      )
      html = res[res.length - 1]
    }
    let writePath = path.join(
      options.distBasePath || process.cwd(),
      getDistPath(options),
      options.target
    )
    await require('sander').writeFile(writePath, html)
    return {
      path: writePath
    }
  }

  if (options.mode === 'scss') {
    var sass = require('node-sass')
    var sourceString = (await require('sander').readFile(
      path.join(process.cwd(), options.source)
    )).toString('utf-8')
    var output = sass.renderSync({
      data: sourceString,
      // indentedSyntax: true,
      outputStyle: 'compressed'
    })
    var compiledString = output.css.toString()
    let writePath = path.join(
      process.cwd(),
      getDistPath(options),
      options.target
    )
    await require('sander').writeFile(writePath, compiledString)
    return {
      path: writePath
    }
  }

  if (options.mode === 'js') {
    var output = (await require('sander').readFile(
      path.join(process.cwd(), options.source)
    )).toString('utf-8')
    let writePath = path.join(
      process.cwd(),
      getDistPath(options),
      options.target
    )
    await require('sander').writeFile(writePath, output)
    return {
      path: writePath
    }
  }

  debug(options.mode.red)
  throw new Error('UNSUPORTED_MODE')
}

module.exports = builder