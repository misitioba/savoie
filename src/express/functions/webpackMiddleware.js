var debug = require('debug')(`app:webpackMiddleware ${`${Date.now()}`.white}`)

module.exports = app => {
  let cache = {}
  return function webpackMiddleware (options = {}) {
    return function webpackMiddlewareInstance (req, res) {
      if (
        process.env.NODE_ENV === 'production' &&
        !!cache[options.entry + '_' + options.output]
      ) {
        return res.sendFile(options.output)
      }

      const webpack = require('webpack')
      let output = {
        filename: options.output.substring(options.output.lastIndexOf('/') + 1),
        path: options.output.substring(0, options.output.lastIndexOf('/') + 1)
      }
      webpack(
        {
          // Configuration Object
          mode:
            process.env.NODE_ENV === 'production'
              ? 'production'
              : 'development',
          entry: options.entry,
          output,
          module: getModuleSection()
        },
        (err, stats) => {
          // Stats Object
          if (err || (stats && stats.hasErrors())) {
            // Handle errors here
            var errors = ''
            if (
              !stats.errors &&
              stats.compilation &&
              stats.compilation.errors
            ) {
              stats.errors = stats.compilation.errors
            }
            if (stats.errors && stats.errors.length > 0) {
              try {
                errors = JSON.stringify(stats.errors || [], null, 4).red
              } catch (err) {
                errors = stats.errors
              }
            } else {
              errors = {
                err: (err && err.stack) || err,
                warnings: stats.warnings,
                errors: stats.errors
                // hasErrors: stats.hasErrors(),
                // stats
              }
            }
            debug('ERROR'.red, errors)
            res.status(500).send()
          } else {
            // Done processing
            res.sendFile(options.output)
            if (process.env.NODE_ENV === 'production') {
              cache[options.entry + '_' + options.output] = true
            }
          }
        }
      )
    }
  }
}

function getModuleSection () {
  return {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}