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
                handler: async function(p = {}, reportRequest) {
                    if (window._funqlGetMode) {
                        return window.api.funqlGet(
                            `${window.api.funqlEndpointURL}funql-api`,
                            p,
                            reportRequest
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

                    reportRequest(p)
                    return axios.post(
                        `${window.api.funqlEndpointURL}funql-api?${query}`,
                        p
                    )
                }
            }
        ]

        async function funqlGet(uri, p, reportRequest) {
            if (p.transform) {
                p.transform = btoa(p.transform.toString())
                p.transformEncoded = true
            }
            let body = btoa(JSON.stringify(p))
            body = body.split('+').join('PLUS')
            try {
                reportRequest({
                    body: p,
                    bodyEncoded: body
                })
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
(()=>{

    let verbose = false
    if(window.location.origin.indexOf('localhost')!==-1) verbose = true
    
    try{
        var urlParams = new URLSearchParams(location.search);
        if(urlParams.get('verbose').toString()==='1') verbose = true
    }catch(err){}

    window.api = {
        funqlEndpointURL: '/',
        funqlGet:${funqlGet}
    }
    
    __BUNDLE_PARTIAL__

    
    function timestamp(){
        var startDate = new Date();
        return function(){
            var endDate   = new Date();
            var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            return seconds+'s';
        }
    }

})();
        `
        let bundlePartial = ''
        methods.forEach(m => {
            bundlePartial += `api.${m.name} = function(p){
                return new Promise((resolve,reject)=>{
                    const elapsed = timestamp()
                    var handler = ${m.handler}
                    
                    let name = '${m.name} '+(p&&p.name||'')

                    let reportedRequest = p

                    handler(p, rr => reportedRequest = rr).then(r=>{
                      if(!r)  {
                          r = {} //empty response equal to empty object
                            //reject(new Error('empty response'));
                      }
                      if(r && r.err) onError(r.err)
                      if(r && !r.err) {

                        if(verbose){
                          console.info(name,elapsed(),{
                              request: reportedRequest,
                              response: r
                          })
                        }

                          if(r.result) resolve(r.result)
                          else resolve(r)
                      }
                    }).catch(onError)
                    
                    function onError(err){

                        console.warn(name,elapsed(),{
                            request: reportedRequest,
                            response: err.stack || err
                        })
                        reject(err)
                    }


                })
            };
            `
        })

        bundle = bundle.split('__BUNDLE_PARTIAL__').join(bundlePartial)

        sander.writeFile(path.join(process.cwd(), `dist/api.js`), bundle)
    }
}