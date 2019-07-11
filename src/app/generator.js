var debug = require('debug')(`app:admin:generator ${`${Date.now()}`.white}`)
var builder = require('../../lib/builder');
var utils = require('./utils');

(async() => {

	await builder.transformFile({
		target: '/index.html',
		source: "src/app/pages/home/home.pug",
		mode: 'pug',
		transform:[
			utils.cacheCDNScripts
		],
		context: {
			
		}
	});

	await builder.transformFile({
		target: '/login/index.html',
		source: "src/app/pages/login/login.pug",
		mode: 'pug',
		transform:[
			utils.cacheCDNScripts
		],
		context: {
			isDevelopment: process.env.NODE_ENV!=='production'
		}
	})
	
	debug('done'.green)

})();