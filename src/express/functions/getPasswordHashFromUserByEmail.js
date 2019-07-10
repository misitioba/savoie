module.exports = app => {
    return async function getPasswordHashFromUserByEmail(email){
        let dbConnection = await app.getMysqlConnection();
        const [rows, fields] = await dbConnection.execute(`SELECT * FROM users WHERE email = ?`, [email]);
        if(rows.length>0){
            return rows[0].password;
        }
    }
}