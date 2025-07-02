const Personaje = require('../models/personaje')

exports.alta = async (req, res, next) => {
    try {
        const data = req.body

        //SIN DATOS o UNDEFINED SON LOS CAMPOS NO OBLIGATORIOS
        const newPersonaje = new Personaje({
            nombre: data.nombre,
            fechaNacimiento: data.fechaNacimiento || undefined,//NO ES OBLIGATORIO
            edad: data.edad || 'Sin datos',
            colorOjos: data.colorOjos || 'sin datos',
            colorPelo: data.colorPelo || 'sin datos',
            altura: data.altura || undefined,
            peso: data.peso || undefined,
            categoria: data.categoria,
            oficio: data.oficio || 'sin datos',
            condicion: data.condicion,
            primeraAparicion: data.primeraAparicion,
            ultimaAparicion: data.ultimaAparicion,
            picture: req.file.filename,
            biografia: data.biografia || 'sin datos'
        })

        const savedPersonaje = await newPersonaje.save()

        return res.status(201).json({
            msj: 'Éxito, personaje creado!',
            data: savedPersonaje
        })
    } catch (error) {
        next(error)
    }
}

exports.all = async (req, res, next) => {
    try {
        const data = await Personaje.find({})
        return res.status(200).json({ personajes: data })
    } catch (error) {
        next(error)
    }
}

exports.getPersonaje = async (req, res, next) => {
    try {
        const id = req.params.id
        const personaje = await Personaje.findById(id)

        if (!personaje || !personaje.estado) {
            return res.status(404).json({ error: 'Personaje inexistente o eliminado!' })
        }
        return res.status(200).json(personaje)
    } catch (error) {
        next(error)
    }
}

exports.eliminar = async (req, res, next) => {
    try {
        const id = req.params.id

        const personaje = await Personaje.findById(id)

        if (!personaje || !personaje.estado) {
            return res.status(404).json({ error: 'Personaje eliminado o desactivado!' })
        }

        await Personaje.findByIdAndUpdate(id, { estado: false })
        return res.status(200).json({ msj: 'Personaje eliminado!' })
    } catch (error) {
        next(error)
    }
}

exports.editar = async (req, res, next) => {
    try {
        const id = req.params.id
        const cambios = req.cambios

        cambios.fechaCU = new Date()

        await Personaje.findByIdAndUpdate(id, cambios)

        return res.status(200).json({
            msj: 'Personaje actualizado!'
        })
    } catch (error) {
        next(error)
    }
}