module.exports = app => {
    const debugError = app.getDebugInstance('builder', 1)

    var builder = {
        distFolder: '',
        cwd: ''
    }

    function getDistPath(options) {
        return options.dist || builder.distFolder || 'dist'
    }

    builder.transformFileRoute = function(options) {
        let cache = {}
        return async function(req, res) {
            let _options = Object.assign({}, options)
            if (!_options.target) {
                _options.target = require('path').join(req.url, `index.html`)
            }

            if (process.env.NODE_ENV === 'production') {
                if (['pug', 'md'].includes(_options.mode)) {
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
            if (options.source.indexOf('.md') !== -1) {
                options.mode = 'md'
            }
        }

        let cwd = ''
        cwd = options.cwd || builder.cwd

        if (cwd) {
            options.source = path.join(cwd, options.source)
        }

        async function applyTransforms(raw) {
            if (options.transform) {
                const sequential = require('promise-sequential')
                var res = await sequential(
                    options.transform.map((transformHandler, index) => {
                        return function(previousResponse, responses, count) {
                            let transformResult = transformHandler(previousResponse || raw)
                            if (transformResult instanceof Promise) {
                                return transformResult
                            } else {
                                return new Promise(resolve => {
                                    resolve(transformResult)
                                })
                            }
                        }
                    })
                )
                raw = res[res.length - 1]
            }
            return raw
        }

        async function writeRawToTarget(raw) {
            let writePath = path.join(
                options.distBasePath || process.cwd(),
                getDistPath(options),
                options.target
            )
            await require('sander').writeFile(writePath, raw)
            return {
                path: writePath
            }
        }

        function configurePugContext() {
            // try {
            // var fullUrl = req.protocol + '://' + req.get('host')
            // options.context.head.image = fullUrl + _options.context.head.image
            // } catch (err) {}
            options.context = options.context || {}
            options.context.fn = {}
            options.context.fn.publicPath = () => process.env.DOMAIN || fullUrl
            options.context.fn.cwd = function(v = '/') {
                let _cwd = options.context.cwd
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
        }

        if (options.mode === 'md') {
            let raw = (await require('sander').readFile(options.source)).toString(
                'utf-8'
            )
            var marky = require('marky-markdown')
            raw = marky(raw)
            if (raw instanceof Promise) {
                raw = await raw
            }
            raw = await applyTransforms(raw)
            return await writeRawToTarget(raw)
        }

        if (options.mode === 'pug') {
            let pugOptions = {
                pretty: process.env.NODE_ENV !== 'production'
            }
            configurePugContext()
            var raw = require('pug').compileFile(options.source, pugOptions)(
                options.context
            )
            raw = await applyTransforms(raw)
            return await writeRawToTarget(raw)
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

        debugError(options.mode.red)
        throw new Error('UNSUPORTED_MODE')
    }

    return builder
}