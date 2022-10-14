const { body } = require('express-validator')
const { User } = require('../../model')

const { validate } = require('./errorBack')

exports.register = validate([
	body('username')
		.notEmpty()
		.withMessage('用户名不能为空')
		.bail()
		.isLength({ min: 5 })
		.withMessage('用户名长度少于5')
		.bail()
		.custom(async val => {
			const emailValidate = await User.findOne({ username: val })
			if (emailValidate) {
				return Promise.reject('已被注册！')
			}
		})
		.bail(),
	,
	body('email')
		.notEmpty()
		.withMessage('邮箱不能为空')
		.bail()
		.isEmail()
		.withMessage('邮箱格式不正确')
		.bail()
		.custom(async val => {
			const emailValidate = await User.findOne({ email: val })
			if (emailValidate) {
				return Promise.reject('邮箱已被注册！')
			}
		})
		.bail(),
	body('password')
		.notEmpty()
		.withMessage('密码不能为空')
		.bail()
		.isLength({ min: 5 })
		.withMessage('密码长度少于3')
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
			const emailValidate = await User.findOne({ email: val })
			if (!emailValidate) {
				return Promise.reject('邮箱未注册')
			}
		})
		.bail(),
	,
	body('password').notEmpty().withMessage('密码不能为空').bail(),
])

exports.update = validate([
	body('email')
		.bail()
		.custom(async val => {
			const emailValidate = await User.findOne({ email: val })
			if (emailValidate) {
				return Promise.reject('邮箱已被注册')
			}
		})
		.bail(),
	,
	body('username')
		.custom(async val => {
			const nameValidate = await User.findOne({ username: val })
			if (nameValidate) {
				return Promise.reject('用户名被占用')
			}
		})
		.bail(),
	,
	body('phone')
		.custom(async val => {
			const phoneValidate = await User.findOne({ phone: val })
			if (phoneValidate) {
				return Promise.reject('手机号被占用')
			}
		})
		.bail(),
	,
])
