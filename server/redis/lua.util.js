const fs = require('fs');
const path = require('path');
const { logger } = require('../lib/logger');
const {client} = require('./redis.util');
const recordIpCountLua = 'recordIpCount.lua';
let sha = '';
const flushLuaScript = async() => {
    return new Promise((resolve, reject) => {
        client.script('flush', (err, data)=> {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
};
const loadLuaScript = async () => {
    return new Promise((resolve, reject) => {
        try {
        const luaScript = fs.readFileSync(path.join(__dirname,recordIpCountLua));
        client.script('load',luaScript, (err, scriptSha) => {
            if (err) {
                reject(err);
            }
            sha = scriptSha;
            resolve({sha:scriptSha});
        })
        } catch (err) {
            reject(err);
        }
    });
};
const checkLoadScript = async (sha) => {
    return new Promise((resolve, reject) => {
        if (sha==='') {
            return resolve({isExist:false});
        }
        client.script('exists', sha, (err, result) => {
           if (err) {
               reject(err);
           }
           logger.info(`checkLoadScript result`, result);
           resolve({isExist:result[0]===1});
       })
    })
};
const execLuaScriptSha = async ({sha, ip, limit, expiredTime}) =>{ 
    return new Promise((resolve, reject) => {
        client.evalsha(sha, 1, ip,  expiredTime, limit, (err, result)=> {
            if (err) {
                reject(err);
            }
            logger.info('executeLuaScriptSha result:', result);
            resolve(result);
        })
    });
};
module.exports = {loadLuaScript, checkLoadScript, execLuaScriptSha,sha, flushLuaScript};