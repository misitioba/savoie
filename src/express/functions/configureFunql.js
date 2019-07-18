var debug = require('debug')(
        `app:express:funql ${`${Date.now()}`.white}` )
module.exports = app => {
    return function configureFunql() {
        app.post('/funql', async function configureFunqlRoute(req, res) {
            let data = req.body
            let name = data.name
            if(!app.api[name]){
                res.json({
                    err: "INVALID_NAME"
                })
            }else{
                try{
                    let result = await app.api[name].apply(app.api,data.args||[])
                    if(data.transform && typeof data.transform === 'string'){
                        var transformHandler = ''
                        eval(`transformHandler = ${data.transform}`)
                        let transformed = transformHandler(result)
                        if(transformed instanceof Promise){
                            result = await transformed
                        }else{
                            result = transformed
                        }
                    }
                    res.json(result)
                }catch(err){
                    debug(err.stack.red)
                    res.json({
                        err:"500"
                    })
                }
            }
        })
    }
}