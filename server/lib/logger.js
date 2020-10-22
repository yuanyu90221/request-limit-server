exports.logger={
    log:(...data)=>{
      console.log(...data);
    },
    warn: (...data)=>{
      console.log(...data);  
    },
    debug:(...data)=>{
      console.debug(...data);
    },
    info:(...data)=>{
      console.info(...data);
    },
    error:(e)=>{
      console.error(e);
    }
  };