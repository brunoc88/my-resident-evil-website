const Personaje = require('../../models/personaje')

const validarCambiosPersonaje = async (req, res, next) => {
  const data = req.body
  const { id } = req.params
  let cambios = {}

  const personajeDB = await Personaje.findById(id)

  if (!personajeDB || personajeDB.estado === false) {
    return res.status(404).json({ error: 'Personaje inexistente o eliminado' })
  }

  if ('nombre' in data && data.nombre !== personajeDB.nombre) cambios.nombre = data.nombre
  if ('fechaNacimiento' in data &&
    new Date(data.fechaNacimiento).toISOString().slice(0, 10) !==
    new Date(personajeDB.fechaNacimiento).toISOString().slice(0, 10)
  ) {
    cambios.fechaNacimiento = data.fechaNacimiento
  }
  if ('edad' in data && data.edad !== personajeDB.edad) cambios.edad = data.edad
  if ('colorOjos' in data && data.colorOjos !== personajeDB.colorOjos) cambios.colorOjos = data.colorOjos
  if ('colorPelo' in data && data.colorPelo !== personajeDB.colorPelo) cambios.colorPelo = data.colorPelo

  if ('altura' in data && Number(data.altura) !== personajeDB.altura) cambios.altura = Number(data.altura)
  if ('peso' in data && Number(data.peso) !== personajeDB.peso) cambios.peso = Number(data.peso)

  if ('categoria' in data && data.categoria !== personajeDB.categoria) cambios.categoria = data.categoria
  if ('oficio' in data && data.oficio !== personajeDB.oficio) cambios.oficio = data.oficio
  if ('condicion' in data && data.condicion !== personajeDB.condicion) cambios.condicion = data.condicion
  if ('primeraAparicion' in data && data.primeraAparicion !== personajeDB.primeraAparicion) cambios.primeraAparicion = data.primeraAparicion
  if ('ultimaAparicion' in data && data.ultimaAparicion !== personajeDB.ultimaAparicion) cambios.ultimaAparicion = data.ultimaAparicion


  if (req.file && req.file.filename !== personajeDB.picture) {
    cambios.picture = req.file.filename
  }
  
  if ('biografia' in data && data.biografia !== personajeDB.biografia) cambios.biografia = data.biografia

  if (Object.keys(cambios).length === 0) {
    return res.status(400).json({ error: 'No hay cambios!', data: personajeDB })
  }

  req.cambios = cambios
  next()
}

module.exports = validarCambiosPersonaje