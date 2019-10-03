module.exports = app => {
    return async function selectQuery(data) {
        return await app.dbExecute(
            `
SELECT ${data.select}
    `,
            data.params || [], {
                dbName: this.dbName,
                single: data.single
            }
        )
    }
}