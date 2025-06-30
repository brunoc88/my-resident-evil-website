const User = require('../models/user')
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

    if (!data.secreto || data.secreto.trim().length === 0) return res.status(400).json({ error: 'Debe ingresa clave secreta!' })
    if (data.secreto !== CLAVE_SECRETA_ADMIN) return res.status(400).json({ error: 'Clave secreta incorrecta!' })
    if (data.secreto && /\s/.test(data.secreto)) {
      return res.status(400).json({ error: 'El password no debe contener espacios' })
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
      return res.status(400).json({ error: 'Pregunta o respuesta incorrecta' })
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

const generarPasswordAleatoria = (longitud = 12) => {
  return crypto.randomBytes(longitud).toString('hex').slice(0, longitud)  // ej: "a9d0e3f1b2c4"
}

