const User = require('../../models/user')

const verifyBlock = async (req, res, next) => {
  try {
    const myId = req.user.id
    const id = req.params.id

    const user = await User.findById(id)
    const yo = await User.findById(myId)

    // Verifico que el usuario exista y esté activo
    if (!user || !user.estado) {
      return res.status(404).json({ error: 'Usuario no encontrado o eliminado!' })
    }

    // Verifico si el usuario me bloqueó
    if (user.bloqueos.includes(myId)) {
      return res.status(403).json({ error: `El usuario ${user.userName} no está disponible` })
    }

    // Verifico si yo lo tengo bloqueado
    if (yo.bloqueos.includes(id)) {
      return res.status(400).json({ error: `Tienes bloqueado a ${user.userName}!` })
    }

    if(yo.rol === 'comun' && user.rol === 'admin'){
      return res.status(403).json({ error: `No puedes bloquear a un administrador!` })
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = verifyBlock
