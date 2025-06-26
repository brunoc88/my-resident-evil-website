const router = require('express').Router()
const loginController = require('../controller/login')
const validarLogin = require('../middlewares/validarLogin')


router.post('/', validarLogin, loginController.login)

module.exports = router