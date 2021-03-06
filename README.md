# request-limit-server

## introduction

This server will limit the request number by ip per mimute 

## my design

My idea is to record the request number by ip per minute in Redis

and the set expires time for request number to  60s

What's more, because the concurrency will happen, thus need to 

use LUA to access to the redis

## chanllenges for this tasks 

1. Get User IP from Request info
Need to know The real Request IP in Header's attribute

2. Race condition for access the redis
if we not use LUA to make sure the update request number operaction atomic
then this will happen when we make multiple update request number operations to redis at the same time

3. Learn LUA script
I seldomly use LUA script in production service so this is a task for me

**Notice**
I use docker to wrap my request-limit-server and redis with docker 
## pre-installl
### For Dcoker Deploy and test(if you use Docker)
[install doc](https://docs.docker.com/desktop/)
1. Need first have docker install
2. Need use docker-compose, thus docker-compose cli install is needed

### For siege test(Recommanded) 
1. siege
### siege install step
#### Linux
```shell=
sudo apt-get install siege
```
#### Mac OS
```shell=
brew install siege
```
## reference 
[LUA control ip](https://zhuanlan.zhihu.com/p/77484377)

## Run on Dcoker
not recommand for someone not familar with docker

1 setup .env for dokcer
```shell=
REDIS_PASSWD=3719a9efc9d55190eee8285bcc66ea2e0ef5d36db87427d7e862e504df435f0b
REDIS_PORT=6379
REDIS_HOST=127.0.0.1
NODE_ENV=dev
APP_NAME=request-limit-server
PORT=7788
REDIS_EXPIRE_TIME=60
REDIS_LIMIT_IP_COUNT=60
IS_RUN_ON_DOCKER=true
```
```shell=
docker-compose up -d
```
***Notice***
Because I use chown -R  on Dockerfile
Thus this will take a while for build up server
AND after the docker is finish
if you use redis on Docker and try to use  my default supertest on request_limit_server
do change the IS_RUN_DOCKER=false in .env file

because the supertest is not run in the docker with same network with redis

2 run test with supertest
```shell=
npm run test
```
3 run test with siege for local deployed machine with port 7788
first 60 request should be response with http status code:200
```shell=
siege -c 60 -r1 http://127.0.0.1:7788 -v
```
and next request should be response with http status code:429
```shell=
siege -c 1 -r1 http://127.0.0.1:7788 -v
```
4 test local for local deployed machine with port 7788 with file
first 60 request should be response with http status code:200
```shell=
siege -c 60 -r1  -f siege_file_local_docker  -v
```
and next request should be response with http status code:429
```shell=
siege -c 1 -r1 -f siege_file_local_docker -v
```
## set up redis for redis Lab(Highly recommand easy to setup and test)
for example my setup
```shell=
REDIS_PASSWD=dob770407
REDIS_PORT=19635
REDIS_HOST=redis-19635.c54.ap-northeast-1-2.ec2.cloud.redislabs.com
NODE_ENV=dev
APP_NAME=request-limit-server
PORT=7788
REDIS_EXPIRE_TIME=60
REDIS_LIMIT_IP_COUNT=60
IS_RUN_ON_DOCKER=false
```
## heroku deploy
1. first login
```shell=
heroku login
```
2. create heroku repo
```shell=
heroku create
```
3. git push -u heroku master
```shell=
git push -u heroku master
```
4. set up the  config var for all my .env
```shell=
REDIS_PASSWD=dob770407
REDIS_PORT=19635
REDIS_HOST=redis-19635.c54.ap-northeast-1-2.ec2.cloud.redislabs.com
NODE_ENV=dev
APP_NAME=request-limit-server
PORT=7788
REDIS_EXPIRE_TIME=60
REDIS_LIMIT_IP_COUNT=60
IS_RUN_ON_DOCKER=false
```
this must be done due to I separate this setting into environment variable

then you could got your heroku uri

for my deploy

is https://pacific-island-71307.herokuapp.com
## test on siege with heroku
1. paste your heroku uri on siege_file_on_deployed_heroku
```shell=
https://pacific-island-71307.herokuapp.com
```
2. run test with file
first request 60 time should be response with http status 200
```shell=
siege -c 60 -r1 -f siege_file_on_deployed_heroku -v
```
next request should should be response with http status 429
```shell=
siege -c 1 -r1 -f siege_file_on_deployed_heroku -v
```
***Notice***
siege must be install first
[siege document](https://github.com/JoeDog/siege) 