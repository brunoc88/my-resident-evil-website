const User = require('../../models/user')

const verifyBlock = async (req, res, next) => {
  try {
    const emisorId = req.user.id          // quien envía el mensaje
    const receptorId = req.params.id      // a quién se lo envía

    const emisor = await User.findById(emisorId)
    const receptor = await User.findById(receptorId)

    if (!receptor || !receptor.estado) {
      return res.status(404).json({ error: 'Usuario no encontrado o eliminado' })
    }

    // ¿El receptor bloqueó al emisor?
    if (receptor.bloqueos.includes(emisorId)) {
      return res.status(403).json({ error: `El usuario ${receptor.userName} no está disponible` })
    }

    // ¿El emisor bloqueó al receptor?
    if (emisor.bloqueos.includes(receptorId)) {
      return res.status(400).json({ error: `Tienes bloqueado a ${receptor.userName}` })
    }


    next()
  } catch (error) {
    next(error)
  }
}

module.exports = verifyBlock
