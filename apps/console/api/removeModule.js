module.exports = app => {
    return async function removeModule(id) {
        return await app.dbExecute('DELETE FROM modules WHERE id = ?', [id], {
            dbName: this.dbName
        })
    }
}