const router = require('koa-router');
const notFoundRouter = new router();
const ErrCode = require('../enums/errorCode');
const HttpException = require('../exceptions/HttpException');
notFoundRouter.all('',async(ctx)=>{
    console.log('not found');
    throw new HttpException({status:404, message:`${ctx.request.path} not supported`, code:ErrCode.NotFoundError})
});
notFoundRouter.all(/\w|/,async(ctx)=>{
    console.log('not found');
    throw new HttpException({status:404, message:`${ctx.request.path} not supported`, code:ErrCode.NotFoundError})
});
module.exports = notFoundRouter;