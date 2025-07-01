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

