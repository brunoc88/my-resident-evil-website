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

router.get('/baneados', verifyRole('admin'), userController.listaDeBaneados)

router.put('/editar/:id', upload.single('picture'), validarCambios, validarEdicionUser, userController.editarUsuario)

router.get('/allLikes', userController.allLikes)

router.post('/mensaje/:id', verifyBlock, userController.mandarMensaje)

router.patch('/mensaje/:id', userController.eliminarMensaje)

router.get('/mensajes', userController.allMsj)

router.get('/mensajes/chat/:id', userController.getHiloConversacion)

router.get('/mensajes/resumen', userController.resumenMensajes)

router.post('/bloquear/:id', verifyBlock, userController.bloquear)

router.delete('/desbloquear/:id', userController.desbloquear)

router.get('/bloqueados', userController.listaBloqueados)

module.exports = router