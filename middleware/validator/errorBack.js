const { validationResult } = require('express-validator')

// parallel processing
exports.validate = validations => {
	return async (req, res, next) => {
		await Promise.all(validations.map(validation => validation.run(req)))
		const errors = validationResult(req)

		if (errors.isEmpty()) {
			console.log(errors)
			return next()
		}

		res.status(400).json({ errors: errors.array() })
	}
}
