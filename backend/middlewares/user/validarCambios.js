const User = require('../../models/user')
const bcrypt = require('bcrypt')

const validarCambios = async (req, res, next) => {
    const { userName, email, pregunta, respuesta, password, sobreMi } = req.body
    let cambios = {}

    const userDB = await User.findById(req.params.id)

    if (!userDB) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (!userDB.estado) {
        return res.status(403).json({ error: 'Usuario inactivo o eliminado' })
    }

    if (req.user.id !== userDB.id) {
        return res.status(403).json({ error: 'No tienes permiso!' })
    }

    if (userName && userName !== userDB.userName) cambios.userName = userName
    if (email && email !== userDB.email) cambios.email = email
    if (pregunta && pregunta !== userDB.pregunta) cambios.pregunta = pregunta
    if (respuesta && respuesta !== userDB.respuesta) cambios.respuesta = respuesta

    if (password) {
        const isSame = await bcrypt.compare(password, userDB.password)
        if (!isSame) {
            const newHash = await bcrypt.hash(password, 10)
            cambios.password = newHash
        }
    }

    if (sobreMi && sobreMi !== userDB.sobreMi) cambios.sobreMi = sobreMi

    if (req.file && req.file.filename !== userDB.picture) {
        cambios.picture = req.file.filename
    }

    if (Object.keys(cambios).length > 0) {
        req.cambios = cambios
    } else {
        return res.status(400).json({ error: 'No hay cambios!', data:userDB })
    }

    next()
}

module.exports = validarCambios
