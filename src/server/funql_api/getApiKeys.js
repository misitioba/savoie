module.exports = app => async() => {
    return Object.keys(app.api)
        .filter(key => typeof app.api[key] === 'function')
        .concat(getKeysFromNamespaces(app.api))
}

function getKeysFromNamespaces(root) {
    let keys = []
    Object.keys(root).forEach(key => {
        if (typeof root[key] === 'object') {
            keys = keys.concat(
                Object.keys(root[key]).map(subkey => {
                    return `${key}.${subkey}`
                })
            )
        }
    })
    return keys
}