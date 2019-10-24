module.exports = app => {
    const cacheDirectory = require('path').join(
        require('osenv').tmpdir(),
        require('uniqid')('savoie-cdn-cache')
    )

    return async function cacheCDNScripts(html) {
        var debug = app.getDebugInstance('cache')
        var sander = require('sander')
        await sander.mkdir(cacheDirectory)
        var path = require('path')
        var axios = require('axios')
        const cheerio = require('cheerio')
        const $ = cheerio.load(html)
        var urlItems = []
        $('script').each(function() {
            let url = $(this).attr('src') || ''
            urlItems.push({
                fileName: url.substring(url.lastIndexOf('/') + 1),
                url: url,
                el: $(this)
            })
        })
        urlItems = urlItems.filter(urlItem => {
            if (!urlItem.url) {
                return false
            }
            if ((urlItem.el.attr('cache') || '').toString() === '0') {
                // console.log(`NO CACHE FOR ${urlItem.fileName}`.red.bgWhite)
                return false
            }
            return urlItem.url.indexOf('http') !== -1
        })
        let cachedFileNames = await sander.readdir(cacheDirectory)
        await Promise.all(
            urlItems.map(urlItem =>
                (async() => {
                    let exists = cachedFileNames.includes(urlItem.fileName)
                    if (!exists) {
                        debug(`${urlItem.fileName} cdn cached`.grey)

                        try {
                            let raw = await axios.get(urlItem.url)
                            sander.writeFile(`dist/cache/${urlItem.fileName}`, raw.data)
                            urlItem.el.attr('src', `/cache/${urlItem.fileName}`)
                        } catch (err) {}
                    }
                })()
            )
        )
        html = $.html()
        return html
    }
}