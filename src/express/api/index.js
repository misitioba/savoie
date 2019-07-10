var apiRouter = require('express').Router();
apiRouter.use('/test',require('./test'));
apiRouter.use('/auth',require('./auth'));
module.exports = apiRouter;