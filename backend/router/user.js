const router = require('express').Router()
const upload = require('../utils/multer')
const validarRegistro = require('../middlewares/validarRegistro')//middleware para comprobar los datos
const { userExtractor } = require('../middlewares/authMiddleware')
const userController = require('../controller/user')

router.post('/registro', upload.single('picture'), validarRegistro, userController.altaUser)

router.post('/registroAdmin', upload.single('picture'), validarRegistro, userController.altaUserAdmin)

router.get('/perfil/:userName', userExtractor, userController.perfil)

router.get('/miPerfil', userExtractor, userController.miPerfil)

module.exports = router