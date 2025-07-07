const router = require('express').Router()
const {userExtractor, verifyRole} = require('../middlewares/authMiddleware')
const denunciasController = require('../controller/denuncias')

router.use(userExtractor)

router.post('/', denunciasController.crearDenuncia)

// Ver todas
router.get('/', verifyRole('admin'), denunciasController.obtenerDenuncias)

// Ver una denuncia por id
router.get('/:id', verifyRole('admin'), denunciasController.detalleDenuncia)

// Marcar como resuelta
router.patch('/:id/resolver', verifyRole('admin'), denunciasController.marcarResuelta)


module.exports = router