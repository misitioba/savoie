import auth from './auth'
export default async function(options = {}) {
    let _token = localStorage.getItem('token')
    options._token = _token
    options.namespace = options.namespace || 'console'
    return new Promise((resolve, reject) => {
        window.api
            .funql(options)
            .then(resolve)
            .catch(err => {
                if (err === 401) {
                    auth.isAuthenticated = false
                }
                reject(err)
            })
    })
}