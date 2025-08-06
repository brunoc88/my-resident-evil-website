const mongoose = require('mongoose')
const User = require('../models/user')
const Personaje = require('../models/personaje')
const bcrypt = require('bcrypt')
const crypto = require('crypto') // para generar clave mas segura
const { CLAVE_SECRETA_ADMIN } = require('../utils/config')


exports.altaUser = async (req, res, next) => {
  try {
    const data = req.body

    const passwordHash = await bcrypt.hash(data.password, 10)

    const newUser = new User({
      userName: data.userName.toLowerCase(),
      email: data.email.toLowerCase(),
      password: passwordHash,
      rol: "comun",
      pregunta: data.pregunta,
      respuesta: data.respuesta,
      sobreMi: data.sobreMi ? data.sobreMi : 'Sin descripción',
      picture: req.file ? req.file.filename : 'default.png'
    })

    const savedUser = await newUser.save()
    return res.status(201).json({ msj: 'Usuario creado con éxito', user: savedUser })
  } catch (error) {
    return next(error)// Delega el manejo al middleware de errores
  }
}

exports.altaUserAdmin = async (req, res, next) => {
  try {
    const data = req.body

    if (!data.secreto || data.secreto.trim().length === 0) return res.status(400).json({ error: 'Debe ingresa clave secreta!', data })
    if (data.secreto !== CLAVE_SECRETA_ADMIN) return res.status(400).json({ error: 'Clave secreta incorrecta!', data })
    if (data.secreto && /\s/.test(data.secreto)) {
      return res.status(400).json({ error: 'El password no debe contener espacios', data })
    }
    const passwordHash = await bcrypt.hash(data.password, 10)

    const newUser = new User({
      userName: data.userName.toLowerCase(),
      email: data.email.toLowerCase(),
      password: passwordHash,
      rol: "admin",
      pregunta: data.pregunta,
      respuesta: data.respuesta,
      sobreMi: data.sobreMi ? data.sobreMi : 'Sin descripción',
      picture: req.file ? req.file.filename : 'default.png'
    })

    const savedUser = await newUser.save()
    return res.status(201).json({ msj: 'Usuario creado con éxito', user: savedUser })
  } catch (error) {
    return next(error)// Delega el manejo al middleware de errores
  }
}

//todos pueden ver el perfil de todos siempre que este logueado
exports.perfil = async (req, res, next) => {
  try {
    const userName = req.params.userName

    const perfil = await User.findOne({ userName })

    if (!perfil || perfil.estado === false) {
      return res.status(404).json({ error: 'Usuario no encontrado o cuenta eliminada' })
    }

    return res.status(200).json({ user: perfil })
  } catch (error) {
    next(error)
  }
}

//solo yo puedo verlo 
//aqui no hace falta validar si el id buscado coinciden con el logueado
//porque ya obtengo del req.user
//por lo que solo 
exports.miPerfil = async (req, res, next) => {
  try {
    const perfil = req.user;

    if (!perfil || perfil.estado === false) {
      return res.status(404).json({ error: 'Usuario no encontrado o cuenta inactiva' });
    }

    return res.status(200).json({ user: perfil })
  } catch (error) {
    next(error)
  }
}

//El usuario comun podra eliminar solo su misma cuenta
//El usuario admin podra eliminar tambien su misma cuenta y la de un
//usuario comun

exports.eliminarCuenta = async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (!user.estado) {
      return res.status(400).json({ error: 'La cuenta ya está inactiva' })
    }

    // Solo el dueño de la cuenta o un admin pueden eliminar
    if (req.user.id !== user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Sin autorización!' })
    }

    // Un admin no puede eliminar a otro admin
    if (req.user.id !== user.id && req.user.rol === user.rol) {
      return res.status(403).json({ error: 'No puedes eliminar un usuario con tu mismo rol' })
    }

    await User.findByIdAndUpdate(id, { estado: false }, { new: true })

    return res.status(200).json({ msj: 'Cuenta eliminada!' })
  } catch (error) {
    next(error)
  }
}

// Solo los administradores pueden reactivar cuentas
exports.reactivarCuenta = async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (user.estado === true) {
      return res.status(400).json({ error: 'La cuenta ya está activa' })
    }


    await User.findByIdAndUpdate(id, { estado: true }, { new: true })

    return res.status(200).json({ msj: 'Cuenta reactivada!' })
  } catch (error) {
    next(error)
  }
}

