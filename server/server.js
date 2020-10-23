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

process.stdin.resume();
async function exitHandler(options, exitCode) {
  if (options.cleanup) logger.info(`[${config.APP_NAME}][exit]clean`);
  if (exitCode || exitCode === 0) logger.info(`[${config.APP_NAME}][exit]`,exitCode);
  if (options.exit) {
    process.exit();
  }
}

//do something when app is closing
// process.on('exit', exitHandler.bind(null,{cleanup:true}));。
process.on('beforeExit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGTERM', exitHandler.bind(null,{cleanup:true}));
process.on('SIGILL', exitHandler.bind(null, {cleanup: true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));