module.exports = app =>
    async function setupMysqlSessionMiddleware() {
        app.use(
            app.getMysqlSessionMiddleware({
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PWD,
                host: process.env.MYSQL_HOST,
                port: process.env.MYSQL_PORT,
                database: process.env.MYSQL_DATABASE
            })
        )
    }