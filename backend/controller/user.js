const User = require('../models/user')
const logger = require('../utils/loggers')
const bcrypt = require('bcrypt')

exports.altaUser = async (req, res) => {
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
    logger.error(error)
    return res.status(500).json({ error: 'Error al crear el usuario' })
  }
}
