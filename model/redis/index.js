const Redis = require('ioredis')
const { redisClient } = require('../../config/config.default')
const redis = new Redis(redisClient.port, redisClient.path, redisClient.options)

redis.on('error', err => {
	console.log('Redis链接错误')
	console.log(err)
	redis.quit()
})

redis.on('ready', () => {
	console.log('Redis链接成功')
})
redis.keys('*').then(data => {
	console.log(data)
})
exports.redis = redis
