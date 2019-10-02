module.exports = app => {
    return async function cleanOutputDirectory() {
        let distFolder = require('path').join(process.cwd(), 'dist') + '**'
        await rimraf(distFolder)

        function rimraf(glob) {
            var debug = app.getDebugInstance('rimraf')
            debug(glob)
            return new Promise((resolve, reject) => {
                require('rimraf')(glob, err => {
                    if (err) reject(err)
                    else resolve()
                })
            })
        }
    }
}