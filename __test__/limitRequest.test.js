// const config = require('../config');
const supertest = require('supertest');
const app = require('../server/app');
const {flushLuaScript} = require('../server/redis/lua.util');
const {client, flushAll} = require('../server/redis/redis.util');
const request = supertest(app.callback());
test('limitRequestTest',async done => {
    let res = await flushAll();
    const requestArr = [];
    for (let i=0; i < 60; i++) {
        let req = request.get('/');
        requestArr.push(req);
    }
    const resultArr= await Promise.all(requestArr);
    const nextRequest = await request.get('/');
    const statusOKCount = resultArr.filter(item => item.statusCode===200).length;
    expect(statusOKCount).toBe(60);
    expect(nextRequest.status).toBe(429);
    // done();
    client.quit(done());
});
beforeAll(async done =>{
    // await removeKey(request.serverAddress);
   done();
});
afterAll(async done =>{
    client.quit(done());
 });