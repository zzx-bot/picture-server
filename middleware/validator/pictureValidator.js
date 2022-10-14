const { body } = require('express-validator')
const { Picture } = require('../../model')

const { validate } = require('./errorBack')

exports.create = validate([
	body('title')
		.notEmpty()
		.withMessage('标题不能为空')
		.bail()
		.isLength({ max: 20 })
		.withMessage('标题不能超过20个字符')
		.bail(),

	body('pictureId')
		.notEmpty()
		.withMessage('pictureId不能为空')
		.bail()
		.custom(async val => {
			const emailValidate = await Picture.findOne({ pictureId: val })
			if (emailValidate) {
				return Promise.reject('邮箱已被注册！')
			}
		})
		.bail(),
])

exports.login = validate([
	body('email')
		.notEmpty()
		.withMessage('邮箱不能为空')
		.bail()
		.isEmail()
		.withMessage('邮箱格式不正确')
		.bail()
		.custom(async val => {
			const emailValidate = await Picture.findOne({ email: val })
			if (!emailValidate) {
				return Promise.reject('邮箱未注册')
			}
		})
		.bail(),

	body('password').notEmpty().withMessage('密码不能为空').bail(),
])

exports.update = validate([
	body('email')
		.bail()
		.custom(async val => {
			const emailValidate = await Picture.findOne({ email: val })
			if (emailValidate) {
				return Promise.reject('邮箱已被注册')
			}
		})
		.bail(),

	body('Picturename')
		.custom(async val => {
			const nameValidate = await Picture.findOne({ Picturename: val })
			if (nameValidate) {
				return Promise.reject('用户名被占用')
			}
		})
		.bail(),

	body('phone')
		.custom(async val => {
			const phoneValidate = await Picture.findOne({ phone: val })
			if (phoneValidate) {
				return Promise.reject('手机号被占用')
			}
		})
		.bail(),
])
