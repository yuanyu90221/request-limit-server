const router = require('koa-router');
const HttpException = require('../exceptions/HttpException');
const ErrCode = require('../enums/errorCode');
const recordIPCountRouter = new router();
const config = require('../config');
const redisExpireTime = config.REDIS_EXPIRE_TIME;
const redisLimitIPCount = config.REDIS_LIMIT_IP_COUNT;
const {loadLuaScript, checkLoadScript, execLuaScriptSha, flushLuaScript} = require('../redis/lua.util');
const { logger } = require('../lib/logger');
let scriptSha = '';
(async()=>{
    try {
        // let result = await flushLuaScript();
        // console.log(result);
        let {sha} = await loadLuaScript();
        scriptSha = sha;
    } catch(err) {
        logger.error(err);
    }
})();
recordIPCountRouter.get('/', async(ctx, next)=>{
    try {
        const client_ip = ctx.request.headers['x-forwarded-for'] ? ctx.request.headers['x-forwarded-for']: ctx.request.ip;
        console.log(scriptSha);
        const {isExist} = await checkLoadScript(scriptSha);
        if (isExist === false) {
           let {sha} = await loadLuaScript();
           scriptSha = sha;       
        }
        let currentCount = await execLuaScriptSha({sha:scriptSha, ip:client_ip, limit: redisLimitIPCount, expiredTime:redisExpireTime});
        // console.log(`client_ip: ${client_ip}`)
        if (currentCount > redisLimitIPCount) {
            ctx.status =  429;
            ctx.body = {status: 'health', httpStatus: ctx.status, message: `[${ctx.request.path}][${ctx.request.method}] ip:${client_ip}, count: ${currentCount} too much request`};
            return;
        }
        else {
            await ctx.render('index', {
                error: currentCount <= redisLimitIPCount? null: { message: `Too much request`, status: 429},
                ip: client_ip,
                count: currentCount
            });
        }
    } catch (err) {
        const message = err.message ? err.message : err.toString();
        throw new HttpException({status: 500, message: `[${ctx.request.path}][${ctx.request.method}] err : ${message}`, code: ErrCode.RecordIPNumberError})
    }
});
module.exports = recordIPCountRouter;