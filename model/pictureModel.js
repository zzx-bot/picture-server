const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const picture = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	descrption: {
		type: String,
		required: false,
	},
	pictureId: {
		type: String,
		required: true,
	},
	uploaderId: {
		type: mongoose.ObjectId,
		required: true,
		ref: 'User',
	},
	commentCount: {
		type: Number,
		default: 0,
		ref: 'User',
	},
	likeCount: { type: Number, default: 0 },
	dislikeCount: { type: Number, default: 0 },
	...baseModel,
})

module.exports = mongoose.model('Picture', picture)
