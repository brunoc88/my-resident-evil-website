const validarEdicionPersonaje = (req, res, next) => {
    if (!req.cambios) {
        return res.status(400).json({ error: 'No se detectaron cambios para validar' })
    }

    const data = req.cambios
    let errores = []


    // Valores válidos
    const CATEGORIAS_VALIDAS = ['héroe', 'villano', 'neutral', 'anti-héroe']
    const CONDICIONES_VALIDAS = ['vivo', 'muerto', 'desaparecido', 'desconocido']

    // Sanitización solo si el campo existe
    if ('nombre' in data) data.nombre.trim()
    if ('edad' in data) data.edad.trim()
    if ('colorOjos' in data) data.colorOjos.trim().toLowerCase()
    if ('colorPelo' in data) data.colorPelo.trim().toLowerCase()
    if ('altura' in data) Number(data.altura)
    if ('peso' in data) Number(data.peso)
    if ('categoria' in data) data.categoria.trim()
    if ('oficion' in data) data.oficio.trim()
    if ('condicion' in data) data.condicion.trim()
    if ('primeraAparicion' in data) data.primeraAparicion.trim()
    if ('ultimaAparicion' in data) data.ultimaAparicion.trim()
    if ('biografia' in data) data.biografia.trim()


    //validaciones 

    if ('nombre' in data) {
        if (!data.nombre) errores.push('Ingrese un nombre!')
        if (data.nombre.length < 3 || data.nombre.length > 30) {
            errores.push('Nombre: Debe tener entre 3 y 30 caracteres')
        }

    }

    if ('edad' in data) {
        if (data.edad && !/^\d+$/.test(data.edad)) {
            errores.push('Edad: Debe ingresar solo números')
        }
    }

    if ('colorOjos' in data) {
        if (data.colorOjos && data.colorOjos.length > 20) {
            errores.push('Color de ojos: máximo 20 caracteres')
        }
    }

    if ('colorPelo' in data) {
        if (data.colorPelo && data.colorPelo.length > 20) {
            errores.push('Color de pelo: máximo 20 caracteres')
        }
    }

    if ('altura' in data) {
        if (data.altura && isNaN(data.altura)) {
            errores.push('Altura: debe ser un número válido')
        } else if (data.altura) {
            data.altura = Number(data.altura)
        }
    }

    if ('peso' in data) {
        if (data.peso && isNaN(data.peso)) {
            errores.push('Peso: debe ser un número válido')
        } else if (data.peso) {
            data.peso = Number(data.peso)
        }
    }

    if ('oficio' in data) {
        if (data.oficio && data.oficio.length > 50) {
            errores.push('Oficio: máximo 50 caracteres')
        }
    }

    if ('biografia' in data) {
        if (data.biografia && data.biografia.length > 500) {
            errores.push('Biografía: máximo 500 caracteres')
        }
    }

    if ('categoria' in data) {
        if (!data.categoria || !CATEGORIAS_VALIDAS.includes(data.categoria)) {
            errores.push('Categoría inválida o no seleccionada!')
        }
    }

    if ('condicion' in data) {
        if (!data.condicion || !CONDICIONES_VALIDAS.includes(data.condicion)) {
            errores.push('Condición inválida o no seleccionada!')
        }
    }

    if ('primeraAparicion' in data) {
        if (!data.primeraAparicion) {
            errores.push('Seleccione primera aparición!')
        }
    }

    if ('ultimaAparicion' in data) {
        if (!data.ultimaAparicion) {
            errores.push('Seleccione ultima aparición!')
        }
    }

    if ('picture' in data && !req.file) {
        errores.push('Debe ingresar una foto!')
    }

    if (errores.length > 0) {
        return res.status(400).json({ error: errores })
    }

    next()
}

module.exports = validarEdicionPersonaje