const mongoose = require('mongoose')

const denunciaSchema = mongoose.Schema({
  denunciante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entidad: {
    tipo: {
      type: String,
      enum: ['User', 'Personaje'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  motivo: {
    type: String,
    required: true,
    maxlength: 100
  },
  mensaje: {
    type: String,
    maxlength: 500 
  },
  estado: {
    type: Boolean,
    default: true // true = pendiente, false = resuelta
  },
  fecha: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Denuncia', denunciaSchema)
