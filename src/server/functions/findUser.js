module.exports = app => {
    return async function findUser(query = {}) {
        if (!query) {
            throw new Error('findUser: provide query')
        }
        if (typeof query !== 'object') {
            query = {
                id: query
            }
        }

        let conn = await app.getMysqlConnection()
        let field = 'id'
        if (query.email) {
            field = 'email'
        }
        if (!query.id && !query.email) {
            throw new Error(`findUser: id or email required`)
        }
        let [rows, fields] = await conn.execute(
            `SELECT * FROM users WHERE ${field} = ?`, [query.id ? query.id : query.email]
        )
        conn.release()
        return (rows.length > 0 && rows[0]) || null
    }
}