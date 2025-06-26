const validarRegistro = async (req, res, next) => {
  const data = req.body
  const errores = []

  // Sanitizar

  // Usamos el operador ?. para evitar errores si userName es undefined o null
  data.userName = data.userName?.trim()
  data.email = data.email?.trim().toLowerCase()
  data.password = data.password?.trim()
  data.pregunta = data.pregunta?.trim()
  //ej:"esta es mi respuesta"
  //Eso evita problemas por tildes o mayúsculas cuando compares más adelante.
  data.respuesta = data.respuesta?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")



  // Validación de presencia (después de sanitizar)
  if (!data.userName && !data.email && !data.password && !data.pregunta && !data.respuesta) {
    errores.push('Formulario incompleto')
    return res.status(400).json({ error: errores })
  }
  if (!data.userName) errores.push('Falta el nombre de usuario')
  if (!data.email) errores.push('Falta el email')
  if (!data.password) errores.push('Falta la contraseña')
  if (!data.pregunta) errores.push('Falta la pregunta de seguridad')
  if (!data.respuesta) errores.push('Falta la respuesta de seguridad')

  // Validación de userName
  if (data.userName) {
    if (data.userName.length > 10 || data.userName.length < 5) {
      errores.push('El nombre de usuario debe tener entre 5 y 10 caracteres')
    }
    //"/\s/" por ejemplo "juan carlos" o "juan/carlos"
    if (/\s/.test(data.userName)) {
      errores.push('El nombre de usuario no debe contener espacios')
    }
  }

  // Validación de email
  if (data.email) {
    if (/\s/.test(data.email)) {
      errores.push('El email no debe contener espacios')
    }
    // Validación de formato de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errores.push('El email no tiene un formato válido')
    }
  }

  // Validación de password
  if (data.password && data.password.length < 5) {
    errores.push('La contraseña debe tener al menos 5 caracteres')
  }

  if (data.password && /\s/.test(data.password)) {
    errores.push('El password no debe contener espacios')
  }

  //validacion de respuesta
  if (data.respuesta) {
    if (data.respuesta.length > 60 || data.respuesta.length < 5) {
      errores.push('La respuesta debe tener entre 5 y 60 caracteres')
    }
  }

  if (data.sobreMi && data.sobreMi.length > 150) {
    errores.push('Superaste el límite de caracteres permitido!')
  }


  if (errores.length > 0) {
    return res.status(400).json({ error: errores, data })
  }

  next()
}

module.exports = validarRegistro