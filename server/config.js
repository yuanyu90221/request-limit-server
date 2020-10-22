const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PASSWD: process.env.REDIS_PASSWD,
    APP_NAME: process.env.APP_NAME,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV
}