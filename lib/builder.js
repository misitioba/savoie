var debug = require('debug')(`app:builder ${`${Date.now()}`.white}`)
var builder = {
  distFolder: '',
  cwd: ''
}

function getDistPath (options) {
  return builder.distFolder || options.dist || 'dist'
}

builder.transformFile = async options => {
  var path = require('path')

  if (builder.cwd) {
    options.source = path.join(builder.cwd, options.source)
  }

  if (options.mode === 'pug') {
    var html = require('pug').compileFile(options.source)(options.context)

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
      options.cwd || process.cwd(),
      getDistPath(options),
      options.target
    );
    await require('sander').writeFile(writePath, html)
    /*debug(`write `,{
      distFolder: builder.distFolder,
      options,
      writePath
    })*/
    return
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
    await require('sander').writeFile(
      path.join(process.cwd(), getDistPath(options), options.target),
      compiledString
    )
    return
  }

  if (options.mode === 'js') {
    var output = (await require('sander').readFile(
      path.join(process.cwd(), options.source)
    )).toString('utf-8')
    await require('sander').writeFile(
      path.join(process.cwd(), getDistPath(options), options.target),
      output
    )
    return
  }

  console.log('mode not supported', options.mode)
}

module.exports = builder