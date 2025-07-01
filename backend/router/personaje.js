const router = require('express').Router()
const upload = require('../utils/multer')
const validarRegistroPersonaje = require('../middlewares/personaje/validarRegistroPersonaje')
const { userExtractor, verifyRole} = require('../middlewares/authMiddleware')
const personajeController = require('../controller/personaje')

//rutas protegidas
router.use(userExtractor)

router.post('/alta', upload.single('picture'), validarRegistroPersonaje, personajeController.alta)

module.exports = router