// Lista de baneados, solo vista por admins
exports.listaDeBaneados = async (req, res, next) => {
  try {
    const lista = await User.find({ estado: false })
    return res.status(200).json(lista)
  } catch (error) {
    next(error)
  }
}
//cualquier usuario puede recuperarla
exports.recuperarPassword = async (req, res, next) => {
  try {
    const { email, pregunta, respuesta } = req.body

    const checkUser = await User.findOne({ email })

    if (!checkUser) {
      return res.status(404).json({ error: 'Usuario incorrecto o inexistente' })
    }

    if (!checkUser.estado) {
      return res.status(400).json({ error: 'Usuario eliminado o inactivo' })
    }


    if (pregunta !== checkUser.pregunta || respuesta !== checkUser.respuesta) {
      return res.status(400).json({ error: 'Pregunta o respuesta incorrecta', data: { email, pregunta } })
    }

    const nuevaPassword = generarPasswordAleatoria()
    const passwordHasheada = await bcrypt.hash(nuevaPassword, 10)

    await User.findByIdAndUpdate(checkUser._id, { password: passwordHasheada })

    return res.status(200).json({
      msj: 'Password recuperado!',
      nuevaPassword // esta deberías mostrarla solo temporalmente del lado del frontend
    })

  } catch (error) {
    next(error)
  }
}

exports.editarUsuario = async (req, res, next) => {
  try {
    const id = req.params.id
    const cambios = req.cambios
    await User.findByIdAndUpdate(id, cambios)
    return res.status(200).json({
      msj: 'Usuario Actualizado!'
    })
  } catch (error) {
    next(error)
  }
}

//para ver los likes del usuario
exports.allLikes = async (req, res, next) => {
  try {
    const userId = req.user.id
    const personajes = await Personaje.find({ likes: userId })
    res.status(200).json(personajes)
  } catch (error) {
    next(error)
  }
}

//un usuario no puede mandar mensajes a un usuario bloqueado
exports.mandarMensaje = async (req, res, next) => {
  try {
    let mensaje = req.body.mensaje?.trim()
    const replyTo = req.body.replyTo
    const id = req.params.id
    const user = await User.findById(id)

    if (!mensaje) {
      return res.status(400).json({ error: '¡Mensaje vacio!' })
    }

    if (mensaje && mensaje.length > 280) {
      return res.status(400).json({ error: 'El mensaje pasó el límite de caracteres permitido!' })
    }

    //responder mensaje
    if (replyTo) {
      if (!mongoose.Types.ObjectId.isValid(replyTo)) {
        return res.status(400).json({ error: 'El ID del mensaje al que respondes no es válido' })
      }

      // Buscamos el mensaje original en el receptor actual
      // Si no se encuentra, intentar buscar en el emisor actual
      const mensajeOriginalReceptor = user.mensajes.find(m => m._id.toString() === replyTo)

      // Intentar buscar en el usuario actual (el que envía el mensaje)
      const emisor = await User.findById(req.user.id)
      const mensajeOriginalEmisor = emisor?.mensajes.find(m => m._id.toString() === replyTo)

      if (!mensajeOriginalReceptor && !mensajeOriginalEmisor) {
        return res.status(400).json({ error: 'El mensaje al que estás respondiendo no existe' })
      }
    }



    const nuevoMensaje = {
      usuario: req.user.id, // El id del usuario logueado
      mensaje: mensaje,
      fecha: new Date(),
      estado: true,
      replyTo: replyTo || null // Para responder el mismo mensaje
    }

    user.mensajes.push(nuevoMensaje)
    await user.save()

    const ultimoMensaje = user.mensajes[user.mensajes.length - 1]
    //mensajeId para obtener el id del mensaje
    res.status(201).json({ msj: 'Mensaje Enviado!', mensajeId: ultimoMensaje._id })
  } catch (error) {
    next(error)
  }
}

