var debug = require('debug')(`app:admin:generator ${`${Date.now()}`.white}`)
var builder = require('../../lib/builder');
var utils = require('./utils');

(async() => {

	await builder.transformFile({
		target: '/index.html',
		source: "src/admin/pages/home/home.pug",
		mode: 'pug',
		transform:[
			utils.cacheCDNScripts
		],
		context: {
			
		}
	})
	
	debug('done'.green)

})();