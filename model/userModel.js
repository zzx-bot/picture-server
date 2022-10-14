const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const md5 = require('../utils/md5')
const user = new mongoose.Schema({
	username: { type: String },
	password: { type: String, required: true, set: value => md5(value), select: false },
	email: { type: String },
	avatarUrl: { type: String, default: null },
	gender: { type: String, default: 'unknown', enum: ['男', '女', 'unknown'] },
	birthday: { type: Date, default: Date.now() },
	phone: { type: Number },

	sign: { type: String },
	//用户注册 时候为空， 上传视频后
	cover: { type: String, default: null },
	channeldes: { type: String, default: null },
	followingsCount: { type: Number, default: 0 },
	followersCount: { type: Number, default: 0 },
	...baseModel,
})

module.exports = mongoose.model('User', user)
