module.exports = app =>
    async function getModules() {
        return app.dbExecute(`SELECT * FROM modules`, [])
    }