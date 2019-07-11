var apiRouter = require('express').Router();
apiRouter.use('/test', require('./test'));
apiRouter.use('/auth', require('./auth'));
apiRouter.use('/email', require('./email'));
module.exports = apiRouter;