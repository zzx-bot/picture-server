const mongoose = require('mongoose')
;(async function main() {
	try {
		await mongoose.connect('mongodb://localhost:27017/test')
		console.log('mongodb 连接成功！')
	} catch (error) {
		console.log(error)
		console.log('mongodb 连接失败！')
	}
})()
module.exports = {
	User: require('./userModel'),
	Picture: require('./pictureModel'),
	Follow: require('./followModel'),
	PictureComment: require('./commentModel'),
	PictureLike: require('./pictureLikeModel'),
	PictureCollection: require('./collectionModel'),
}
