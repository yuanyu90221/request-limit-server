const Koa = require('koa');
const cors = require('@koa/cors');
const render = require('koa-ejs');
const favicon = require('koa-favicon');
const path = require('path');
const app = new Koa();
const errorHandler = require('./middleware/error.handler');
const {loggerMiddleware} = require('./middleware/logger.handler');``
const {recordIPCountFunc} = require('./middleware/recordIPCount.handler');
const {loadLuaScript} = require('./redis/lua.util');
const HttpException = require('./exceptions/HttpException');
const ErrCode = require('./enums/errorCode');
let scriptSha = '';
app.use(favicon(path.join(__dirname,'static','favicon/favicon.ico')));
app.use(cors());
app.use(loggerMiddleware);
app.use(errorHandler);
app.use(async(ctx, next)=> {
    try {
        if (scriptSha==='') {
            let {sha} = await loadLuaScript();
            scriptSha = sha;
        }
        ctx.state.sha = scriptSha;
        await next();
    } catch (err) {
        if (err.name !=='HttpException') {
            const message = err.message? err.message: err.toString();
            err = new HttpException({status: 500, message:message, code: ErrCode.LoadLUAScriptError});
        }
        throw err;
    }
});
app.use(recordIPCountFunc);
render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'html',
    cache: false
})
app.use(async(ctx)=>{
    try {
        let {client_ip, currentCount}  = ctx.state;
        await ctx.render('index', {
            ip: client_ip,
            count: currentCount,
            error: null
        })
    } catch (err) {
        if (err.name !=='HttpException') {
            const message = err.message? err.message: err.toString();
            err = new HttpException({status: 500, message:message, code: ErrCode.Unknown});
        }
        throw err;
    }
 });
app.proxy = true;
module.exports = app;