const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const follow = new mongoose.Schema({
	userId: {
		type: mongoose.ObjectId,
		required: true,
		ref: 'User',
	},
	channelId: {
		type: mongoose.ObjectId,
		required: true,
		ref: 'User',
	},
	...baseModel,
})

module.exports = mongoose.model('Follow', follow)
