const { redis } = require('./index')

exports.hotIncr = async function (pictureId, incrNum) {
	try {
		var data = await redis.zscore('pictureHots', pictureId)
		if (data) {
			var incr = await redis.zincrby('pictureHots', incrNum, pictureId)
			console.log(pictureId + '+' + incrNum)
		} else {
			var incr = await redis.zadd('pictureHots', incrNum, pictureId)
			console.log('写入' + pictureId + incr)
		}

		return incr
	} catch (error) {
		console.log(error)
	}
}

exports.hotRange = async function (num) {
	var paixu = await redis.zrevrange('pictureHots', 0, -1, 'withscores')
	console.log('paixu', paixu)
	paixu = paixu.slice(0, num * 2)
	const obj = {}
	for (let i = 0; i < paixu.length; i = i + 2) {
		obj[paixu[i]] = paixu[i + 1]
	}
	console.log(obj)
	return obj
}
