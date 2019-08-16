function clousureEval(_evalCode, _scope) {
  with (_scope) {
    // prints "foo" if _scope.b=foo //console.log(eval('b'))
    // prints foo if _scope.b=foo //console.log(eval('this.b'))
    return function () {
      eval(_evalCode)
    }.call(_scope)
  }
}

module.exports = app => {
  var debug = require('debug')(`app:express:funql ${`${Date.now()}`.white}`)
  return function configureFunql() {
    app.get('/funql', async function configureFunqlRoute(req, res) {
      res.header('Access-Control-Allow-Origin', req.headers.origin)
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      )
      
      //console.log('START'+req.query.body+'END')
      let body = req.query.body
      body = body.split('PLUS').join('+')
      let data = JSON.parse(require('atob')(body))
      if (data.transformEncoded) {
        data.transform = require('atob')(data.transform)
      }
      await executeFunql(data, req, res)
    })

    app.post(
      '/funql',
      app.authenticateUser(),
      require('cors')(),
      async function configureFunqlRoute(req, res) {
        if (req.query.multiparty === '1') {
          var multiparty = require('multiparty')
          var form = new multiparty.Form()
          var util = require('util')
          form.parse(req, async function (err, fields, files) {
            //console.log('MULTIPART!!')
            console.log('TRACE', util.inspect({ fields: fields, files: files }))
            let data = {
              name: fields._funqlName,
            }
            if (fields._funqlTransform) {
              data.transform = fields._funqlTransform
            }
            let arg = {}
            Object.keys(fields)
              .filter(k => k.indexOf('_') !== 0)
              .forEach(k => {
                arg[k] = fields[k][0]
              })

            let filesArg = {}
            Object.keys(files).forEach(k => {
              filesArg[k] = files[k][0]
            })

            data.args = [arg, filesArg]
            await executeFunql(data, req, res)
          })
        } else {
          let data = req.body
          await executeFunql(data, req, res)
        }
      }
    )
  }

  async function executeFunql(data, req, res) {
    let name = data.name
    let functionScope = {
      req,
      res,
      name,
      user: req.user,
    }
    app.api = app.api || {}
    if (!app.api[name]) {
      res.json({
        err: 'INVALID_NAME',
      })
    } else {
      try {
        if (data.args && data.args.length === 1 && data.args[0] === null) {
          data.args = null
        }
        let result = await app.api[name].apply(functionScope, data.args || [])
        if (data.transform && typeof data.transform === 'string') {
          var transformHandler = (result, options = {}) => {
            var moment = require('moment')
            var __handler = {}
            clousureEval(`__handler.fn = ${data.transform}`, {
              __handler,
              moment: require('moment'),
            })
            return __handler.fn(result)
          }

          let transformed = transformHandler(result)

          if (transformed instanceof Promise) {
            result = await transformed
          } else {
            result = transformed
          }
        }
        res.json(result)
      } catch (err) {
        debug(err.stack.red)
        res.json({
          err: '500',
        })
      }
    }
  }
}