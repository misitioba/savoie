module.exports = app => {
    return async function generateRestClient(options) {
        var sander = require('sander')
        var path = require('path')

        var methods = [{
                name: 'getLoggedUser',
                handler: function() {
                    return axios.get('/api/auth/loggedUser')
                }
            },
            {
                name: 'loginWithEmailAndPassword',
                handler: function(p) {
                    return axios.post('/api/auth', p)
                }
            },
            {
                name: 'logout',
                handler: function() {
                    return axios.get('/api/auth/logout')
                }
            },
            {
                name: 'funql',
                handler: async function(p = {}) {
                    if (window._funqlGetMode) {
                        return window.api.funqlGet(
                            `${window.api.funqlEndpointURL}funql-api`,
                            p
                        )
                    }

                    if (!(p.args instanceof Array)) {
                        p.args = [p.args]
                    }

                    if (p.transform) p.transform = p.transform.toString()

                    let query = ''

                    if (p.multipart) {
                        var formData = new FormData()
                        Object.keys(p.multipart).forEach(key => {
                            formData.append(key, p.multipart[key])
                        })
                        p.args.forEach(arg => {
                            if (typeof arg === 'object' && !(arg instanceof Array)) {
                                Object.keys(arg).forEach(key => {
                                    formData.append(key, arg[key])
                                })
                            }
                        })
                        formData.append('_funqlName', p.name)
                        if (p.transform) {
                            formData.append('_funqlTransform', p.transform)
                        }
                        p = formData
                        query = `multiparty=1`
                        let r = await fetch(
                            `${window.api.funqlEndpointURL}funql-api?${query}`, {
                                method: 'POST',
                                body: formData
                            }
                        )
                        return r.json()
                    }

                    if (query === '') {
                        query = `name=${p.name}&ns=${p.namespace}`
                    }

                    return axios.post(
                        `${window.api.funqlEndpointURL}funql-api?${query}`,
                        p
                    )
                }
            }
        ]

        async function funqlGet(uri, p) {
            if (p.transform) {
                p.transform = btoa(p.transform.toString())
                p.transformEncoded = true
            }
            let body = btoa(JSON.stringify(p))
            body = body.split('+').join('PLUS')
            try {
                let res = await fetch(uri + `?body=${body}`)
                try {
                    res = await res.json()
                } catch (err) {
                    if (err.stack.indexOf('Unexpected end of JSON input') !== -1) {
                        // some calls could return nothing
                        return {}
                    }
                    throw err
                }
                return res
            } catch (err) {
                return {
                    err: err.stack || err || 'SERVER_ERROR'
                }
            }
        }

        let bundle = `
            window.api = {
                funqlEndpointURL: '/',
                funqlGet:${funqlGet}
            }
        `
        methods.forEach(m => {
            bundle += `api.${m.name} = function(p){
                return new Promise((resolve,reject)=>{
                    var handler = ${m.handler}
                    console.log('api ${m.name}', p||'(no params)')
                    handler(p).then(r=>{
                      if(!r)  {
                          r = {} //empty response equal to empty object
                            //reject(new Error('empty response'));
                      }
                      if(r && r.err) onError(r.err)
                      if(r && !r.err) {
                          console.info('api ${m.name}',(p||{}).name,r)
                          if(r.result) resolve(r.result)
                          else resolve(r)
                      }
                    }).catch(onError)
                    function onError(err){
                        console.warn('api ${
  m.name
}',p.name||'', err.stack || err)
                        reject(err)
                    }
                })
            };
            `
        })

        sander.writeFile(path.join(process.cwd(), `dist/api.js`), bundle)
    }
}