module.exports = app => {
    return async function saveMurmur(hash, components, last_visit) {
        return await app.dbExecute(
            `
        INSERT INTO 
        murmurs(hash,components, last_visit)VALUES(?,?,?)
        ON DUPLICATE KEY UPDATE
        hash = VALUES(hash),
        last_visit = VALUES(last_visit)
          `, [hash, components, last_visit], {}
        )
    }
}