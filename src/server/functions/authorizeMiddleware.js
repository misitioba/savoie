module.exports = app => {
    const debug = require('./getDebugInstance')(app)('auth', 2)

    return function authorizeMiddleware(roles = []) {
        return async function(req, res, next) {
            if (req.session.isLogged && req.session.userId) {
                req.user = await req.findUser({
                    id: req.session.userId
                })
                next()
            } else {
                if (req.params.redirect) {
                    res.redirect('/login')
                } else {
                    const response = {
                        err: 401
                    }
                    debug(response.err.yellow)
                    res.json(response)
                }
            }
        }
    }
}