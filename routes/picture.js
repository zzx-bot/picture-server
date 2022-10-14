const express = require('express')
const router = express.Router()

const { verToken } = require('../utils/jwt')
const pictureControler = require('../controller/pictureController.js')
const pictureValidator = require('../middleware/validator/pictureValidator')

/* POST register users. */
router
	.post('/createpicture', verToken(), pictureValidator.create, (req, res) => {
		pictureControler.createpicture(req, res)
	})
	.get('/list', verToken(), (req, res) => {
		pictureControler.list(req, res)
	})
	.get('/pictureinfo/:pictureId', verToken(), (req, res) => {
		pictureControler.pictureInfo(req, res)
	})
	.post('/comment/:pictureId', verToken(), (req, res) => {
		pictureControler.comment(req, res)
	})
	.delete('/:pictureId/comment/:commentId', verToken(), (req, res) => {
		pictureControler.deleteComment(req, res)
	})
	.get('/commentlist/:pictureId', (req, res) => {
		pictureControler.commentList(req, res)
	})
	.post('/like/:pictureId', verToken(), (req, res) => {
		pictureControler.pictureLike(req, res)
	})
	.post('/dislike/:pictureId', verToken(), (req, res) => {
		pictureControler.pictureDislike(req, res)
	})
	.get('/likelist', verToken(), (req, res) => {
		pictureControler.likeList(req, res)
	})
	.post('/collection/:pictureId', verToken(), (req, res) => {
		pictureControler.collection(req, res)
	})
	.get('/hots/:topNum', (req, res) => {
		pictureControler.getHots(req, res)
	})
module.exports = router
