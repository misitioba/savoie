#!/usr/bin/env node

let cli = require('./cli')
let args = cli.getArgv()

cli.printHeader()
let mainCommand = args['_'][0]
if (!mainCommand) {
    require('./server')
        .start(args)
        .catch(function onServerError(err) {
            console.log(err)
        })
} else {
    cli.execute(mainCommand)
}