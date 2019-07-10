var debug = require('debug')(`app:getMysqlConnection ${`${Date.now()}`.white}`);
module.exports = app => {
	let connection = null;
	return async function getMysqlConnection(options = {}) {
		if(!!connection){
			return connection;
		}
		const mysql = require('mysql2/promise')
		connection = await mysql.createConnection({
			host: process.env.MYSQL_URI || 'localhost',
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PWD,
			database: options.dbName || process.env.MYSQL_DATABASE ||  'express_test'
		});
		//debug(`Using password? ${!!process.env.MYSQL_PWD}`)
		return connection;
	}
}