// Solo el receptor puede eliminar el mensaje
// Controlador para eliminar un mensaje de la casilla del usuario autenticado
exports.eliminarMensaje = async (req, res, next) => {
  try {
    const mensajeId = req.params.id

    if (!mongoose.Types.ObjectId.isValid(mensajeId)) {
      return res.status(400).json({ error: 'ID de mensaje inválido' })
    }

    // Buscar por id del usuario autenticado
    const user = await User.findById(req.user.id)
    if (!user || !user.estado) return res.status(404).json({ error: 'Usuario no encontrado' })

    // Buscar el mensaje dentro del array de mensajes del usuario autenticado
    // formas de busacar en un array de subdocumentos en este caso mensajes

    // #1
    const mensaje = user.mensajes.id(mensajeId)

    /* #2
   const mensaje = user.mensajes.find(m => m._id.toString() === mensajeId.toString())
   
    #3
    const user = await User.findOne({
      _id: userId,
      'mensajes._id': mensajeId
      })
   */
    if (!mensaje || !mensaje.estado) {
      return res.status(404).json({ error: 'Mensaje inexistente o ya fue eliminado' })
    }


    /*
    // ACTUALIZACION DIRECTA! 
      await User.updateOne(
        { _id: userId, 'mensajes._id': mensajeId },
        { $set: { 'mensajes.$.estado': false } }
      ) 
          
    */
    mensaje.estado = false
    await user.save()

    res.status(200).json({ msj: 'Mensaje eliminado!' })
  } catch (error) {
    console.error('ERROR EN ELIMINAR MENSAJE:', error)
    next(error)
  }
}

//obtener todos los mensajes activos
exports.allMsj = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" })

    //Si los mensajes pueden crecer mucho, se puede solicitar ese campo a la base:
    //const user = await User.findById(req.user.id).select('mensajes')

    let allMsj = user.mensajes.filter(m => m.estado)

    return res.status(200).json({ mensaje: allMsj })
  } catch (error) {
    next(error)
  }
}

// chat de toda la conversacion con el usuario
exports.getHiloConversacion = async (req, res, next) => {
  try {
    const usuarioId = req.user.id
    const otroUsuarioId = req.params.id

    // Traigo ambos usuarios
    const user = await User.findById(usuarioId)
    const otroUser = await User.findById(otroUsuarioId)

    if (!user || !otroUser) return res.status(404).json({ error: 'Usuario no encontrado' })

    // Filtrar mensajes del usuario que sean enviados o recibidos por el otro usuario
    const mensajesUsuario = user.mensajes.filter(m => m.usuario.toString() === otroUsuarioId || otroUsuarioId === usuarioId)

    // Filtrar mensajes del otro usuario que involucren al usuario actual
    const mensajesOtroUser = otroUser.mensajes.filter(m => m.usuario.toString() === usuarioId || usuarioId === otroUsuarioId)

    // Combinar
    const hiloCompleto = [...mensajesUsuario, ...mensajesOtroUser]

    // Ordenar por fecha ascendente
    hiloCompleto.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

    return res.status(200).json({ mensajes: hiloCompleto })
  } catch (error) {
    next(error)
  }
}

// tipo "bandeja de entrada"
// Muestre un solo mensaje por cada usuario emisor
// Devuelve un resumen de últimas conversaciones, agrupando por usuario
// Devuelva info del emisor (userName, email, etc.)
// Permita después hacer clic y ver el hilo (si decidís implementarlo luego).
exports.resumenMensajes = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('mensajes.usuario', 'userName email')

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" })

    const mensajesActivos = user.mensajes
      .filter(m => m.estado)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    const vistos = new Set()
    const resumen = []

    for (const m of mensajesActivos) {
      const idEmisor = m.usuario._id.toString()
      if (!vistos.has(idEmisor)) {
        resumen.push({
          _id: m._id,
          de: {
            id: m.usuario._id,
            userName: m.usuario.userName,
            email: m.usuario.email
          },
          mensaje: m.mensaje,
          fecha: m.fecha
        })
        vistos.add(idEmisor)
      }
    }

    res.status(200).json({ mensajes: resumen })
  } catch (error) {
    next(error)
  }
}


