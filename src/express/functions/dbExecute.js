module.exports = app => {
    return async function dbExecute(query, params, options = {}) {
        let conn = await app.getMysqlConnection(options)
        let [rows, fields] = await conn.execute(query, params)
        if (options.single) {
            return (rows && rows.length > 0 && rows[0]) || null;
        }
        if (options.exists) {
            return (rows && rows.length > 0) ? true : false
        }
        return rows;
    }
}