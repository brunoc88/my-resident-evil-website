const mongoose = require('mongoose')
const validator = require('validator')//para que el email sea valido 
const mensajeSchema = require('./subDocuments/mensajes')

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        maxLength: 10,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Email inválido']
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    rol: {
        type: String //hardcodeado segun la ruta
    },
    pregunta: {
        type: String, //hardcodeada select/options
        required: true
    },
    respuesta: {
        type: String,
        required: true,
        maxLength: 60,
        minlength: 5
    },
    sobreMi: { //no es obligacion, si es vacia se guada como sin descripcion
        type: String,
        maxLength: 150
    },
    estado: {
        type: Boolean,
        default: true
    },
    picture: {
        type: String,
        default: 'default.png'//no es obligacion, si es vacia se guada con la imagen default en public
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    bloqueos:[{ //para control puse bloqueo para evitar recibir o enviar mensajes
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [] 
    }],
    mensajes:[mensajeSchema]
})


userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // el passwordHash no debe mostrarse
        delete returnedObject.password
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User