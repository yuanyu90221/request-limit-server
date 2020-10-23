local visitNum = redis.call('incr', KEYS[1])

if visitNum <=  tonumber(ARGV[2]) then
        redis.call('expire', KEYS[1], ARGV[1])
end

return visitNum;