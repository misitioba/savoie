require('colors')
require('dotenv').config({ silent: true })
const yargs = require('yargs')
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const sh = require('sh-exec')
const path = require('path')
const sander = require('sander')

module.exports.printHeader = () => {
    clear()
    console.log(
        chalk.red(
            figlet.textSync('S A V O I E', {}) // horizontalLayout: 'full'
        )
    )
}

module.exports.getArgv = () => {
    return yargs
        .command('db <operation> [operationParam]', 'db Operation', function(
            yargs
        ) {
            return yargs
                .option('d', {
                    alias: 'dbname',
                    describe: 'Specify a database name',
                })
                .option('f', {
                    alias: 'force',
                    describe: 'Force an action',
                })
                .option('u', {
                    alias: 'username',
                    describe: 'Set an username/email',
                })
                .option('p', {
                    alias: 'password',
                    describe: 'Set a password',
                })
        })

    .help().argv
}

module.exports.execute = async mainCommand => {
    

    if (mainCommand === 'db') {
        const app = require('express')
        require('./express/functions')(app)

        await app.loadApiFunctions({
            path: require('path').join(__dirname, '/express/funql_api'),
            scope: {
                dbName: args.dbname || process.env.MYSQL_DATABASE || 'savoie',
            },
        })

        if (args.operation === 'check') {
            var debug = p => console.log(`savoie-cli db CHECK`, p)
            try {
                await app.dbExecute(`show databases`, [], {})
                debug(`Connected`.green)
            } catch (err) {
                debug(`Not connected`.red)
            }
        }

        if (args.operation === 'tables') {
            var debug = p => console.log(`savoie-cli db TABLES`, p)
            let dbName = args.dbname || process.env.MYSQL_DATABASE || 'savoie'
            try {
                let tables = await app.dbExecute(`show tables`, [], {
                    dbName,
                })
                debug(`Tables in ${dbName}`.green)
                debug(tables.map(r => r[Object.keys(r)[0]]))
            } catch (err) {
                debug({
                    err: err.red,
                })
            }
        }

        if (args.operation === 'createUser') {
            var debug = p => console.log(`savoie-cli db createUser`, p)
            let dbName = args.dbname || process.env.MYSQL_DATABASE || 'savoie'
            try {
                let r = await app.api.common_create_account({
                    email: args.email || args.username,
                    password: args.password,
                })
                debug(r)
                debug(`done`.green)
            } catch (err) {
                debug({
                    err: err.stack.red,
                })
            }
        }

        if (args.operation === 'list') {
            var debug = p => console.log(`savoie-cli db LIST`, p)
            let dbName = args.dbname || process.env.MYSQL_DATABASE || 'savoie'
            try {
                let query = `show databases`
                if (['modules', 'users', 'feedbacks'].includes(args.operationParam)) {
                    query = `SELECT * FROM ${args.operationParam}`
                }
                let r = await app.dbExecute(query, [], {
                    dbName,
                })
                debug(r)
            } catch (err) {
                debug({
                    err: err.stack.red,
                })
            }
        }
        if (args.operation === 'populate') {
            var debug = p => console.log(`savoie-cli db GENERATE`, p)
            try {
                let dbName = args.dbname || process.env.MYSQL_DATABASE || 'savoie'

                let answers = await require('inquirer').prompt([{
                    type: 'confirm',
                    name: 'confirm',
                    default: true,
                    message: `Populate existing database '${dbName}' ? (db must be empty)`,
                }, ])

                if (!answers.confirm) {
                    console.log('Aborting..')
                    process.exit(0)
                }

                let r = []
                try {
                    r = await app.dbExecute(`show tables`, [], {
                        dbName,
                    })
                } catch (err) {}

                if (r.length > 0 && !args.force) {
                    debug(`Database ${dbName} is not empty`.red)
                    debug(`Try running with --dbname=newDatabase or --force`.yellow)
                } else {
                    debug(`${dbName}`.green)
                    debug(`Generating schemes`)
                    let initialMigrationPath = path.join(
                        __dirname,
                        './migrations/initial.sql'
                    )
                    let initialMigrationSQL = (await sander.readFile(
                        initialMigrationPath
                    )).toString('utf-8')
                    initialMigrationSQL = initialMigrationSQL
                        .split(`__DATABASE_NAME__`)
                        .join(dbName)
                    let conn = await app.getMysqlConnection({})
                    await conn.query(initialMigrationSQL)
                    conn.release()
                    debug(`Database ${dbName} is ready to use`.green)
                }
            } catch (err) {
                debug({
                    err,
                })
            }
        }
        process.exit(0)
    }
}