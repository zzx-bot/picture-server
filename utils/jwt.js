const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const verify = promisify(jwt.verify)

const { uuid: signKey } = require('../config/config.default')
const expiresIn = '7d'
// 生成token
exports.setToken = payload => {
	return new Promise((resolve, reject) => {
		const token = jwt.sign(payload, signKey, { expiresIn: expiresIn })
		resolve(token)
	})
}

// 解析token
exports.verToken = function (required = true) {
	return async (req, res, next) => {
		// console.log(req.headers.authorization)
		let token = req.headers.authorization

		try {
			token = token ? token.split('Bearer ')[1] : null

			if (token) {
				try {
					let userInfo = await verify(token, signKey)
					req.user = { userInfo }
					next()
				} catch (err) {
					// console.log(err)
					res.status(402).json({ error: 'token已过期' })
				}
			} else if (required) {
				return res.status(402).json({ error: '请传入token' })
			} else {
				next()
			}
		} catch (e) {
			throw e
		}
	}
}
