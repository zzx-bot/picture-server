const express = require('express')
const router = express.Router()

const user = require('./users')
const picture = require('./picture')

router.use('/user', user)
router.use('/picture', picture)

module.exports = router
