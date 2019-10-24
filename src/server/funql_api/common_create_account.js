module.exports = app => {
    var debug = require('debug')(`app:api:common_create_account ${`${Date.now()}`.white}`)
    return async function common_create_account(form) {
        if (!form.password) return {
            err: 'password required'
        }
        let creation_date = require('moment-timezone')().tz('Europe/Paris')._d.getTime()
        let alreadyExists = await app.dbExecute(`SELECT 1 FROM users WHERE email = ?`, [form.email], {
            exists: true,
            dbName: this.dbName
        })
        if (alreadyExists) {
            return {
                err: "ALREADY_EXISTS"
            }
        }
        var bcrypt = require('bcrypt')
        form.password = await bcrypt.hash(form.password, 10)
        let result = await app.dbExecute(
            `
INSERT INTO users
(email, password, creation_date)
VALUES(?,?,?)
    `,
            [
                form.email,
                form.password,
                creation_date
            ], {
            dbName: this.dbName
        })
        return app.dbExecute(`SELECT id, email FROM users WHERE id = ?`, [result.insertId], {
            single: true,
            dbName: this.dbName
        })
    }
}