const validarRecuperarPassword = (req, res, next) => {
  // Sanitización
  req.body.email = req.body.email ? req.body.email.trim().toLowerCase() : ''
  req.body.respuesta = req.body.respuesta
    ? req.body.respuesta.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    : ''

  const { email, respuesta } = req.body
  let errores = []

  if (!email) errores.push('Falta email!')
  if (!respuesta) errores.push('Ingrese una respuesta!')

  if (respuesta && (respuesta.length > 60 || respuesta.length < 5)) {
    errores.push('La respuesta debe tener entre 5 y 60 caracteres')
  }

  if (email) {
    if (/\s/.test(email)) {
      errores.push('El email no debe contener espacios')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errores.push('El email no tiene un formato válido')
    }
  }

  if (errores.length) {
    return res.status(400).json({ errores })
  }

  next()
}

module.exports = validarRecuperarPassword
