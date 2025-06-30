const validarEdicionUsuario = async (req, res, next) => {
  if (!req.cambios) {
    return res.status(400).json({ error: 'No se detectaron cambios para validar' })
  }

  const data = req.cambios
  const errores = []

  // Sanitización solo si el campo existe
  if ('userName' in data) data.userName = data.userName.trim()
  if ('email' in data) data.email = data.email.trim().toLowerCase()
  if ('password' in data) data.password = data.password.trim()
  if ('pregunta' in data) data.pregunta = data.pregunta.trim()
  if ('respuesta' in data) {
    data.respuesta = data.respuesta.trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  // Validaciones
  if ('userName' in data) {
    if (!data.userName) errores.push('Falta el nombre de usuario')
    if (data.userName.length > 10 || data.userName.length < 5) {
      errores.push('El nombre de usuario debe tener entre 5 y 10 caracteres')
    }
    if (/\s/.test(data.userName)) {
      errores.push('El nombre de usuario no debe contener espacios')
    }
  }

  if ('email' in data) {
    if (!data.email) errores.push('Falta el email')
    if (/\s/.test(data.email)) errores.push('El email no debe contener espacios')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errores.push('El email no tiene un formato válido')
    }
  }

  if ('password' in data) {
    if (data.password.length < 5) errores.push('La contraseña debe tener al menos 5 caracteres')
    if (/\s/.test(data.password)) errores.push('El password no debe contener espacios')
  }

  if ('respuesta' in data) {
    if (!data.respuesta) errores.push('Falta la respuesta de seguridad')
    if (data.respuesta.length > 60 || data.respuesta.length < 5) {
      errores.push('La respuesta debe tener entre 5 y 60 caracteres')
    }
  }

  if ('pregunta' in data && !data.pregunta) {
    errores.push('Falta la pregunta de seguridad')
  }

  if ('sobreMi' in data && data.sobreMi.length > 150) {
    errores.push('Superaste el límite de caracteres permitido!')
  }

  if (errores.length > 0) {
    return res.status(400).json({ error: errores, data })
  }

  next()
}

module.exports = validarEdicionUsuario
