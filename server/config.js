const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PASSWD: process.env.REDIS_PASSWD,
    APP_NAME: process.env.APP_NAME,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    REDIS_EXPIRE_TIME: (isNaN(process.env.REDIS_EXPIRE_TIME))? 60:Number(process.env.REDIS_EXPIRE_TIME),
    REDIS_LIMIT_IP_COUNT: (isNaN(process.env.REDIS_LIMIT_IP_COUNT))? 60:Number(process.env.REDIS_LIMIT_IP_COUNT),
    IS_RUN_ON_DOCKER: process.env.IS_RUN_ON_DOCKER === "true"
}