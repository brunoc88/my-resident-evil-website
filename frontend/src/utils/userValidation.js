
export const userNameValidation = {
  required: 'Nombre requerido',
  minLength: { value: 5, message: 'Mínimo 5 caracteres' },
  maxLength: { value: 10, message: 'Máximo 10 caracteres' }
}

export const passwordValidation = {
  required: 'Contraseña requerida',
  minLength: { value: 6, message: 'Mínimo 6 caracteres' }
}

export const password2Validation = (watch) => ({
  required: 'Debes confirmar la contraseña',
  validate: (value) => value === watch('password') || 'Las contraseñas no coinciden'
})

export const emailValidation = {
  required: 'Email requerido',
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Email inválido'
  }
}

export const preguntaValidation = {
  required: 'Selecciona una pregunta'
}

export const sobreMiValidation = {
  maxLength: {
    value: 150,
    message: 'Máximo 150 caracteres'
  }
}

export const respuestaValidation = {
  required: 'Respuesta requerida',
  minLength: { value: 5, message: 'Mínimo 5 caracteres' },
  maxLength: { value: 60, message: 'Máximo 60 caracteres' }
}
