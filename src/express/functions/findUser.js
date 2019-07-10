module.exports = app => {
  return async function findUser (query) {
    let conn = await app.getMysqlConnection();
    let field = 'id'
    if (query.email) {
      field = 'email'
    }
    if (!query.id && !query.email) {
      throw new Error(`findUser: id or email required`)
    }
    let [rows, fields] = await conn.execute(
      `SELECT * FROM users WHERE ${field} = ?`,
      [query.id ? query.id : query.email]
    );
    return (rows.length > 0 && rows[0]) || null
  }
}
