const Denuncia = require('../models/denuncias')
const User = require('../models/user')
const Personaje = require('../models/personaje')

exports.crearDenuncia = async (req, res, next) => {
  try {
    const { tipo, id, motivo, mensaje } = req.body

    if (!tipo || !id || !motivo || !mensaje) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    if(tipo && tipo === 'User'){
        const user = await User.findById(id)
        if(!user || !user.estado){
            return res.status(404).json({error: 'Usuario inexistente o eliminado'})
        }
    }

    if(tipo && tipo === 'Personaje'){
        const personaje = await Personaje.findById(id)
        if(!personaje || !personaje.estado){
            return res.status(404).json({error: 'Personaje inexistente o eliminado'})
        }
    }

    if(motivo.length > 100 ) {
        return res.status(400).json({error: 'Motivo: Superaste el limite de caracteres!', denuncia: {
            tipo,
            id,
            mensaje,
            motivo
        }})
    } 

    if(mensaje.length > 500 ) {
        return res.status(400).json({error: 'Mensaje: Superaste el limite de caracteres!', denuncia: {
            tipo,
            id,
            motivo,
            mensaje
        }})
    }
    const nueva = new Denuncia({
      denunciante: req.user.id,
      entidad: { tipo, id },
      motivo,
      mensaje
    })

    await nueva.save()
    res.status(201).json({ msj: 'Denuncia enviada correctamente' })
  } catch (error) {
    next(error)
  }
}

// Obtener todas las denuncias (admin)
exports.obtenerDenuncias = async (req, res, next) => {
  try {
    const denuncias = await Denuncia.find()
      .populate('denunciante', 'userName email')
      .sort({ fecha: -1 })

    res.status(200).json({ denuncias })
  } catch (error) {
    next(error)
  }
}

// Marcar una denuncia como resuelta (admin)
exports.marcarResuelta = async (req, res, next) => {
  try {
    const { id } = req.params

    const denuncia = await Denuncia.findById(id)
    if (!denuncia) {
      return res.status(404).json({ error: 'Denuncia no encontrada' })
    }

    denuncia.estado = false
    await denuncia.save()

    res.status(200).json({ msj: 'Denuncia marcada como resuelta' })
  } catch (error) {
    next(error)
  }
}

// Obtener detalle de una denuncia
exports.detalleDenuncia = async (req, res, next) => {
  try {
    const { id } = req.params

    const denuncia = await Denuncia.findById(id).populate('denunciante', 'userName email')
    if (!denuncia) {
      return res.status(404).json({ error: 'Denuncia no encontrada' })
    }

    res.status(200).json({ denuncia })
  } catch (error) {
    next(error)
  }
}