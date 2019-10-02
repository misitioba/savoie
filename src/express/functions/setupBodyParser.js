module.exports = app =>
    async function setupBodyParser() {
        const bodyParser = require('body-parser')
        app.use(
            bodyParser.json({
                limit: '50mb'
            })
        )
    }