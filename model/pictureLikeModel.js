const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const like = new mongoose.Schema({
	like: {
		type: Number,
		enum: [-1, 1],
		required: true,
	},
	pictureId: {
		type: mongoose.ObjectId,
		required: true,
		ref: 'Picture',
	},
	userId: {
		type: mongoose.ObjectId,
		required: true,
		ref: 'User',
	},
	...baseModel,
})

module.exports = mongoose.model('PictureLike', like)
