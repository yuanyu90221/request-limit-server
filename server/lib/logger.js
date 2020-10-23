const config= require('../config');
const isShowLog = config.IS_SHOW_LOG;
exports.logger={
    log:(...data)=>{
      if (isShowLog) {
        console.log(...data);
      }
    },
    warn: (...data)=>{
      if (isShowLog) {
        console.log(...data);
      }  
    },
    debug:(...data)=>{
      if (isShowLog) {
       console.debug(...data);
      }
    },
    info:(...data)=>{
      if (isShowLog) {
        console.info(...data);
      }
    },
    error:(e)=>{
      if (isShowLog) {
        console.error(e);
      }
    }
  };