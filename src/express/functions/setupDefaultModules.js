module.exports = app => {
    async function createModuleIfNotExists(module = {}) {
        let id = await app.dbExecute(
            `SELECT id FROM modules WHERE LOWER(title) = ?`, [module.title], {
                single: true
            }
        )
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