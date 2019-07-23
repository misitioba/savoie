function clousureEval(_evalCode, _scope) {
    with(_scope) {
        // prints "foo" if _scope.b=foo //console.log(eval('b'))
        // prints foo if _scope.b=foo //console.log(eval('this.b'))
        return function() {
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

      let data = JSON.parse(require('atob')(req.query.body))
      if (data.transformEncoded) {
        data.transform = require('atob')(data.transform)
      }
      await executeFunql(data, res)
    })

    app.post('/funql', async function configureFunqlRoute(req, res) {
      let data = req.body
      await executeFunql(data, req, res)
    })
  }

  async function executeFunql(data, req, res) {
    let name = data.name
    let functionScope = {
      req,
      res,
      name,
    }
    app.api = app.api || {}
    if (!app.api[name]) {
      res.json({
        err: 'INVALID_NAME',
      })
    } else {
      try {
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