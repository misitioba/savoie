module.exports = app =>
    async function save(p) {
        return app.dbSaveDocument(p)
    }