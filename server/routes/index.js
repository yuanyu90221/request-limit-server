const router = require('koa-router');
const healthCheckRouter = require('./healthChecker.router');
const recordIPCountRouter = require('./recordIPCount.router');
const RootRouter = new router();
RootRouter.use(recordIPCountRouter.routes());
RootRouter.use(healthCheckRouter.routes());
module.exports = RootRouter;