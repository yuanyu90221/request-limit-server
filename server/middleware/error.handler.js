const ErrCode = require('../enums/errorCode');
const env = process.env.NODE_ENV||'dev';
const config = require('../config');
const errorMiddleware = async (ctx, next) => {
    try {
        await next();
    } catch(err) {
        const status = err.status || 500;
        const message = err.client_message? err.client_message: err.message ?err.message : 'something went wrong, please contact us';
        const errCode = err.code ? err.code: ErrCode.Unknown;
        ctx.status = status;
        ctx.body = {message, errCode, status: 'failed'};
        ctx.state.errorCode = err.code ? err.code: ErrCode.Unknown;
    }
}
module.exports = errorMiddleware;