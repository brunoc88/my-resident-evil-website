const mongoose = require('mongoose')
const validator = require('validator')//para que el email sea valido 

const userSchema = mongoose.Schema({
    userName:{
        type: String,
        required: true,
        unique: true,
        maxLength: 10,
        minlength:5
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Email inválido']
    },
    password:{
        type: String,
        required: true,
        minlength: 5
    },
    rol:{
        type: String
    },
    pregunta:{
        type: String,
        required: true
    },
    respuesta:{
        type: String,
        required: true,
        maxLength: 60,
        minlength:5
    },
    sobreMi:{
        type: String,
        maxLength: 150
    },
    estado:{
        type: Boolean,
        default: true
    },
    picture: {
      type: String,
      default: 'default.png'
    }
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