const {logger} = require('../lib/logger');
/**
 * @description loggerMiddleware 
 * 
 * @param {ctx} ctx 
 * @param {next} next 
 */
const loggerMiddleware = async (ctx, next) =>{
    try {
        await next();
        let {status, body} = ctx;
        let message = body.message;
        if (typeof message !== 'string' && message) {
            message = JSON.stringify(message);
        } else {
            message = 'no body message';
        }
        switch (status) {
            case status >= 500:
                logger.error(`[${ctx.request.method}][${ctx.request.path}] status: ${body.status}, message: ${body.message}, errCode: ${body.errCode}`)
                break;
            case status >= 400:
                logger.warn(`[${ctx.request.method}][${ctx.request.path}] status: ${body.status}, message: ${body.message}, errCode: ${body.errCode}`);
                break;
            default:
                logger.info(`[${ctx.request.method}][${ctx.request.path}] status: ${status}, message: ${message}`);
        }
    } catch (err) {
        throw err;
    }
};

module.exports = {loggerMiddleware};