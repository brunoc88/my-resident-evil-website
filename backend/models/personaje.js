const mongoose = require('mongoose')
const comentarioSchema = require('./subdocumentos/comentarioSchema') //subdocumento 
// Esquema principal de Personaje
const personajeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30
  },
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
  categoria: {
    type: String,
    required: true
  },
  oficio: {
    type: String,
    maxlength: 50
  },
  condicion: {
    type: String,
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
  },
  estado: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: [] //esto es para que el usuario pueda dar like por unica vez!
  }],
  comentarios: [comentarioSchema] //pongo subdocumento
})

// Transformación JSON para quitar _id y __v
personajeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Personaje = mongoose.model('Personaje', personajeSchema)

module.exports = Personaje