module.exports = app =>
    async function login(username, password) {
        if (process.env.MYSQL_PWD == password) {
            let token = JSON.stringify({
                username,
                expires: Date.now() + 1000 * 60 * 60 * 24
            })

            var CryptoJS = require('crypto-js')
            token = CryptoJS.AES.encrypt(token, process.env.SESSION_SECRET).toString()
            return {
                username,
                token
            }
        } else {
            return false
        }
    }