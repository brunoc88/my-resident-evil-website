const router = require('express').Router()
const upload = require('../utils/multer')
const validarRegistro = require('../middlewares/user/validarRegistro')//middleware para comprobar los datos
const validarRecuperarPassword = require('../middlewares/user/validarRecuperarPassword')
const validarCambios = require('../middlewares/user/validarCambios')
const validarEdicionUser = require('../middlewares/user/validarEdicionUser')
const { userExtractor, verifyRole } = require('../middlewares/authMiddleware')
const verifyBlock = require('../middlewares/user/verifyBlock')
const userController = require('../controller/user')

router.post('/registro', upload.single('picture'), validarRegistro, userController.altaUser)

router.post('/registroAdmin', upload.single('picture'), validarRegistro, userController.altaUserAdmin)

router.post('/recuperar-password', validarRecuperarPassword, userController.recuperarPassword)


//rutas protegidas
router.use(userExtractor)

router.get('/perfil/:userName', userController.perfil)

router.get('/miPerfil', userController.miPerfil)

router.patch('/eliminar/:id', userController.eliminarCuenta)

router.patch('/reActivar/:id', verifyRole('admin'), userController.reactivarCuenta)

router.put('/editar/:id', upload.single('picture'), validarCambios, validarEdicionUser, userController.editarUsuario)

router.get('/allLikes', userController.allLikes)

router.post('/mensaje/:id', verifyBlock, userController.mandarMensaje)

module.exports = router