//funciones de bloqueo
//un usuario comun no puede bloquear a un admin
exports.bloquear = async (req, res, next) => {
  try {
    const id = req.params.id // usuario a bloquear
    const myId = req.user.id

    const emisor = await User.findById(myId)
    const receptor = await User.findById(id)

    // Evitar que te bloquees a vos mismo
    if (id === myId) {
      return res.status(400).json({ error: "No puedes bloquearte a ti mismo." })
    }

    if (emisor.rol === 'comun' && receptor.rol === 'admin') {
      return res.status(403).json({ error: 'No puedes bloquear a un administrador!' })
    }
    // En este punto, verifyBlock ya garantizó:
    // - El usuario a bloquear existe y está activo
    // - No está bloqueado previamente
    // - No me tiene bloqueado

    // Buscamos el usuario autenticado
    const user = await User.findById(myId)

    user.bloqueos.push(id)
    await user.save()

    return res.status(200).json({ msj: `Usuario bloqueado!` })
  } catch (error) {
    next(error)
  }
}

exports.desbloquear = async (req, res, next) => {
  try {
    const id = req.params.id
    const user = await User.findById(req.user.id)

    // Filtra el array y reasigna
    user.bloqueos = user.bloqueos.filter(u => u.toString() !== id.toString())

    await user.save()
    return res.status(200).json({ msj: `Usuario desbloqueado!` })
  } catch (error) {
    next(error)
  }
}

exports.listaBloqueados = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('bloqueos')
      .populate('bloqueos', 'userName email picture estado')

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    return res.status(200).json({ bloqueados: user.bloqueos })
  } catch (error) {
    next(error)
  }
}

// funciones de seguimiento de usuarios

exports.seguirUsuario = async (req, res, next) => {
  try {
    const id = req.params.id

    const yo = await User.findById(req.user.id)
    const user = await User.findById(id)

    // Validaciones
    if (!user || !user.estado) {
      return res.status(404).json({ error: 'Usuario no encontrado o desactivado' })
    }

    if (yo._id.equals(user._id)) {
      return res.status(400).json({ error: 'No puedes seguirte a ti mismo' })
    }

    // Verificar si ya lo sigo
    const yaLoSigo = yo.seguidos.includes(user._id)
    if (yaLoSigo) {
      return res.status(400).json({ error: 'Ya sigues a este usuario' })
    }

    // Agregar relación
    yo.seguidos.push(user._id)
    user.seguidores.push(yo._id)

    // Guardar ambos documentos
    await yo.save()
    await user.save()

    return res.status(200).json({ msj: `Ahora sigues a ${user.userName}` })

  } catch (error) {
    next(error)
  }
}

exports.dejarDeSeguirUsuario = async (req, res, next) => {
  try {
    const id = req.params.id
    const yo = await User.findById(req.user.id)
    const user = await User.findById(id)

    // Validaciones
    if (!user || !user.estado) {
      return res.status(404).json({ error: 'Usuario no encontrado o desactivado' })
    }

    // Verificar si lo sigo
    if (!yo.seguidos.includes(user._id)) {
      return res.status(400).json({ error: 'No estás siguiendo a este usuario' })
    }

    // Eliminarlo de mis seguidos
    yo.seguidos = yo.seguidos.filter(u => u.toString() !== user._id.toString())

    // Eliminarme de sus seguidores
    user.seguidores = user.seguidores.filter(u => u.toString() !== yo._id.toString())

    await yo.save()
    await user.save()

    return res.status(200).json({ msj: `Ya no sigues a ${user.userName}` })
  } catch (error) {
    next(error)
  }
}

exports.misSeguidos = async (req, res, next) => {
  try {
    const yo = await User.findById(req.user.id)
      .select('seguidos')
      .populate('seguidos', 'userName email picture estado')

    const seguidosActivos = yo.seguidos.filter(u => u.estado)

    return res.status(200).json({ seguidos: seguidosActivos })
  } catch (error) {
    next(error)
  }
}

exports.misSeguidores = async (req, res, next) => {
  try {
    const yo = await User.findById(req.user.id)
      .select('seguidores')
      .populate('seguidores', 'userName email picture estado')

    const seguidoresActivos = yo.seguidores.filter(u => u.estado)

    return res.status(200).json({ seguidores: seguidoresActivos })
  } catch (error) {
    next(error)
  }
}


const generarPasswordAleatoria = (longitud = 12) => {
  return crypto.randomBytes(longitud).toString('hex').slice(0, longitud)  // ej: "a9d0e3f1b2c4"
}

