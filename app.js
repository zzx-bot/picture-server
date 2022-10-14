const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const router = require('./routes')
const { verToken } = require('./utils/jwt')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev')) //记录日志
app.use(express.static('uploads')) //
app.use(express.json()) //

app.use(express.urlencoded({ extended: false })) //记录日志
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// app.use(verToken)
app.use('/api/v1', router)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500).json()
})

app.listen(3001, () => {
	console.log(`Example app listening on port ${3001}`)
})

module.exports = app
