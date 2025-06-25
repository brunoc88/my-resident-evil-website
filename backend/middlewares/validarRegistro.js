const User = require('../models/user')

const validarRegistro = async (req, res, next) => {
  const data = req.body
  const errores = []

  // Sanitizar
  data.userName = data.userName?.trim()
  data.email = data.email?.trim().toLowerCase()
  data.password = data.password?.trim()
  data.pregunta = data.pregunta?.trim()
  data.respuesta = data.respuesta?.trim()

  // Validación de vacíos
  if (!data.userName && !data.email && !data.password && !data.pregunta && !data.respuesta) {
    errores.push('Formulario incompleto')
    return res.status(400).json({ error: errores })
  }
  if (!data.userName) errores.push('Falta el nombre de usuario')
  if (!data.email) errores.push('Falta el email')
  if (!data.password) errores.push('Falta la contraseña')
  if (!data.pregunta) errores.push('Falta la pregunta de seguridad')
  if (!data.respuesta) errores.push('Falta la respuesta de seguridad')

  // Validación de formato y longitud
  if (data.userName && (data.userName.length > 10 || data.userName.length < 5)) {
    errores.push('El nombre de usuario debe tener entre 5 y 10 caracteres')
  }
  if (!data.userName || data.userName.trim().length === 0) {
    errores.push('El nombre de usuario no puede estar vacío')
  }
  if (/\s/.test(data.userName)) {
    errores.push('El nombre de usuario no debe contener espacios')
  }
  if (!data.email || data.email.trim().length === 0) {
    errores.push('El email no puede estar vacío');
  }
  if (/\s/.test(data.email)) {
    errores.push('El email no debe contener espacios');
  }
  if (/\s/.test(data.email)) {
  errores.push('El email no debe contener espacios');
  }
  if (data.password && data.password.length < 5) {
    errores.push('La contraseña debe tener al menos 5 caracteres')
  }

  // Chequeo duplicados
  const existingUser = await User.findOne({ userName: data.userName })
  const existingEmail = await User.findOne({ email: data.email })
  if (existingUser) errores.push('Ese nombre de usuario ya está en uso')
  if (existingEmail) errores.push('Ese email ya está registrado')

  if (errores.length > 0) {
    return res.status(400).json({ error: errores, user: data })
  }

  // Si todo está bien, seguimos
  next()
}

module.exports = validarRegistro
