const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const comment = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	picture: {
		type: mongoose.ObjectId,
		required: true,
		ref: 'Picture',
	},
	user: {
		type: mongoose.ObjectId,
		required: true,
		ref: 'User',
	},
	...baseModel,
})

module.exports = mongoose.model('PictureComment', comment)
