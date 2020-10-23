# request-limit-server

## introduction

This server will limit the request number by ip per mimute 

## my design

My idea is to record the request number by ip per minute in Redis

and the set expires time for request number to  60s

What's more, because the concurrency will happen, thus need to 

use LUA to access to the redis

## chanllenges for this tasks 

1 Get User IP from Request info
Need to know The real Request IP in Header's attribute
2 Race condition for access the redis
if we not use LUA to make sure the update request number operaction
then this will happen when we make multiple update request number operations to redis at the same time
3 Learn LUA script
I seldomly use LUA script in production service so this is a task for me

**Notice**
I use docker to wrap my request-limit-server and redis with docker 
## pre-installl
1 Need first have docker install
2 Need use docker-compose, thus docker-compose cli install is needed
## reference 
[LUA control ip](https://zhuanlan.zhihu.com/p/77484377)