module.exports = app => {
    return async function generateRestClient(options) {
        var sander = require('sander');
        var path = require('path')


        var methods = [{
            name: 'getLoggedUser',
            handler: function() {
                return axios.get('/api/auth/loggedUser');
            }
        }, {
            name: 'loginWithEmailAndPassword',
            handler: function(p) {
                return axios.post('/api/auth', p);
            }
        }, {
            name: 'logout',
            handler: function() {
                return axios.get('/api/auth/logout');
            }
        }]

        let bundle = `
            let api = {}
        `
        methods.forEach(m => {
            bundle += `api.${m.name} = function(p){
                return new Promise((resolve,reject)=>{
                    var handler = ${m.handler}
                    console.log('api ${m.name}', p||'(no params)')
                    handler(p).then(r=>{
                      if(!r)  reject(new Error('empty response'));
                      if(r && r.err) onError(r.err)
                      if(r && !r.err) {
                          console.info('api ${m.name}',r)
                          if(r.result) resolve(r.result)
                          else resolve(r)
                      }
                    }).catch(onError)
                    function onError(err){
                        console.warn('api ${m.name}', err.stack)
                        reject(err)
                    }
                })
            };
            `
        })


        sander.writeFile(path.join(process.cwd(), `dist/api.js`), bundle)
    }
}