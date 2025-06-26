const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

exports.login = async (req, res, next) => {
    try {
        const { password } = req.body
        const user = req.user

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) return res.status(401).json({ error: 'password incorrecto!' })

        const userForToken = {
            id: user._id,
            userName: user.userName,
            email: user.email,
            rol: user.rol
        }

        const token = jwt.sign(userForToken, SECRET, { expiresIn: '1h' })

        return res.status(200).json({
            msj: 'Login exitoso!', token, user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                rol: user.rol,
                picture: user.picture
            }
        })
    } catch (error) {
        next(error)
    }
}