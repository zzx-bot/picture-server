const { User, Follow, PictureComment } = require('../model')
const jwt = require('../utils/jwt')

const fs = require('fs/promises')

// 可暴露的用户的信息
const fields = ['id', 'username', 'avatarUrl', 'followersCount', 'cover', 'sign', 'channeldes']

// 用户注册
exports.register = async (req, res) => {
	const userModel = new User(req.body)
	const dbBack = await userModel.save()

	const user = dbBack.toJSON()
	delete user.password
	res.status(200).json({ user })
}
//用户登录
exports.login = async (req, res) => {
	let dbBack = await User.findOne(req.body)

	if (!dbBack) {
		return res.status(402).json({ error: '邮箱或密码错误' })
	}
	dbBack = dbBack.toJSON()
	dbBack.token = await jwt.setToken(dbBack)
	// console.log(dbBack)
	res.status(200).json(dbBack)
}
exports.update = async (req, res) => {
	const userId = req.user.userInfo._id
	const dbBackData = await User.findByIdAndUpdate(userId, req.body, { new: true })

	res.json({ useInfo: dbBackData })
}

exports.avatar = async (req, res) => {
	const uploadFile = req.file
	if (!uploadFile) {
		return res.status(402).json({ error: '请上传头像' })
	}
	const fileArr = uploadFile.originalname.split('.')
	const fileType = fileArr[fileArr.length - 1]

	// 头像存在文件夹中
	try {
		await fs.rename(`./uploads/${uploadFile.filename}`, `./uploads/${uploadFile.filename}.${fileType}`)
	} catch (error) {
		console.log(error)
		res.status(500).json({ error })
	}
	res.status(200).send({ msg: '上传头像成功' })
}
exports.list = async (req, res) => {
	try {
		let { pageNum = 1, pageSize = 5 } = req.body
		const userList = await User.find()
			.skip((pageNum - 1) * pageSize)
			.limit(pageSize)
			.sort({ createdTime: -1 })

		const userCount = await Picture.countDocuments()
		res.send({ userList, userCount })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.delete = async (req, res) => {
	res.send('user-delete')
}

exports.follow = async (req, res) => {
	try {
		const userId = req.user.userInfo._id
		const { channelId } = req.params

		console.log('userId', userId)
		console.log('channelId', channelId)
		if (channelId === userId) {
			return res.status(200).json({ msg: '你时刻都在关注你自己！' })
		}
		const searchSub = { userId, channelId }
		const record = await Follow.findOne(searchSub)
		console.log(record)

		if (!record) {
			await new Follow(searchSub).save()
			const user = await User.findById(userId)
			user.followingsCount++
			await user.save()

			const channel = await User.findById(channelId)
			channel.followersCount++
			await channel.save()
			return res.status(200).json({ msg: '关注成功！' })
		} else {
			return res.status(400).json({ err: '已经关注了' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.unfollow = async (req, res) => {
	try {
		const userId = req.user.userInfo._id
		const { channelId } = req.params

		if (channelId === userId) {
			return res.status(200).json({ msg: '你时刻都在关注你自己！' })
		}
		const searchSub = { userId, channelId }
		const record = await Follow.findOne(searchSub)
		console.log(record)
		if (record) {
			await record.remove()
			const user = await User.findById(userId)
			if (user.followingsCount > 0) {
				user.followingsCount--
			}
			await user.save()

			const channel = await User.findById(channelId)
			if (user.followersCount > 0) {
				user.followersCount--
			}
			await channel.save()
			return res.status(200).json({ msg: '取消关注成功！' })
		} else {
			return res.status(400).json({ err: '你还未关注哦' })
		}
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.getChannel = async (req, res) => {
	try {
		let isFollowed = false
		const userId = req.user.userInfo._id
		const { channelId } = req.params

		if (req.user) {
			const record = await Follow.findOne({ userId, channelId })
			console.log(record)
			if (record) {
				isFollowed = true
			}
		}
		const fields = ['id', 'username', 'avatarUrl', 'followersCount', 'cover', 'sign', 'channeldes']
		const channel = await User.findById(userId, fields)
		channel.isFollowed = isFollowed
		res.status(200).json({ channel })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.followingList = async (req, res) => {
	try {
		let { pageNum = 1, pageSize = 5 } = req.body

		const { userId } = req.params
		const fls = await Follow.find({ userId })
			.skip((pageNum - 1) * pageSize)
			.limit(pageSize)
			.sort({ createdTime: -1 })
			.populate('channelId', fields)

		res.status(200).json({ followingList: fls })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}

exports.followerList = async (req, res) => {
	try {
		let { pageNum = 1, pageSize = 5 } = req.body
		const { _id: channelId } = req.user.userInfo

		const dbBack = await Follow.find({ channelId })
			.skip((pageNum - 1) * pageSize)
			.limit(pageSize)
			.sort({ createdTime: -1 })
			.populate('channelId', fields)

		res.status(200).json({ followerList: dbBack })
	} catch (error) {
		console.log(error)
		res.status(400).json({ error })
	}
}
