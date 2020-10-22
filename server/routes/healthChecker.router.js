const router = require('koa-router');
const healthCheck = new router();
healthCheck.get('/health_check', async(ctx, next)=>{
    ctx.status = 200;
    ctx.body = {status: 'health', httpStatus: 200, message: 'health_check route is OK'};
});
module.exports = healthCheck;