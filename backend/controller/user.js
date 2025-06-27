const User = require('../models/user')
const bcrypt = require('bcrypt')
const { CLAVE_SECRETA_ADMIN } = require('../utils/config')
const { error } = require('console')

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

    if (!data.secreto || data.secreto.trim().length === 0) return res.status(400).json({error: 'Debe ingresa clave secreta!'})
    if (data.secreto !== CLAVE_SECRETA_ADMIN) return res.status(400).json({error: 'Clave secreta incorrecta!'})
    if (data.secreto && /\s/.test(data.secreto)) {
      return res.status(400).json({error: 'El password no debe contener espacios'})
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

exports.perfil = async (req, res, next) => {
  try {
    const id = req.params.id

    const perfil = await User.findById(id)

    if(!perfil){
      return res.status(404).json({error: 'Usuario no encontrado!'})
    }

    return res.status(200).json({user: perfil})        
  } catch (error) {
    next(error)
  }
}

exports.miPerfil = async (req, res, next) => {
  try {
    const id = req.params.id

    const perfil = await User.findById(id)
    
    if (!perfil) {
      return res.status(404).json({ error: 'Usuario no encontrado!' })
    }

    if (perfil._id.toString() !== req.user.id.toString()) {
      return res.status(401).json({ error: 'Sin autorización!' })
    }

    return res.status(200).json({ perfil })
  } catch (error) {
    next(error)
  }
}
