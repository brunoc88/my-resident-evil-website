const router = require('express').Router()
const {userExtractor, verifyRole} = require('../middlewares/authMiddleware')
const denunciasController = require('../controller/denuncias')

router.use(userExtractor)

router.post('/', denunciasController.crearDenuncia)

router.use(verifyRole('admin'))

// Ver todas activas
router.get('/', denunciasController.obtenerDenuncias)

// Ver una denuncia por id
router.get('/:id', denunciasController.detalleDenuncia)

// Marcar como resuelta
router.patch('/:id/resolver', denunciasController.marcarResuelta)


module.exports = router