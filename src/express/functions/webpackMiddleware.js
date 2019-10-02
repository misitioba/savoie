var debug = require('debug')(`app:webpack ${`${Date.now()}`.white}`)

module.exports = app => {
  let cache = {}
  return function webpackMiddleware (options = {}) {
    // options.output is deprecated, it will be completed automatically
    options.output = require('path').join(
      require('osenv').tmpdir(),
      require('uniqid')() + `-` + require('path').basename(options.entry)
    )

    return function webpackMiddlewareInstance (req, res) {
      if (!options.entry) return res.status(404).send() // not found

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
        async (err, stats) => {
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
            let html = (await require('sander').readFile(
              options.output
            )).toString('utf-8')
            if (options.transform) {
              html = options.transform(html, req)
              if (html instanceof Promise) {
                html = await html
              }
            }
            // res.set('Content-Type', 'text/javascript')
            res.header('Content-Type', 'text/javascript')
            res.send(html)
            // res.sendFile(options.output)
            if (process.env.NODE_ENV === 'production' && !options.transform) {
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
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              [
                '@babel/preset-react',
                {
                  pragma: 'dom', // default pragma is React.createElement
                  pragmaFrag: 'DomFrag', // default is React.Fragment
                  throwIfNamespace: false // defaults to true
                }
              ]
            ],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  // pragma: 'Preact.h', // default pragma is React.createElement
                  // pragmaFrag: 'Preact.Fragment', // default is React.Fragment
                  // throwIfNamespace: false // defaults to true
                }
              ],
              [
                '@babel/plugin-transform-runtime',
                {
                  absoluteRuntime: false,
                  corejs: false,
                  helpers: true,
                  regenerator: true,
                  useESModules: false
                }
              ]
            ]
          }
        }
      }
    ]
  }
}