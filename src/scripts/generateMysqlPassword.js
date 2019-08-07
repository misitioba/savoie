const bcrypt = require('bcrypt')
bcrypt.hash('demo', 10).then(console.log)