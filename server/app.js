const Koa = require('koa');
const cors = require('@koa/cors');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');
const favicon = require('koa-favicon');
const path = require('path');
const routers = require('./routes/index');
const app = new Koa();
const errorHandler = require('./middleware/error.handler');
const {loggerMiddleware} = require('./middleware/logger.handler');
const notFoundRouter = require('./routes/notfound.router');
app.use(cors());
app.use(favicon(path.join(__dirname,'static','favicon/favicon.ico')));
app.use(bodyParser());
app.use(loggerMiddleware);
app.use(errorHandler);
app.use(routers.routes());
app.use(notFoundRouter.routes());
render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: true
})
app.proxy = true;
module.exports = app;