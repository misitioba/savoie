module.exports = app => {
    return async function dbHealth() {
        return {
            dbResult: await app.dbExecute(`SELECT 1 FROM users LIMIT 1`, []),
            alive: true
        }
    }
}