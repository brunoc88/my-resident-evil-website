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

exports.like = async (req, res, next) => {
    try {
        const userId = req.user.id
        const personaje = await Personaje.findById(req.params.id)

        if (!personaje || !personaje.estado) {
            return res.status(404).json({ error: 'Personaje eliminado o inexistente!' })
        }
        if (!personaje.likes.includes(userId)) {
            personaje.likes.push(userId)
            await personaje.save()
        }
        res.status(200).json({ likes: personaje.likes.length })
    } catch (error) {
        next(error)
    }
}

exports.unlike = async (req, res, next) => {
    try {
        const userId = req.user.id
        const personaje = await Personaje.findById(req.params.id)

        if (!personaje || !personaje.estado) {
            return res.status(404).json({ error: 'Personaje eliminado o inexistente!' })
        }
        personaje.likes = personaje.likes.filter(id => id.toString() !== userId)
        await personaje.save()
        res.status(200).json({ likes: personaje.likes.length })
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

exports.postearComentario = async (req, res, next) => {
    try {
        const id = req.params.id
        const personaje = await Personaje.findById(id)

        if (!personaje || !personaje.estado) {
            return res.status(404).json({ error: 'Personaje eliminado o inexistente!' })
        }

        const { mensaje } = req.body

        if (!mensaje || mensaje.trim().length === 0) {
            return res.status(400).json({ error: '¡Escriba un comentario!' })
        }

        if (mensaje && mensaje.length > 280) {
            return res.status(400).json({ error: 'El comentario pasó el límite de caracteres permitido!' })
        }


        const nuevoComentario = {
            usuario: req.user.id, // El id del usuario logueado
            mensaje: mensaje,
            fecha: new Date(),
            estado: true
        }

        personaje.comentarios.push(nuevoComentario)
        await personaje.save()

        //devuelve el personaje con los comentarios populados
        await personaje.populate('comentarios.usuario', 'userName picture')

        res.status(201).json({
            msj: 'Comentario agregado',
            //esto devuelve el ultimo mensaje, osea el que acabamos de hacer
            comentario: personaje.comentarios[personaje.comentarios.length - 1]
        })
    } catch (error) {
        next(error)
    }
}

exports.editarComentario = async (req, res, next) => {
  try {
    const personajeId = req.params.id
    const comentarioId = req.params.idComentario
    const personaje = await Personaje.findById(personajeId)

    if (!personaje || !personaje.estado) {
      return res.status(404).json({ error: 'Personaje eliminado o inexistente!' })
    }

    //busco que exista coincidencia de id tanto del comentario como el usuario que lo hizo
    const comentario = personaje.comentarios.find(
      c => c._id.toString() === comentarioId && c.usuario.toString() === req.user.id
    )

    if (!comentario || !comentario.estado) {
      return res.status(404).json({ error: 'Comentario eliminado o inexistente' })
    }

   
    const nuevoTexto = req.body.mensaje

    if (!nuevoTexto || nuevoTexto.trim().length === 0) {
      return res.status(400).json({ error: '¡Escriba un comentario!' })
    }

    if (nuevoTexto.length > 280) {
      return res.status(400).json({ error: 'El comentario pasó el límite de caracteres permitido!' })
    }

    if (nuevoTexto === comentario.mensaje) {
      return res.status(400).json({ error: 'No hay cambios' })
    }

    // Editar el comentario
    comentario.mensaje = nuevoTexto
    // Opcional: marcar que fue editado
    comentario.fecha = new Date() // o agregar un campo comentario.editado = true
    await personaje.save()

    res.status(200).json({
      msj: 'Comentario actualizado',
      comentario
    })
  } catch (error) {
    next(error)
  }
}

exports.eliminarComentario = async (req, res, next) => {
  try {
    const personajeId = req.params.id
    const comentarioId = req.params.idComentario
    const personaje = await Personaje.findById(personajeId)

    if (!personaje || !personaje.estado) {
      return res.status(404).json({ error: 'Personaje eliminado o inexistente!' })
    }

    const comentario = personaje.comentarios.find(
      c => c._id.toString() === comentarioId
    )

    if (!comentario || !comentario.estado) {
      return res.status(404).json({ error: 'Comentario inexistente o ya eliminado' })
    }

    const esAutor = comentario.usuario.toString() === req.user.id
    const esAdmin = req.user.rol === 'admin'

    if (!esAutor && !esAdmin) {
      return res.status(403).json({ error: 'No tiene permisos para eliminar este comentario' })
    }

    comentario.estado = false
    await personaje.save()

    res.status(200).json({ msj: 'Comentario eliminado correctamente' })
  } catch (error) {
    next(error)
  }
}

exports.getComentarios = async (req, res, next) => {
  try {
    const personajeId = req.params.id
    const personaje = await Personaje.findById(personajeId).populate('comentarios.usuario', 'userName picture')

    if (!personaje || !personaje.estado) {
      return res.status(404).json({ error: 'Personaje eliminado o inexistente!' })
    }

    const comentariosActivos = personaje.comentarios.filter(c => c.estado)

    res.status(200).json(comentariosActivos)
  } catch (error) {
    next(error)
  }
}
