// Constantes para selects
export const CATEGORIAS_VALIDAS = ['héroe', 'villano', 'neutral', 'anti-héroe']
export const CONDICIONES_VALIDAS = ['vivo', 'muerto', 'desaparecido', 'desconocido']

// Campos obligatorios con validaciones estrictas
export const validarNombre = {
  required: 'Nombre requerido',
  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
  maxLength: { value: 30, message: 'Máximo 30 caracteres' }
}

export const validarCategoria = {
  required: 'Categoría inválida o no seleccionada!',
  validate: (value) =>
    CATEGORIAS_VALIDAS.includes(value) || 'Categoría inválida o no seleccionada!'
}

export const validarCondicion = {
  required: 'Condición inválida o no seleccionada!',
  validate: (value) =>
    CONDICIONES_VALIDAS.includes(value) || 'Condición inválida o no seleccionada!'
}

export const validarPrimeraAparicion = {
  required: 'Seleccione primera aparición!'
}

export const validarUltimaAparicion = {
  required: 'Seleccione última aparición!'
}

export const validarImagen = {
  required: 'Debe subir una imagen!'
}

// Campos opcionales con validación condicional
export const validarEdad = {
  validate: (value) => {
    if (!value) return true
    if (!/^\d+$/.test(value)) return 'Edad inválida, debe ingresar solo números'
    return true
  }
}

export const validarColorDeOjos = {
  maxLength: { value: 20, message: 'Máximo 20 caracteres' }
}

export const validarColorDePelo = {
  maxLength: { value: 20, message: 'Máximo 20 caracteres' }
}

export const validarAltura = {
  validate: (value) => {
    if (!value) return true
    if (isNaN(value)) return 'Altura: debe ser un número válido'
    return true
  }
}

export const validarPeso = {
  validate: (value) => {
    if (!value) return true
    if (isNaN(value)) return 'Peso: debe ser un número válido'
    return true
  }
}

export const validarOficio = {
  maxLength: { value: 50, message: 'Máximo 50 caracteres' }
}

export const validarBiografia = {
  maxLength: { value: 500, message: 'Máximo 500 caracteres' }
}
