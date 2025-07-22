
export const userNameValidation = {
  required: 'Nombre requerido',
  minLength: { value: 5, message: 'Mínimo 5 caracteres' },
  maxLength: { value: 10, message: 'Máximo 10 caracteres' }
}

export const passwordValidation = (isAuth) => ({
  required: !isAuth ?'Contraseña requerida':false,
  minLength: { value: 6, message: 'Mínimo 6 caracteres' }
})

export const password2Validation = (watch, isAuth) => ({
  required: !isAuth ? 'Confirma tu contraseña' : false,
  validate: value => {
    const password = watch('password')
    if (!isAuth && value !== password) return 'Las contraseñas no coinciden'
    if (isAuth && value && value !== password) return 'Las contraseñas no coinciden'
    return true
  }
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
