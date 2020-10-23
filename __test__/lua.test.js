const config = require('../server/config');
const {client} = require('../server/redis/redis.util');
const {loadLuaScript, checkLoadScript, execLuaScriptSha} = require('../server/redis/lua.util');
const { testRegex } = require('../jest.config');
test('lua_test', async()=>{
    try {
        console.log(config);
        const {sha }= await loadLuaScript();
        const {isExist} = await checkLoadScript(sha);
        console.log(isExist === true);
        let result = await Promise.all([execLuaScriptSha({sha, ip: '127.0.0.1', expiredTime:60, limit:2}), execLuaScriptSha({sha, ip: '127.0.0.1', expiredTime:10, limit:2})
        ,execLuaScriptSha({sha, ip: '127.0.0.1', expiredTime:10, limit:2})]);
        console.log(result);
    } catch (err) {
        console.log(err);
        client.quit();
    }
});