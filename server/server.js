const config = require('./config');
const app = require('./app');
const {logger} = require('./lib/logger');
const http = require('http');
const server = http.createServer(app.callback());
const PORT = config.PORT || 5566;
server.listen(PORT, ()=> {
    logger.info(`[${config.APP_NAME}] with version time:  ${new Date().toLocaleString()}`);
    logger.info(`[${config.APP_NAME}] listen on ${PORT}, with env:${config.NODE_ENV}`);
})