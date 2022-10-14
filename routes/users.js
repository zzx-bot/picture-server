const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { verToken } = require('../utils/jwt')
const userControler = require('../controller/userController.js')
const userValid = require('../middleware/validator/userValidator')

/* POST register users. */
router
	.post('/register', userValid.register, (req, res) => {
		userControler.register(req, res)
	})
	.post('/login', userValid.login, (req, res) => {
		userControler.login(req, res)
	})
	.get('/list', verToken(), (req, res) => {
		userControler.list(req, res)
	})
	.put('/update', verToken(), userValid.update, (req, res) => {
		userControler.update(req, res)
	})
	.post('/avatar', verToken(), upload.single('avatar'), (req, res) => {
		userControler.avatar(req, res)
	})
	.get('/follow/:channelId', verToken(), (req, res) => {
		userControler.follow(req, res)
	})
	.get('/unfollow/:channelId', verToken(), (req, res) => {
		userControler.unfollow(req, res)
	})
	.get('/channel/:channelId', verToken(), (req, res) => {
		userControler.getChannel(req, res)
	})
	.get('/followinglist/:userId', verToken(), (req, res) => {
		userControler.followingList(req, res)
	})
	.get('/followerlist', verToken(), (req, res) => {
		userControler.followerList(req, res)
	})

module.exports = router
