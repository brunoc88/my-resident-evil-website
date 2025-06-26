const User = require('../models/user')

const validarLogin = async (req, res, next) => {
  // Sanitización
  req.body.user = req.body.user?.trim()
  req.body.password = req.body.password?.trim()

  const { user, password } = req.body

  // Validaciones de presencia
  if (!user && !password) {
    return res.status(400).json({ error: 'Ingrese usuario o Email junto con un password' })
  }

  if (!user) {
    return res.status(400).json({ error: 'Ingrese su nombre de usuario o Email' })
  }

  if (!password) {
    return res.status(400).json({ error: 'Ingrese password' })
  }

  // Buscar usuario por userName o email
  const checkUser = await User.findOne({
    $or: [
      { userName: user },
      { email: user }
    ]
  })

  if (!checkUser) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  if (!checkUser.estado) {
    return res.status(400).json({ error: 'Cuenta eliminada o baneada' })
  }

  // Si todo está OK, guardo el usuario en req para usarlo luego
  req.user = checkUser

  next()
}

module.exports = validarLogin
