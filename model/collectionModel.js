const mongoose = require('mongoose')
const baseModel = require('./baseModel')

const collection = new mongoose.Schema({
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

module.exports = mongoose.model('PictureCollection', collection)
