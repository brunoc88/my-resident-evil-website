const router = require('express').Router()
const upload = require('../utils/multer')
const validarRegistroPersonaje = require('../middlewares/personaje/validarRegistroPersonaje')
const validarCambiosPersonaje = require('../middlewares/personaje/validarCambiosPersonaje')
const validarEdicionPersonaje = require('../middlewares/personaje/validarEdicionPersonaje')
const { userExtractor, verifyRole} = require('../middlewares/authMiddleware')
const personajeController = require('../controller/personaje')

router.get('/all', personajeController.all)

router.get('/:id', personajeController.getPersonaje)

//rutas protegidas
router.use(userExtractor)

router.post('/alta', upload.single('picture'), validarRegistroPersonaje, personajeController.alta)

router.patch('/eliminar/:id', verifyRole('admin'), personajeController.eliminar)

router.put('/editar/:id', upload.single('picture'), validarCambiosPersonaje, validarEdicionPersonaje, personajeController.editar)

router.patch('/:id/like', personajeController.like)

router.patch('/:id/unlike', personajeController.unlike)
//PENDIENTE
router.get('/allLikes', personajeController.allLikes)

module.exports = router