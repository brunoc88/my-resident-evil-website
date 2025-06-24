const router = require('express').Router()
const upload = require('../utils/multer')
const validarRegistro = require('../middlewares/validarRegistro')//middleware para comprobar los datos
const userController = require('../controller/user')

router.post('/registro', upload.single('picture'), validarRegistro, userController.altaUser)

module.exports = router