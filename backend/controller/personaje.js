const Personaje = require('../models/personaje')

exports.alta = async(req, res, next) => {
    try {
        const data = req.body
    } catch (error) {
        next(error)
    }
}