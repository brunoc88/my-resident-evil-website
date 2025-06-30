const mongoose = require('mongoose')

const personajeSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30
    },
    //campos opcionales y hardcodeados en el controlador
    fechaNacimiento: {
        type: Date 
    },
    edad: {
        type: String
    },
    colorOjos: {
        type: String,
        maxlength: 20
    },
    colorPelo: {
        type: String,
        maxlength: 20
    },
    altura: {
        type: Number
    },
    peso: {
        type: Number
    },
    //categoria si es obligado
    categoria: {
        type: String, //select/options: villano, heroe, etc
        required: true
    },
    oficio: {
        type: String,
        maxlength: 50
    },
    condicion: {
        type: String, //select/options: vivo, muerto, desaparecido
        required: true
    },
    primeraAparicion: {
        type: String,
        required: true
    },
    ultimaAparicion: {
        type: String,
        required: true
    },
    fechaCU: {
        type: Date,
        default: Date.now
    },
    picture: {
        type: String,
        required: true
    },
    biografia: {
        type: String,
        maxlength: 500
    }
})


personajeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Personaje = mongoose.model('Personaje', personajeSchema)

module.exports = Personaje