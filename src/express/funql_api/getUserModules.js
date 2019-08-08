module.exports = app => {
    return async function getUserModules(id) {
        return await app.dbExecute(
            'SELECT * FROM user_modules WHERE user_id = ?', [this.req.user.id], {}
        )
    }
}