const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  } else {
    req.token = null
  }

  next()
}

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'Falta Token!' })
  }

  try {
    const decodedToken = jwt.verify(req.token, SECRET)

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado!' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

const verifyRole = (rol) = (req, res, next) => {
  const user = req.user

  if (!user || user.rol !== rolPermitido) return res.status(403).json({ error: 'Acceso denegado: rol no autorizado' })
    
  next()
}

module.exports = {
  tokenExtractor,
  userExtractor,
  verifyRole
}