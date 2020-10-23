const ErrCode = require('../enums/errorCode');
const config = require('../config');
const {loadLuaScript, checkLoadScript, execLuaScriptSha, flushLuaScript} = require('../redis/lua.util');
const HttpException = require('../exceptions/HttpException');
const redisExpireTime = config.REDIS_EXPIRE_TIME;
const redisLimitIPCount = config.REDIS_LIMIT_IP_COUNT;
const recordIPCountFunc = async (ctx, next) => {
    try {
        if  (ctx.request.path!=='/favicon.ico' ) { 
            const client_ip = ctx.request.headers['x-forwarded-for'] ? ctx.request.headers['x-forwarded-for']: ctx.request.ip;
            let sha =ctx.state.sha;
            let {isExist} = await checkLoadScript(sha);
            if (isExist === false) {
                let result = await loadLuaScript();
                sha = result.sha;
            } 
            let currentCount = await execLuaScriptSha({sha, ip:client_ip, limit:redisLimitIPCount, expiredTime: redisExpireTime});
            if (currentCount > redisLimitIPCount) {
                throw new HttpException({status:429, message: `[${ctx.request.path}][${ctx.request.method}]${client_ip} access too much time in ${redisExpireTime}s  with  limit ${redisLimitIPCount} and currentCount:${currentCount}`, code: ErrCode.RecordIPAccessTooMuchError});
            }
            ctx.state.client_ip = client_ip;
            ctx.state.currentCount = currentCount;
        }
        await next();
    } catch(err) {
        if (err.name !== 'HttpException') {
            err = new HttpException({status: 500, message, code:ErrCode.RecordIPNumberError});
        }
        throw err;
    }
};
module.exports = {recordIPCountFunc};