const mongoose = require('mongoose')

const comentarioSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  mensaje: {
    type: String,
    required: true,
    maxlength: 280
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: Boolean,
    default: true
  }
})

module.exports = comentarioSchema
