module.exports = app => {
    return async function saveMurmurEvent(hash, name, data, creation_date) {
        return await app.dbExecute(
            `
        INSERT INTO 
        murmur_events(hash,name, data, creation_date)VALUES(?,?,?,?)
        `, [hash, name, data, creation_date], {}
        )
    }
}