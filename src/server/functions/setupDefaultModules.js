module.exports = app => {
    async function createModuleIfNotExists(module = {}) {
        let match = await app.dbExecute(
            `SELECT id FROM modules WHERE LOWER(title) = LOWER(?)`, [module.title], {
                single: true
            }
        )
        if (match) {
            module.id = match.id
        }
        module.enabled = 1
        await app.dbSaveDocument({
            _table: 'modules',
            _fields: ['title', 'enabled'],
            ...module
        })
    }

    return async function setupDefaultModules() {
        await createModuleIfNotExists({
            title: 'console'
        })
    }
}