module.exports = app => {
    return async function dbSaveDocument(form) {
        // params:
        // _table => database table
        // _fields => array of strings with fields to save or update, e.g: ['name']
        // _options => dbExecute options
        // id => primary key
        // ... e.g: name, age, email (all the document data)

        let args = []
        let setSQL = ``
        let dbExecuteOptions = form._options || {}
        if (!form._fields) {
            throw new Error('_fields required')
        }
        if (!form._table) {
            throw new Error('_table required')
        }
        if (form.id) {
            setSQL = form._fields
                .map(fieldName => {
                    return `${fieldName} = ?`
                })
                .join(', ')
            args = form._fields
                .filter(fn => fn != 'id')
                .map(fieldName => {
                    return form[fieldName]
                })
            args.push(form.id)

            return await app.dbExecute(
                `UPDATE ${form._table} SET ${setSQL} WHERE id = ?`,
                args,
                dbExecuteOptions
            )
        } else {
            args = form._fields
                .filter(fn => fn != 'id')
                .map(fieldName => {
                    return form[fieldName]
                })
            return await app.dbExecute(
                `INSERT INTO ${form._table} (${form._fields
          .map(f => f)
          .join(', ')})VALUES(${form._fields.map(f => '?').join(', ')})`,
                form._fields.map(name => form[name]),
                dbExecuteOptions
            )
        }
    }
}