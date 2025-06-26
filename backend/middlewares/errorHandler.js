const errorHandler = (error, req, res, next) => {
  const data = req.body ? req.body : null

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(e => e.message)
    return res.status(400).json({ error: errors, data })
  }

  if (error.code === 11000) {
    const camposDuplicados = Object.keys(error.keyValue)
    const mensajes = camposDuplicados.map(campo =>
      `El ${campo} '${error.keyValue[campo]}' ya está registrado`
    )
    return res.status(400).json({ error: mensajes, data })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ error: [`ID inválido: ${error.value}`] })
  }

  return res.status(500).json({ error: 'Error del servidor', detalle: error.message })
}

module.exports = errorHandler