const validarRegistroPersonaje = (req, res, next) => {
  const data = req.body
  const errores = []

  // Sanitización
  data.nombre = data.nombre?.trim()
  data.edad = data.edad?.trim()
  data.colorOjos = data.colorOjos?.trim().toLowerCase()
  data.colorPelo = data.colorPelo?.trim().toLowerCase()
  data.altura = data.altura?.trim()
  data.peso = data.peso?.trim()
  data.categoria = data.categoria?.trim()
  data.oficio = data.oficio?.trim()
  data.condicion = data.condicion?.trim()
  data.primeraAparicion = data.primeraAparicion?.trim()
  data.ultimaAparicion = data.ultimaAparicion?.trim()
  data.biografia = data.biografia?.trim()

  // Valores válidos
  const CATEGORIAS_VALIDAS = ['héroe', 'villano', 'neutral', 'anti-héroe']
  const CONDICIONES_VALIDAS = ['vivo', 'muerto', 'desaparecido', 'desconocido']

  // Validaciones de presencia obligatoria
  if (!data.nombre) errores.push('Ingrese un nombre!')
  if (!data.categoria || !CATEGORIAS_VALIDAS.includes(data.categoria)) errores.push('Categoría inválida o no seleccionada!')
  if (!data.condicion || !CONDICIONES_VALIDAS.includes(data.condicion)) errores.push('Condición inválida o no seleccionada!')
  if (!data.primeraAparicion) errores.push('Seleccione primera aparición!')
  if (!data.ultimaAparicion) errores.push('Seleccione última aparición!')
  if (!req.file) errores.push('Debe subir una imagen!')
    
  // Validaciones de longitud
  if (data.nombre && (data.nombre.length > 30 || data.nombre.length < 3)) {
    errores.push('Nombre: Debe tener entre 3 y 30 caracteres')
  }

  if (data.edad && !/^\d+$/.test(data.edad)) {
    errores.push('Edad: Debe ingresar solo números')
  }

  if (data.colorOjos && data.colorOjos.length > 20) {
    errores.push('Color de ojos: máximo 20 caracteres')
  }

  if (data.colorPelo && data.colorPelo.length > 20) {
    errores.push('Color de pelo: máximo 20 caracteres')
  }

  if (data.altura && isNaN(data.altura)) {
    errores.push('Altura: debe ser un número válido')
  } else if (data.altura) {
    data.altura = Number(data.altura)
  }

  if (data.peso && isNaN(data.peso)) {
    errores.push('Peso: debe ser un número válido')
  } else if (data.peso) {
    data.peso = Number(data.peso)
  }

  if (data.oficio && data.oficio.length > 50) {
    errores.push('Oficio: máximo 50 caracteres')
  }

  if (data.biografia && data.biografia.length > 500) {
    errores.push('Biografía: máximo 500 caracteres')
  }

  if (errores.length > 0) {
    return res.status(400).json({ errores, data })
  }

  next()
}

module.exports = validarRegistroPersonaje
