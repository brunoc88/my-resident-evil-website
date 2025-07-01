const router = require('express').Router()
const upload = require('../utils/multer')
const validarRegistroPersonaje = require('../middlewares/personaje/validarRegistroPersonaje')
const { userExtractor, verifyRole} = require('../middlewares/authMiddleware')
const personajeController = require('../controller/personaje')

router.get('/all', personajeController.all)

router.get('/:id', personajeController.getPersonaje)

//rutas protegidas
router.use(userExtractor)

router.post('/alta', upload.single('picture'), validarRegistroPersonaje, personajeController.alta)

router.patch('/eliminar/:id', verifyRole('admin'), personajeController.eliminar)

module.exports = router