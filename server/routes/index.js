const router = require('koa-router');
const healthCheckRouter = require('./healthChecker.router');
const RootRouter = new router();
RootRouter.use(healthCheckRouter.routes());
module.exports = RootRouter;