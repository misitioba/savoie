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
        .command('dev', 'Start the development server', function(yargs) {
            return yargs.option('port', {
                alias: 'port',
                describe: 'PORT to Listen',
            })
        })
        .command('create <name>', 'Creates a new project', function(yargs) {
            return yargs.option('u', {
                alias: 'url',
                describe: 'the URL to make an HTTP request to',
            })
        })
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
    console.log('CLI MAINCOMMAND', mainCommand)

    if (mainCommand === 'create') {
        let appTplPath = path.join(__dirname, './templates/app.js')
        let appTpl = (await sander.readFile(appTplPath)).toString('utf-8')
        let appIndexPath = path.join(process.cwd(), 'apps', args.name, 'index.js')
        await sander.writeFile(appIndexPath, appTpl)
            //sh`echo ${appTpl}`
            //await sh`git clone https://gitlab.com/javimosch/savoie.git ${args.name}`
    }

    if (mainCommand === 'init') {
        var debug = p => console.log(`savoie-cli INIT`, p)

        if ((await sander.readdir(__dirname)).length > 0 && !args.force) {
            debug(`Directory is not empty`.red)
            return
        }

        debug(`You will create a new project. Let's start.`)
        let inquirer = require('inquirer')
        let answers = await inquirer.prompt([{
                type: 'input',
                name: 'PROJECT_NAME',
                default: 'mysavoie',
                message: 'Project name :',
            },
            {
                type: 'input',
                name: 'MYSQL_HOST',
                default: '178.128.254.49',
                message: 'MYSQL_HOST (buil-in database by default. Request credentials to misitioba.com) :',
            },
            {
                type: 'input',
                name: 'MYSQL_USER',
                message: 'MYSQL_USER (You can leave blank and complete later) :',
            },
            {
                type: 'input',
                name: 'MYSQL_PWD',
                message: 'MYSQL_PWD (You can leave blank and complete later) :',
            },
        ])

        let config = require(path.join(__dirname, './templates/appConfig.js'))
        let writePath = path.join(process.cwd(), 'savoie.config.js')
        Object.assign(config.envs, answers)
        await sander.writeFile(
            writePath,
            `module.exports = ${JSON.stringify(config, null, 4)}`
        )

        let package = require(path.join(__dirname, './templates/app_package.json'))
        package.name = answers.PROJECT_NAME
        let packagePath = path.join(process.cwd(), 'package.json')
        await sander.writeFile(packagePath, `${JSON.stringify(package, null, 4)}`)

        let gitignoreTplPath = path.join(__dirname, './templates/app_gitignore')
        let gitignoreTpl = await sander.readFile(gitignoreTplPath).toString('utf-8')
        let gitignorePath = path.join(process.cwd(), '.gitignore')
        await sander.writeFile(
            gitignorePath,
            `${JSON.stringify(gitignoreTpl, null, 4)}`
        )

        debug(`Project ready`.green)
        debug(`Dont't forget to configure envs inside savoie.config.js`)
        debug(`Read more at savoie.misitioba.com/documentation`)
    }

    if (mainCommand === 'createConfig') {
        var debug = p => console.log(`savoie-cli CREATECONFIG`, p)
        let writePath = path.join(process.cwd(), 'savoie.config.js')
        if (await sander.exists(writePath)) {
            debug(`Already exists`.green)
        } else {
            let tplPath = path.join(__dirname, './templates/appConfig.js')
            let tplRaw = (await sander.readFile(tplPath)).toString('utf-8')
            await sander.writeFile(writePath, tplRaw)
            debug(`Config created`.green)
        }
    }

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