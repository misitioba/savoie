module.exports = {
    cacheCDNScripts
}

async function cacheCDNScripts(html) {
    var sander = require('sander')
    var path = require('path')
    var axios = require('axios')
    const cheerio = require('cheerio')
    const $ = cheerio.load(html)
    var urlItems = []
    $('script').each(function() {
        let url = $(this).attr('src')
        urlItems.push({
            fileName: url.substring(url.lastIndexOf('/') + 1),
            url: url,
            el: $(this)
        })
    })
    urlItems = urlItems.filter(urlItem => {
        if ((urlItem.el.attr('cache') || '').toString() === "0") {
            //console.log(`NO CACHE FOR ${urlItem.fileName}`.red.bgWhite)
            return false;
        }
        return urlItem.url.indexOf('http') !== -1
    })
    let cachedFileNames = await sander.readdir(`dist/cache`)
    await Promise.all(
        urlItems.map(urlItem =>
            (async() => {
                let exists = cachedFileNames.includes(urlItem.fileName);
                if (!exists) {
                    console.log(`Caching ${urlItem.fileName}`.grey);
                    try {
                        let raw = await axios.get(urlItem.url)
                        sander.writeFile(`dist/cache/${urlItem.fileName}`, raw.data);
                        urlItem.el.attr('src', `/cache/${urlItem.fileName}`);
                    } catch (err) {}
                }
            })()
        )
    );
    html = $.html();
    return html;
}