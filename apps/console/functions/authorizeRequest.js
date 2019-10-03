module.exports = app => {
    var debug = app.getDebugInstance('authorizeRequest')
    return async function authorizeRequest(data) {
        if (data && data._token) {
            var CryptoJS = require('crypto-js')
            var token = CryptoJS.AES.decrypt(
                data._token,
                process.env.SESSION_SECRET
            ).toString(CryptoJS.enc.Utf8)
            try {
                token = JSON.parse(token)
                if (Date.now() < token.expires) {
                    return true
                } else {
                    return false
                }
            } catch (err) {
                debug(err.stack.red)
                return false
            }
        }
        return false
    }
}