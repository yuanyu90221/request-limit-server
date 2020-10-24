const ErrCode = require('../enums/errorCode');
const errorMiddleware = async (ctx, next) => {
    try {
        await next();
    } catch(err) {
        const status = err.status || 500;
        const message = err.client_message? err.client_message: err.message ?err.message : 'something went wrong, please contact us';
        const errCode = err.code ? err.code: ErrCode.Unknown;
        ctx.status = status;
        ctx.body = {message, errCode, status: err.status};
        ctx.state.errorCode = err.code ? err.code: ErrCode.Unknown;
    }
}
module.exports = errorMiddleware;