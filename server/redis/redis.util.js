const redis = require('redis');
const config = require('../config');
const redisHost =  config.IS_RUN_ON_DOCKER ? 'redis':config.REDIS_HOST;
const redisPort = config.REDIS_PORT;
const redisPasswd = config.REDIS_PASSWD;
const client = redis.createClient(redisPort, redisHost, {password: redisPasswd})
const {logger} = require('../lib/logger');
client.on('error', async(err) => {
    let message = err.message? err.message: err.toString();
    logger.error(`[Redis_client_error]:${message}`);
});
client.on('ready', async()=>{
    logger.info(`[${config.APP_NAME}] with ${config.NODE_ENV} environment Redis connect well!`);
});
module.exports={client};