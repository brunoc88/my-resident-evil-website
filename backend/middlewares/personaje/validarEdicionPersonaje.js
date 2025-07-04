const Personaje = require('../../models/personaje') 

const validarEdicionPersonaje = async (req, res, next) => {
  if (!req.cambios) {
    return res.status(400).json({ 
      error: 'No se detectaron cambios para validar'
    })
  }

  const data = req.cambios
  const errores = []

  const CATEGORIAS_VALIDAS = ['héroe', 'villano', 'neutral', 'anti-héroe']
  const CONDICIONES_VALIDAS = ['vivo', 'muerto', 'desaparecido', 'desconocido']

  // Sanitización
  if ('nombre' in data) data.nombre = data.nombre.trim()
  if ('edad' in data) data.edad = data.edad.trim()
  if ('colorOjos' in data) data.colorOjos = data.colorOjos.trim().toLowerCase()
  if ('colorPelo' in data) data.colorPelo = data.colorPelo.trim().toLowerCase()
  if ('altura' in data) data.altura = Number(data.altura)
  if ('peso' in data) data.peso = Number(data.peso)
  if ('categoria' in data) data.categoria = data.categoria.trim()
  if ('oficio' in data) data.oficio = data.oficio.trim()
  if ('condicion' in data) data.condicion = data.condicion.trim()
  if ('primeraAparicion' in data) data.primeraAparicion = data.primeraAparicion.trim()
  if ('ultimaAparicion' in data) data.ultimaAparicion = data.ultimaAparicion.trim()
  if ('biografia' in data) data.biografia = data.biografia.trim()

  // Validaciones
  if ('nombre' in data) {
    if (!data.nombre) errores.push('Ingrese un nombre!')
    if (data.nombre.length < 3 || data.nombre.length > 30) {
      errores.push('Nombre: Debe tener entre 3 y 30 caracteres')
    }
  }

  if ('edad' in data && data.edad && !/^\d+$/.test(data.edad)) {
    errores.push('Edad: Debe ingresar solo números')
  }

  if ('colorOjos' in data && data.colorOjos.length > 20) {
    errores.push('Color de ojos: máximo 20 caracteres')
  }

  if ('colorPelo' in data && data.colorPelo.length > 20) {
    errores.push('Color de pelo: máximo 20 caracteres')
  }

  if ('altura' in data && isNaN(data.altura)) {
    errores.push('Altura: debe ser un número válido')
  }

  if ('peso' in data && isNaN(data.peso)) {
    errores.push('Peso: debe ser un número válido')
  }

  if ('oficio' in data && data.oficio.length > 50) {
    errores.push('Oficio: máximo 50 caracteres')
  }

  if ('biografia' in data && data.biografia.length > 500) {
    errores.push('Biografía: máximo 500 caracteres')
  }

  if ('categoria' in data && (!data.categoria || !CATEGORIAS_VALIDAS.includes(data.categoria))) {
    errores.push('Categoría inválida o no seleccionada!')
  }

  if ('condicion' in data && (!data.condicion || !CONDICIONES_VALIDAS.includes(data.condicion))) {
    errores.push('Condición inválida o no seleccionada!')
  }

  if ('primeraAparicion' in data && !data.primeraAparicion) {
    errores.push('Seleccione primera aparición!')
  }

  if ('ultimaAparicion' in data && !data.ultimaAparicion) {
    errores.push('Seleccione ultima aparición!')
  }

  if ('picture' in data && !req.file) {
    errores.push('Debe ingresar una foto!')
  }

  // Si hay errores, recupero el personaje de la DB y armo el objeto data
  if (errores.length > 0) {
    const personajeDB = await Personaje.findById(req.params.id)

    return res.status(400).json({
      error: errores,
      data: {
        nombre: data.nombre || personajeDB.nombre,
        edad: data.edad || personajeDB.edad,
        colorOjos: data.colorOjos || personajeDB.colorOjos,
        colorPelo: data.colorPelo || personajeDB.colorPelo,
        altura: data.altura || personajeDB.altura,
        peso: data.peso || personajeDB.peso,
        oficio: data.oficio || personajeDB.oficio,
        biografia: data.biografia || personajeDB.biografia,
        categoria: data.categoria || personajeDB.categoria,
        condicion: data.condicion || personajeDB.condicion,
        primeraAparicion: data.primeraAparicion || personajeDB.primeraAparicion,
        ultimaAparicion: data.ultimaAparicion || personajeDB.ultimaAparicion,
        picture: personajeDB.picture,
        id: personajeDB.id
      }
    })
  }

  next()
}

module.exports = validarEdicionPersonaje
