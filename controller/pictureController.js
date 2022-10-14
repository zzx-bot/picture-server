const { Picture, PictureComment, PictureLike, Follow, PictureCollection } = require('../model')
const { hotIncr, hotRange } = require('../model/redis/redisHotIncr')
// 新建图片
exports.createpicture = async (req, res) => {
	let pictureData = req.body
	pictureData.uploaderId = req.user.userInfo._id
	console.log('userInfo._id', pictureData)

	try {
		var pictureModel = new Picture(pictureData)
		await pictureModel.save()
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
	res.send(pictureData)
}
// 获取视频列表
exports.list = async (req, res) => {
	try {
		let { pageNum = 1, pageSize = 2 } = req.body
		const pictureList = await Picture.find()
			.skip((pageNum - 1) * pageSize)
			.limit(pageSize)
			.sort({ createdTime: -1 })
			.populate('uploaderId')
		const pictureCount = await Picture.countDocuments()
		res.send({ pictureList, pictureCount })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.pictureInfo = async (req, res) => {
	try {
		// console.log(req.params)
		const { pictureId } = req.params
		let pictureInfo = await Picture.findById(pictureId).populate('uploaderId', 'username cover _id')
		pictureInfo = pictureInfo.toJSON()
		if (req.user) {
			pictureInfo.isDislike = false
			pictureInfo.isLike = false
			pictureInfo.isSub = false

			const { _id: userId } = req.user.userInfo
			const like = await PictureLike.findOne({ userId, pictureId })

			if (like && like.like === 1) {
				pictureInfo.isLike = true
			} else if (like && like.like === -1) {
				pictureInfo.isDislike = true
			}
			const sub = await Follow.findOne({ userId, channelId: pictureInfo.uploaderId._id })
			console.log(pictureInfo.uploaderId._id)
			if (sub) {
				pictureInfo.isSub = true
			}
		}
		hotIncr(pictureId, 100)
		res.status(200).json({ pictureInfo })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}
// 评论
exports.comment = async (req, res) => {
	try {
		const content = req.body.comment
		const { _id: user } = req.user.userInfo
		const { pictureId: picture } = req.params
		const thePicture = await Picture.findById(picture)
		if (!thePicture) {
			return res.status(404).json({ err: '视频不存在！' })
		}

		const newComment = new PictureComment({
			content,
			user,
			picture,
		})
		await newComment.save()

		thePicture.commentCount++
		thePicture.save()
		hotIncr(pictureId, 300)
		res.status(200).json({ newComment })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.commentList = async (req, res) => {
	try {
		const { pageSize = 10, pageNum = 1 } = req.body
		const { pictureId } = req.params
		const comments = await PictureComment.find({ picture: pictureId })
			.skip(pageSize * (pageNum - 1))
			.limit(pageSize)
			.populate('user', '_id username avatarUrl')
		const commentsCount = await PictureComment.countDocuments({ picture: pictureId })
		res.status(200).json({ comments, commentsCount })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.deleteComment = async (req, res) => {
	try {
		const { pictureId, commentId } = req.params
		const picture = await Picture.findById(pictureId)
		if (!picture) {
			return res.status(404).json({ err: '图片找不到了！' })
		}

		const comment = await PictureComment.findById(commentId)
		if (!comment) {
			return res.status(404).json({ err: '评论找不到了！' })
		}

		if (!comment.user.equals(req.user.userInfo._id)) {
			return res.status(403).json({ err: '没有权限删除评论' })
		}
		await comment.remove()

		if (picture.commentCount > 0) {
			picture.commentCount--
			picture.save()
		}
		res.status(200).json({ msg: '评论删除成功' })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.pictureLike = async (req, res) => {
	try {
		const { pictureId } = req.params
		const picture = await Picture.findById(pictureId)
		if (!picture) {
			return res.status(404).json({ err: '视频找不到了' })
		}
		const userId = req.user.userInfo._id

		let islike = true
		const pictureLike = await PictureLike.findOne({ userId, pictureId })

		if (!pictureLike) {
			await new PictureLike({
				like: 1,
				userId,
				pictureId,
			}).save()
		} else if (pictureLike.like !== 1) {
			pictureLike.like = 1
			await pictureLike.save()
		} else {
			islike = false
			await pictureLike.remove()
		}
		picture.likeCount = await PictureLike.countDocuments({ pictureId, like: 1 })

		await picture.save()
		hotIncr(pictureId, 200)
		res.status(200).json({ picture, islike })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.pictureDislike = async (req, res) => {
	try {
		const { pictureId } = req.params
		const picture = await Picture.findById(pictureId)
		if (!picture) {
			return res.status(404).json({ err: '视频找不到了' })
		}
		const userId = req.user.userInfo._id

		let isDislike = true
		const pictureLike = await PictureLike.findOne({ userId, pictureId })

		if (!pictureLike) {
			await new PictureLike({
				like: -1,
				userId,
				pictureId,
			}).save()
		} else if (pictureLike.like !== -1) {
			pictureLike.like = -1
			await pictureLike.save()
		} else {
			isDislike = false
			await pictureLike.remove()
		}

		picture.dislikeCount = await PictureLike.countDocuments({ pictureId, like: -1 })
		await picture.save()
		hotIncr(pictureId, 300)
		res.status(200).json({ picture, isDislike })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.likeList = async (req, res) => {
	try {
		let { pageNum = 1, pageSize = 2 } = req.body
		const likeList = await PictureLike.find({ userId: req.user.userInfo._id })
			.skip((pageNum - 1) * pageSize)
			.limit(pageSize)
			.sort({ createdTime: -1 })
			.populate('pictureId', '_id title pictureId uploaderId')
		const likesCount = await PictureLike.countDocuments({ userId: req.user.userInfo._id })
		res.send({ likeList, likesCount })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.collection = async (req, res) => {
	try {
		let { pictureId } = req.params
		let { t } = req.body
		let userId = req.user.userInfo._id

		const picture = await Picture.findById(pictureId)
		if (!picture) {
			return res.status(404).json({ error: '视频找不到了' })
		}

		let collection = await PictureCollection.findOne({ pictureId, userId })
		console.log(t)

		if (t === 1) {
			console.log(collection)
			if (collection) return res.status(403).json({ error: '视频已经收藏了' })

			collection = await new PictureCollection({ pictureId, userId }).save()
			hotIncr(pictureId, 500)
			return res.status(201).json({ collection })
		} else if (t === 0) {
			if (!collection) return res.status(403).json({ error: '已经取消收藏了' })
			collection.remove()
			return res.status(200).json({ msg: '取消收藏成功' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.getHots = async function (req, res) {
	try {
		let { topNum } = req.params

		const hots = await hotRange(topNum)

		res.status(200).json({ hots })
	} catch (error) {
		console.log(error)
	}
}
