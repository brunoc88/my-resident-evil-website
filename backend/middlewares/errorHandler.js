const errorHandler = (error, req, res, next) => {
  //recupero los datos ingresados previo al error
  const data = req.body? req.body : null
  
  // Errores de validación (required, minLength, etc.)
  if (error.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ error: errors, data })
  }
  // Error de clave duplicada (userName o email)
  if (error.code === 11000) {
    const camposDuplicados = Object.keys(error.keyValue); // ej: ['email']
    const mensajes = camposDuplicados.map(campo =>
      `El ${campo} '${error.keyValue[campo]}' ya está registrado`
    );
    return res.status(400).json({ error: mensajes, data });
  }
  
  // 🎯 Error al parsear ObjectId inválido (por ejemplo en /users/:id)
  if (error.name === 'CastError') {
    return res.status(400).json({ error: [`ID inválido: ${error.value}`] });
  }
  // Otros errores
  return res.status(500).json({ error: 'Error del servidor', detalle: err.message })
}

module.exports = errorHandler